---
title: "OS: Critical Section"
hide:
  - title
---

# OS : Critical Section

- **Author:** Jeongsoo Pang  

## 1) What is a “Critical Section”?
- **Critical Section (CS):** A section of code that **accesses shared state** (e.g., shared variables, file descriptors, kernel data structures, device registers) and therefore **must not be executed by more than one thread/process at the same time**.
- **Goal:** Prevent **race conditions**—nondeterministic bugs caused by interleavings of reads/writes to shared data.
**Classic symptoms of a race:**
- Lost updates (A writes, then B overwrites).
- Read of inconsistent/partial state.
- Occasional test flakiness that “goes away” when adding prints or sleeps.

---

## 2) The “Critical Section Problem”
A correct solution enforces these three properties (originally by Dijkstra):

**Mutual Exclusion:** At most **one** thread is inside the CS at any time.

**Progress:** If no thread is inside the CS, **one of the threads wishing to enter must be able to proceed**—no unrelated thread can postpone them forever.

**Bounded Waiting (No Starvation):** There is a **finite bound** on the number of times other threads can enter their CS after a thread has requested entry and **before** it gets in.

(**Performance desiderata**, not a safety property): Avoid busy waiting when possible; minimize context switches; scale with cores.

---

## 3) The 4-part Structure of Concurrent Code
```text
Entry Section -> Critical Section -> Exit Section -> Remainder Section
(check/acquire) (touch shared) (release) (private work)
```
- **Entry**: Acquire the right to enter the CS (lock, protocol).
- **Critical Section**: Access/modify shared state.
- **Exit**: Release the right (unlock, clear flags).
- **Remainder**: Do private or non-shared work.

---

## 4) Naïve (Incorrect) Attempts
- **Disabling interrupts (user space):** Not allowed; even in kernel it only prevents **preemption** on one CPU—**does not** stop other cores.
- **Simple flags:** `if (available) available=false;` is itself a race.
- **Just sleep/yield:** Timing hacks are nondeterministic and brittle.

---

## 5) Classic Software-Only Algorithms (Historical but Educational)
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

### 5.2 Dekker, Bakery (Lamport), etc.
- **Dekker’s**: First correct solution for two processes without atomic ops.
- **Bakery algorithm**: N-process generalization (like taking a number at a bakery). Works under SC with **read/write** variables only.

---

## 6) Hardware Support: Atomic Primitives
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

## 7) Locks and Locking Primitives

### 7.1 Spinlock (busy-wait)
**Use when**: CS is **very short** and threads are **truly running on different CPUs**.
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
- **Test–Test&Set**: Reduce cache traffic by first spinning on reads.
- **Backoff**: Exponential backoff to reduce contention.
- **Queue locks (MCS, CLH)**: Fair spinning; each waiter spins on a local variable, improving scalability under high contention.

### 7.2 Mutex (sleeping lock)
**Use when**: CS can be **longer** or a thread may **block** inside CS.
- If lock unavailable, the kernel places thread on a **wait queue** (no CPU burn).
- Often features: **fairness**, **priority inheritance**, **timed trylock**.
```c
pthread_mutex_lock(&m);
/* critical section */
pthread_mutex_unlock(&m);
```

### 7.3 Reader–Writer (Shared/Exclusive) Locks
- **Multiple readers** can enter concurrently; **writers** need exclusivity.
- Variants: **Reader-preferred**, **Writer-preferred**, **Fair** (avoid starvation).
- Be careful: Reader preference can starve writers; writer preference can reduce read throughput.

### 7.4 Recursive locks
- Permit the **same thread** to lock the same mutex multiple times.
- Avoid unless necessary (they hide design issues and risk deadlocks).

---

## 8) Higher-Level Constructs

### 8.1 Semaphores
- **Counting** semaphore: integer ≥ 0 with `P()/wait()` and `V()/signal()`.
- **Binary** semaphore ≈ mutex (but with different semantics—no ownership).
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

