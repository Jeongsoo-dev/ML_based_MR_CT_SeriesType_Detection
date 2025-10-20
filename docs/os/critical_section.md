---
title: "OS: Critical Section"
hide:
  - title
---

# OS : Critical Section

- **Author:** Jeongsoo Pang  

## **1) Concept**
- **Critical Section (CS):** A section of code that **accesses shared state**, however, **must not be executed by more than one thread/process at the same time**.
- **Goal:** Prevent **race conditions** (nondeterministic bugs caused by interleavings of reads/writes to shared data)..
**Classic symptoms of a race:**
- Lost updates (A writes, then B overwrites).
- Read of inconsistent/partial state.
- Occasional test flakiness that “goes away” when adding prints or sleeps.

---

## **2) The “Critical Section Problem”**
A correct solution enforces 3-properties (by Dijkstra):

**1. Mutual Exclusion** 
- At most **one** thread is inside the CS at any time.

**2. Progress** 
- If no thread is inside the CS, **one of the threads wishing to enter must be able to proceed**.

**3. Bounded Waiting (No Starvation)** 
- There is a **finite bound** on the number of times other threads can enter their CS after a thread has requested entry and **before** it gets in.

---

## **3) The 4-part Structure of Concurrent Code**
```text
1. Entry Section -> 2. Critical Section -> 3. Exit Section -> 4. Remainder Section
 (check/acquire)      (touch shared)          (release)          (private work)
```
- **Entry**: Acquire the right to enter the CS (lock, protocol).
- **Critical Section**: Access/modify shared state.
- **Exit**: Release the right (unlock, clear flags).
- **Remainder**: Do private or non-shared work.

---

## **5) Classic Software-Only Algorithms**
> Work on **sequential consistency** and shared memory. Useful to understand **progress/bounded waiting**.

### 5.1 Peterson’s Algorithm (2 threads)
```c
// Shared
volatile bool want[2] = {false, false};
volatile int turn = 0;

// Thread i (i in {0,1}):
want[i] = true;
turn = 1 - i;
while (want[1 - i] && turn == 1 - i) {
/* busy wait /
}

/ ---- Critical Section ---- */
want[i] = false;
```
- Satisfies **mutual exclusion, progress, bounded waiting** (under SC).
- Mostly pedagogical; compilers/CPUs reorder → needs memory barriers in practice.

---

## **6) Hardware Support: Atomic Primitives**
Modern solutions rely on **atomic read-modify-write (RMW)** instructions:
- **Test-and-Set (TAS)**:
```c
bool test_and_set(bool *x) {
bool old = *x;
*x = true;
return old;
}
```
- **Compare-and-Swap (CAS)**: `CAS(addr, expected, new)` atomically does:
```
if (*addr == expected) { *addr = new; return true; } else return false;
```
- **Fetch-and-Add (FAA)**, **XCHG**, or **LL/SC** (Load-Linked/Store-Conditional).

**Memory Ordering:** Many CPUs are not sequentially consistent. Use:
- **Acquire** on loads that observe a lock; **Release** on stores that unlock.
- Fences/barriers as needed (e.g., `atomic_thread_fence(memory_order_seq_cst)`).
- In C/C++ atomics, pair `memory_order_acquire` with `memory_order_release`.

---

## **7) Locks and Locking Primitives**

### 7.1 Spinlock (busy-wait)
Use when CS is **very short** and threads are **truly running on different CPUs**.
```c
// TAS spinlock
std::atomic<bool> locked{false};

void lock() {
while (locked.exchange(true, std::memory_order_acquire)) {
// spin
}
}

void unlock() {
locked.store(false, std::memory_order_release);
}
```
- **Pros:** Simple, low latency for tiny CS.
- **Cons:** Wastes CPU cycles; terrible if CS may block/sleep or be long.
**Improvements:**

### 7.2 Mutex (sleeping lock)
Use when CS can be **longer** or a thread may **block** inside CS.

- If lock unavailable, the kernel places thread on a **wait queue**.
- Often features: **fairness**, **priority inheritance**, **timed trylock**.
```c
pthread_mutex_lock(&m);

/* critical section */
pthread_mutex_unlock(&m);
```

### 7.3 Reader–Writer (Shared/Exclusive) Locks
- **Multiple readers** can enter concurrently (**writers** need exclusivity).
- Variants: **Reader-preferred**, **Writer-preferred**, **Fair**.
- Be careful: Reader preference can starve writers.

---

## **8) Higher-Level Constructs**

### **8.1 Semaphores**
- **Counting** semaphore: integer ≥ 0 with `P()/wait()` and `V()/signal()`.
- **Binary** semaphore ≈ mutex (but with different semantics = no ownership).
- Great for **resource counting** and **producer–consumer**.
```c
semaphore empty = N; // free slots
semaphore full = 0; // filled slots
mutex m = 1;

producer:
wait(empty);
wait(m);
put(item);
signal(m);
signal(full);

consumer:
wait(full);
wait(m);
get(item);
signal(m);
signal(empty);
```

