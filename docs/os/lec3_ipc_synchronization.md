---
title: "OS: Interprocess Communication & Synchronization"
hide:
  - title
---

# **Interprocess Communication (IPC) & Synchronization**
---

## **1) IPC & Synchronization**
- **Goal**: Coordinate concurrent processes/threads that access shared state to avoid race conditions and ensure correctness.
- **Core correctness properties** *(Dijkstra)*:
  1. **Mutual Exclusion** — At most one thread is in the Critical Section (CS).
  2. **Progress** — If no one is in CS, someone wanting to enter can eventually proceed.
  3. **Bounded Waiting (No Starvation)** — A thread will not wait forever to enter CS.

> Race Condition: Outcome depends on interleaving of operations on shared data.

---

## **2) Critical Section Patterns**
### 2.1 Structure
```text
entry_section();   // acquire
/* Critical Section: read/write shared data */
exit_section();    // release
remainder_section();
```

### 2.2 Approaches

- Software-only: Strict alternation, Peterson’s Algorithm (2 threads), bakery algorithm (N threads).

- Hardware support: Atomic Instructions (Test-and-Set, Compare-and-Swap, Fetch-and-Add), Disable Interrupts (kernel-only, short).

- OS primitives: Mutex, Semaphore, Condition Variable, Monitor.

---

## 3. Mutex & Condition Variables
### 3.1 Mutex

Ensures mutual exclusion around a CS.
```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

pthread_mutex_lock(&m);
/* Critical Section */
pthread_mutex_unlock(&m);
```
### 3.2 Condition Variable (CV)
Wait for a predicate to become true, atomically releasing & reacquiring the mutex.
```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  cv = PTHREAD_COND_INITIALIZER;
int ready = 0;

void wait_until_ready() {
    pthread_mutex_lock(&m);
    while (!ready) // ALWAYS use while: guard against spurious wakeups
        pthread_cond_wait(&cv, &m); // releases m while waiting, reacquires before return
    /* proceed */
    pthread_mutex_unlock(&m);
}

void signal_ready() {
    pthread_mutex_lock(&m);
    ready = 1;
    pthread_cond_signal(&cv);
    pthread_mutex_unlock(&m);
}
```
---

## 4. Semaphores

Counting semaphore: integer value with two atomic ops.

- P / wait / down() — decrement (if negative → block)
- V / signal / up() — increment (if ≤ 0 → wake one)

### 4.1 Binary Semaphore as Mutex

```c
sem_t s; sem_init(&s, 0, 1);
sem_wait(&s);   /* CS */
sem_post(&s);
```

### 4.2 Producer–Consumer (Bounded Buffer)
```c
#define N  ...
item_t buf[N]; int in=0, out=0;

sem_t empty, full, mutex;

void producer(item_t x){
    sem_wait(&empty);
    sem_wait(&mutex);
    buf[in] = x; in = (in+1)%N;
    sem_post(&mutex);
    sem_post(&full);
}

item_t consumer(){
    item_t x;
    sem_wait(&full);
    sem_wait(&mutex);
    x = buf[out]; out = (out+1)%N;
    sem_post(&mutex);
    sem_post(&empty);
    return x;
}
```
> Order matters: Avoid lost wakeups and deadlock (always acquire/release in consistent order).

---

## 5. Monitors

- High-level abstraction that encapsulates shared data, mutex, and condition variables.
- Methods are mutually exclusive (wait & signal on CVs inside monitor).
```pseudo
monitor BoundedBuffer {
  condition not_full, not_empty;
  item_t buf[N]; int in=0, out=0, cnt=0;

  procedure put(x){
    while (cnt==N) wait(not_full);
    buf[in]=x; in=(in+1)%N; cnt++;
    signal(not_empty);
  }

  procedure get(out_x){
    while (cnt==0) wait(not_empty);
    out_x = buf[out]; out=(out+1)%N; cnt--;
    signal(not_full);
  }
}
```
---
## **6) Deadlock**
### **6.1 Coffman Conditions**:

1. **Mutual Exclusion** — Some resources are non-shareable.
2. **Hold and Wait** — A process holds at least one resource and requests additional ones.
3. **No Preemption** — Resources cannot be forcibly taken; they must be released voluntarily.
4. **Circular Wait** — A circular chain exists: P1 waits for a resource held by P2, …, Pn waits for a resource held by P1.

### **6.2 Prevention**
Break at least one Coffman condition:

- **No Hold-and-Wait**: Request all resources at once (downsides: low utilization, possible starvation).
- **Preemption**: Allow resources to be preempted and rolled back to a safe state.
- **Resource Ordering**: Impose a total order on resource acquisition; processes must request in ascending order.

### **6.3 Avoidance (Banker’s Algorithm)**
- Admit a request only if the system remains in a safe state (there exists some order of process completion).
- Requires processes to declare maximum resource needs; works best with predictable demands.

### **6.4 Detection & Recovery**
- **Detection**: Build a wait-for graph (WFG); cycle -> deadlock.
- **Recovery**: Abort processes and  rollback the victim to a checkpoint and reclaim resources.

---

## **7) Performance Considerations**
| Topic | Guidance |
|------|----------|
| **Busy Waiting vs Blocking** | Spin only for short waits; otherwise block to save CPU. |
| **Lock Granularity** | Coarse locks → simpler but less parallel; fine-grained → higher concurrency but complex. |
| **Contention** | Shorten critical sections; partition data; prefer read–write locks for read-mostly workloads. |
| **False Sharing** | Pad hot fields to cache line size to avoid cache thrashing. |
| **Lock-Free** | Use CAS + backoff; manage memory safely (ABA, hazard pointers, epoch reclamation). |

---

## **8) Memory Ordering**
- Compilers/CPUs may reorder instructions.
- Locks, atomics, and condition variables establish happens-before relationships.
- For lock-free algorithms, use C/C++ atomics with explicit memory orders and fences.

---

## **10) Key Terms to Memorize**
| Term | Definition |
|------|------------|
| **Mutual Exclusion** | Only one thread may execute in the critical section at a time. |
| **Progress** | If CS is free, some waiting thread can proceed. |
| **Bounded Waiting** | Each thread’s wait to enter CS is finitely bounded. |
| **Semaphore (P/V)** | Counting primitive with atomic wait/signal operations. |
| **Mutex** | Binary lock for exclusive access. |
| **Condition Variable** | Wait/signal mechanism for a predicate under a mutex. |
| **Monitor** | Encapsulated shared state + mutex + CVs; methods are mutually exclusive. |
| **Deadlock** | A cycle of threads each waiting for resources held by others. |
| **Starvation** | A thread never progresses despite overall system activity. |
| **Spinlock** | Busy-wait lock using TAS/CAS; best for very short CS. |

---

## **Summary**
- Deadlock requires all four Coffman conditions (prevention breaks at least one)
- Banker’s Algorithm avoids unsafe states given known maximum demands.
- Choose primitives and designs that ensure safety (no races) and liveness (no starvation), while optimizing performance.

---

> For deadlock questions: state Coffman, then give one concrete prevention.
> When using CVs: guard predicates with a while-loop; with semaphores: preserve acquire/release order.
> Argue both safety and liveness for full credit (what can’t happen vs. what must eventually happen).