### 8.2 Monitors
- **Language-level** construct: only one thread executes a monitor’s method at a time (implicit mutual exclusion).
- **Condition variables (CVs)** inside a monitor provide **waiting** and **signaling**:
-\ `wait(cv)`: atomically releases the monitor lock and blocks.
-\ `signal(cv)` or `broadcast(cv)`: wake one/all waiting threads.
**Two CV semantics:**
- **Hoare-style**: Signal hands off **immediately** to the waiter (rare in practice).
- **Mesa-style (POSIX/C++/Java)**: Signal puts waiter on ready queue; signaller continues; waiter must **recheck the condition** after waking.
**Mesa-style pattern (always use loops):**
```c
pthread_mutex_lock(&m);
while (!predicate())
pthread_cond_wait(&cv, &m);
/* critical section based on predicate holds */
pthread_mutex_unlock(&m);
```

---

## 9) Kernel vs. User Space
- **User-space**: pthread mutexes/CVs often start as **futex**/**adaptive** locks; kernel only involved on contention.
- **Kernel-space**: Uses a mix of **spinlocks** (short, IRQ-safe regions), **sleeping locks** (mutexes/rwsems), and **RCU** for read-mostly structures.
- **Disabling preemption/interrupts**: Kernel may do this for **very short** non-preemptible CS on a CPU; not a substitute for cross-CPU mutual exclusion.

---

## 10) Design Patterns for Critical Sections
### 10.1 Keep CS Small and Fast
- Move compute-heavy work **outside** the CS.
- Copy data in/out if needed, modify locally, then write back inside a short CS.
### 10.2 Hand-over-hand (Lock Coupling)
- For linked data structures (e.g., lists, trees): lock the next node **before** unlocking the current.
### 10.3 Partitioning/Sharding
- Use **fine-grained** locks per bucket/partition to reduce contention.
- Or use **lock striping**—array of locks chosen by hash.
### 10.4 Read-Mostly Data: RCU (Read-Copy-Update)
- Readers run **lock-free**, writers create a new version and defer freeing old versions until readers quiesce.
### 10.5 Lock-free / Wait-free
- Use **CAS/LL-SC** loops; often faster under contention and avoids deadlock.
- Requires careful **ABA** handling (e.g., version tags or hazard pointers).

---

## 11) Correctness Concerns
### 11.1 Deadlock (교착상태)
Conditions (Coffman):

Mutual exclusion

Hold and wait

No preemption

Circular wait
**Avoidance/Prevention:**
- **Impose a global lock ordering**; always acquire in the same order.
- **Try-lock with backoff**; detect cycles and release.
- **Two-phase locking**: acquire all needed locks first; if failure, release and retry.
- **Hierarchical locking**: Levels or lock ranks enforced by static analysis.

### 11.2 Starvation
- A thread waits indefinitely while others repeatedly proceed.
- Use **FIFO/queue locks** (MCS), **fair mutex**, or **ticket locks**.

### 11.3 Priority Inversion
- Low-priority thread holds a lock; high-priority thread waits while a medium-priority thread runs—**inversion**.
- **Fix:** **Priority inheritance** (temporarily boosts holder’s priority) or **priority ceiling protocols**.

### 11.4 Reentrancy and Signals
- Don’t take the same non-recursive lock in a **signal handler** or callback that interrupts the holder → deadlock.
- Keep signal handlers reentrant and minimal.

### 11.5 Memory Ordering
- Always pair **acquire** on lock with **release** on unlock so CS writes become visible before unlock and lock sees latest state.

---

## 12) Performance Considerations
- **Contention**: Prefer **fine-grained** or **sharded** locks; avoid global bottlenecks.
- **NUMA effects**: Avoid bouncing cachelines; use per-CPU/per-NUMA locks or data.
- **Spinning vs sleeping**:
\ \ - Spin for **short** holds (microseconds, in kernel or when owner is likely running).
\ \ - Sleep for **longer** holds (I/O, blocking calls).
- **Fast path vs slow path**:
\ \ - Attempt **trylock** + work outside CS; fall back to full lock if necessary.

---

## 13) Worked Examples
### 13.1 Protecting a Shared Counter
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

### 13.2 Producer–Consumer with Condition Variables (Mesa semantics)
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

### 13.3 Avoiding Deadlock with Global Ordering
Assume two locks `A` and `B`. **Rule:** always acquire in alphabetical order.
```c
void f() { // needs A then B
pthread_mutex_lock(&A);
pthread_mutex_lock(&B);
// CS using A and B
pthread_mutex_unlock(&B);
pthread_mutex_unlock(&A);
}

void g() { // also needs A then B (same order!)
pthread_mutex_lock(&A);
pthread_mutex_lock(&B);
// CS
pthread_mutex_unlock(&B);
pthread_mutex_unlock(&A);
}
```

---

## 14) Testing & Debugging Concurrency
- **Stress tests:** Lots of threads, long runs, randomized yields.
- **Systematic schedulers:** Tools that explore interleavings (e.g., model checkers).
- **Thread sanitizers / data race detectors:** Instrumented builds to catch races.
- **Assertions & invariants:** Check shared state consistency at CS boundaries.
- **Deterministic seeds:** Reproduce failures with controlled scheduling when possible.

---

## 15) Practical Guidelines & Checklists
- Keep CS **minimal**; do not call unbounded or blocking operations inside.
- Clearly **document lock ownership** and **lock ordering** in comments.
- Use **RAII**/scoped guards to avoid forgotten unlocks.
- Prefer **condition variables** over ad-hoc sleeps; always `while (!cond) wait`.
- Choose the simplest primitive that fits:
\ \ - short CS & heavy contention → **queue spinlock** (MCS) or **fine-grained** locks
\ \ - long CS or may block → **mutex/rwlock**
\ \ - resource counting → **semaphore**
\ \ - read-mostly structures → **RCU** or **rwlock**
- Consider **priority inversion** in real-time systems; enable **priority inheritance**.
- On weakly ordered CPUs, ensure correct **acquire/release** semantics.