### **8.2 Monitors**
- **Language-level** construct: only one thread executes a monitor’s method at a time (implicit mutual exclusion).
- **Condition variables (CVs)** inside a monitor provide **waiting** and **signaling**:
  -\ `wait(cv)`: atomically releases the monitor lock and blocks.
  -\ `signal(cv)` or `broadcast(cv)`: wake one/all waiting threads.

---

## **9) Kernel vs. User Space**

| Aspect                         | **User Space**                                                                 | **Kernel Space**                                                                                 | Notes |
|---|---|---|---|
| Typical primitives             | `pthread_mutex`, `pthread_rwlock`, `pthread_cond`, semaphores (POSIX)          | spinlocks, mutexes (`mutex`/`rwsem`), RCU, seqlocks, futex backends                              | User locks often use **futex** to sleep in kernel on contention. |
| Contention behavior            | Starts in user mode; enters kernel only when contended (futex wait/wake)       | Fully managed by kernel; may spin or sleep based on lock type and context                        | Minimizes syscalls on fast path in user space. |
| Preemption/interrupts          | Cannot disable either                                                         | Can disable preemption/IRQs for **very short** CS on a CPU                                       | Disabling IRQs ≠ cross-CPU exclusion. |
| Critical-section duration      | Usually longer; may block (I/O, syscalls)                                      | Very short for spin; sleeping locks for longer/IO-touching regions                               | Spin only for microseconds. |
| Sleep inside CS?               | Allowed with **mutex/RW locks** (not with user spinlocks)                      | Never while holding spinlocks; allowed with sleeping locks                                        | Holding a spinlock + sleep → bug. |
| Fairness/starvation controls   | Fair mutexes; RW lock policies (reader/writer pref, fair)                      | Ticket/MCS locks, prio-aware policies                                                             | Kernel often provides stronger fairness knobs. |
| Priority inversion handling    | Via **priority inheritance** (PI) mutexes (e.g., `pthread_mutexattr_setprotocol`) | PI/PCP mechanisms on kernel mutexes                                                               | Use PI for real-time threads. |
| Memory ordering                | C/C++ atomics with acquire/release + fences                                    | Architecture-specific barriers; lock/unlock imply ordering                                        | Same principles; different primitives. |
| Wakeups                        | Futex wake by kernel (targeted wake)                                           | Wait-queues, `wake_up*` APIs                                                                      | Both try to avoid thundering herd. |
| Examples                       | App queues, caches, work pools                                                 | Scheduler runqueues, inode caches, networking fast paths                                          | Choose primitives by context. |

---

## **10) Worked Examples**
### 10.1 Protecting a Shared Counter
**Incorrect:**
```c
// race: i++ is read-modify-write
i++;
```
**Correct (mutex):**
```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void increment() {
  pthread_mutex_lock(&m);
  i++;
  pthread_mutex_unlock(&m);
}
```
**Correct (atomic, lock-free):**
```c
std::atomic<int> i{0};
void increment() {
  i.fetch_add(1, std::memory_order_relaxed);
}
```
> If other invariants exist around `i`, you might need stronger ordering.

### 10.2 Producer–Consumer with Condition Variables (Mesa semantics)
```c
std::queue<int> q;
const size_t CAP = 1024;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

void produce(int item) {
  pthread_mutex_lock(&m);
  while (q.size() == CAP)
  pthread_cond_wait(&not_full, &m);
  q.push(item);
  pthread_cond_signal(&not_empty);
  pthread_mutex_unlock(&m);
}

int consume() {
  pthread_mutex_lock(&m);
  while (q.empty())
  pthread_cond_wait(&not_empty, &m);
  int item = q.front(); q.pop();
  pthread_cond_signal(&not_full);
  pthread_mutex_unlock(&m);
  return item;
}
```

## **11) NOTES**
- Keep CS **minimal** : do not call unbounded or blocking operations inside.
- Clearly **document lock ownership** and **lock ordering** in comments.
- Use **RAII**/scoped guards to avoid forgotten unlocks.
- Prefer **condition variables** over ad-hoc sleeps : always `while (!cond) wait`.
- Consider **priority inversion** in real-time systems: enable **priority inheritance**.
- On weakly ordered CPUs, ensure correct **acquire/release** semantics.

## 12) Cheat-Sheet (table alternative)

| Situation                        | Pick                                 |
|---|---|
| Short CS on multicore?           | Spin (TAS + backoff or MCS)          |
| May block / long CS?             | Mutex or RW lock                     |
| Multiple readers, rare writers?  | Reader–Writer lock or RCU            |
| Pool of N resources?             | Counting semaphore                   |
| Waking sleepers on condition?    | CV with `while (!cond) wait`         |
| Avoid deadlock                   | Global lock order + trylock fallback |


---