---

## 16) Common Pitfalls (and Fixes)
- **Holding a lock while doing I/O** → long hold times, starvation → **Release before I/O** or split CS; use **reference counts** or **state flags** to keep consistency.
- **Double-checked locking without barriers** → subtle reorder bugs → use **atomics with memory_order** or language/library primitives that guarantee safety.
- **Using a semaphore as a mutex** → ownership confusion → prefer **mutex** for mutual exclusion; use semaphores for **counting resources**.
- **Not rechecking predicate after `cond_signal`** → spurious wakeups → **always loop** around the wait.
- **Recursive locks to “fix” deadlock** → masks design issues → refactor or impose **ordering**.

---

## 17) Glossary (Quick Reference)
- **Mutual Exclusion:** Only one thread in CS.
- **Progress:** If CS empty and someone wants in, someone gets in.
- **Bounded Waiting:** Finite bound before a waiter enters.
- **Spinlock:** Busy-wait lock using CPU cycles.
- **Mutex:** Sleeping lock with ownership semantics.
- **Semaphore:** Counting sync primitive (`wait/signal`).
- **Monitor:** Language/runtime construct with implicit mutex + CVs.
- **Condition Variable:** Wait/signal on a predicate (with a mutex).
- **CAS/TAS/FAA/LL-SC:** Atomic RMW primitives.
- **RCU:** Read-Copy-Update; lockless reads.
- **Priority Inversion:** Low-prio holds lock; high-prio is blocked by medium-prio.
- **ABA Problem:** CAS sees same value `A` again though it changed (A→B→A).

---

## 18) Mini Cheat-Sheet
- **Short CS on multicore?** → Spin (TAS + backoff or MCS).
- **May block / long CS?** → Mutex or RW lock.
- **Multiple readers, rare writers?** → Reader-Writer lock or RCU.
- **Pool of N resources?** → Counting semaphore.
- **Waking sleepers on condition?** → CV with `while (!cond) wait`.
- **Avoid deadlock** → Global lock order + trylock fallback.

---
