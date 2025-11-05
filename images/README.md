## Assignment 5 
519370990016 Jeongsoo Pang

### Ex. 1 — Simple questions

#### 1. A system has two processes and three identical resources. Each process needs a maximum of two resources. Can a deadlock occur? Explain.

Deadlock can occur under four conditions; 

1. Mutual Exclusion: resources are non-shareable
2. Hold and Wait: processes may hold one resource and requent another.
3. No Preemption: allocated resources cannot be forcibly taken away. 
4. Circular Wait: each process is waiting for resouce held by another. 

Now suppose each process holds 1 resource and is waiting for 1 more. That uses 2 out of 3 resources, leaving one free resource. This remaining resource can be given to one of the processes, allowing it to complete, release all resources, and then other process proceeds.

Since one resource will always be available, the system can always break a circular wait. Therefore, deadlock cannot occur with 2 processes and 3 resources when each needs at most 2.

#### 2. A computer has six tape drives, with n processes competing for them. Each process may need two drives. For which values of n is the system deadlock free? 

A deadlock would occur if every process holds one drive and is waiting for one more, while no free drives remain. 

- n = 6: each process could hold 1 drive, all 6 drives are allocated, no free drives, and circular wait is possible.

- n ≤ 5: at most 5 drives are in use, at least 1 drive remains free, one process can obtain its second drive, finish, release both, and free the system from deadlock.

Therefor, the system is deadlock-free for n ≤ 5, and a deadlock becomes possible starting from n = 6.

#### 3. A real-time system has four periodic events with periods of 50, 100, 200, and 250 msec each. Suppose the four events require 35, 20, 10, and x msec of CPU time, respectively. What is the largest value x for which the system is schedulable?

**Utilization computation**

$$
U \;=\; \frac{35}{50}+\frac{20}{100}+\frac{10}{200}+\frac{x}{250}
\;=\; 0.70 + 0.20 + 0.05 + \frac{x}{250}
\;=\; 0.95 + \frac{x}{250}.
$$

**Schedulability condition**

$$
0.95 + \frac{x}{250} \;\le\; 1
\;\Longrightarrow\;
\frac{x}{250} \le 0.05
\;\Longrightarrow\;
x \le 12.5\ \text{ms}.
$$

#### 4. Round-robin schedulers normally maintain a list of all runnable processes, with each process oc-curring exactly once in the list. What would happen if a process occurred more than once in the list? Would there be any reason for allowing this?

In standard Round-robin scheduler, each runnable process appears exactly once, and each receives one time quantum per full rotation.

If process appears multiple times in the list:

- It will receive multiple quanta per cycle, effectively getting more CPU time.

- This creates a weighted round-robin effect where some processes get higher priority or greater CPU share.

Round-robin schedulers is allowed with purpose to give more CPU to interactive or high priority processes, to simulate shorter time slices for specific tasks without changing the global quantum, and to implement proportional share scheduling.

#### 5. Can a measure of whether a process is likely to be CPU bound or I/O bound be detected by analyzing the source code. How to determine it at runtime?

From source code alone, not reliably. The number of I/O calls or loops can give hints, but factors like compiler optimizations, data size, cache behavior, system calls, or external devices make static analysis unreliable.

However, during runtime, OS can measure (CPU burst length, time spent waiting for I/O vs executing on CPU, and system call rate or disk/network access frequency).

### Exercise 2 — Deadlocks 

Assuming three resources consider the following snapshot of a system.

| Process | Allocated | Maximum | Available |
|---------|-----------|---------|-----------|
| P1      | 010       | 753     | 332       |
| P2      | 200       | 322     |           |
| P3      | 302       | 902     |           |
| P4      | 211       | 222     |           |
| P5      | 002       | 433     |           |

#### 1. Determine the content of the Request (Need) matrix.
Row-wise calculations:

- \(P_1: (7,5,3) - (0,1,0) = (7,4,3)\)  
- \(P_2: (3,2,2) - (2,0,0) = (1,2,2)\)  
- \(P_3: (9,0,2) - (3,0,2) = (6,0,0)\)  
- \(P_4: (2,2,2) - (2,1,1) = (0,1,1)\)  
- \(P_5: (4,3,3) - (0,0,2) = (4,3,1)\)  

Need matrix:
$$
\mathbf{Need} =
\begin{bmatrix}
7 & 4 & 3 \\
1 & 2 & 2 \\
6 & 0 & 0 \\
0 & 1 & 1 \\
4 & 3 & 1
\end{bmatrix}
$$

#### 2. Is the system in a safe state?
Available resources: $[3,3,2]$. 

I attempt to find a safe sequence using the Banker's Algorithm.

1. **$P_2$**: Need $(1,2,2)\le(3,3,2)$  
   Work update:
   $$
   \mathbf{Work}\leftarrow(3,3,2)+(2,0,0)=(5,3,2)
   $$

2. **$P_4$**: Need $(0,1,1)\le(5,3,2)$  
   Work update:
   $$
   \mathbf{Work}\leftarrow(5,3,2)+(2,1,1)=(7,4,3)
   $$

3. **$P_5$**: Need $(4,3,1)\le(7,4,3)$  
   Work update:
   $$
   \mathbf{Work}\leftarrow(7,4,3)+(0,0,2)=(7,4,5)
   $$

4. **$P_1$**: Need $(7,4,3)\le(7,4,5)$  
   Work update:
   $$
   \mathbf{Work}\leftarrow(7,4,5)+(0,1,0)=(7,5,5)
   $$

5. **$P_3$**: Need $(6,0,0)\le(7,5,5)$  
   Work update:
   $$
   \mathbf{Work}\leftarrow(7,5,5)+(3,0,2)=(10,5,7)
   $$
   
#### 3. Can all the processes be completed without the system being in an unsafe state at any stage?
Yes, executing processes in the safe sequence above ensures that at no stage does the system enter an unsafe state, and all processes complete.

### Ex. 3 — The reader-writer problem 

In the reader-writer problem, some data could be accessed for reading but also sometimes for writing. When processes want to read the data they get a read lock and a write lock for writing. Multiple processes could get a read lock at the same time while a write lock should prevent anybody else from reading or writing the data until the write lock is released.

To solve the problem we decide to use a global variable count together with two semaphores: count_lock for locking the count variable, and db_lock for locking the database. To get a write lock we can proceed as follows:

```c
void write_lock() {
    down(db_lock);
}

void write_unlock() {
    up(db_lock);
}
```

#### 1. Explain how to get a read lock, and write the corresponding pseudocode.
Readers may share the database. The first reader locks db_lock and the last reader releases it.
```c++
void read_lock() {
    down(count_lock);
    count++;
    if (count == 1)
        down(db_lock);
    up(count_lock);
}

void read_unlock() {
    down(count_lock);
    count--;
    if (count == 0)
        up(db_lock);
    up(count_lock);
}
```
- Mutual exclusion on count is ensured by count_lock.
- While at least one reader is active, db_lock stays held, so no writer can enter.

#### 2. Describe what is happening if many readers request a lock.
With the baseline above, new readers can continuously arrive and "chain" the read section: before the last reader finishes, another reader increments count, keeping db_lock held the whole time. As a result, writers may starve even though no true deadlock occurs. This is classic reader preference problem.

>To overcome the previous problem we will block any new reader when a writer becomes available.

#### 3. Explain how to implement this idea using another semaphore called read_lock.
To prevent writer starvation, I added a gate that writers close before trying to write. Readers must pass through the same gate briefly. If a writer is waiting and has closed the gate, new readers will queue instead of slipping in.

```c++
void write_lock() {
    down(read_lock); // close the gate
    down(db_lock); // take exclusive access
}

void write_unlock() {
    up(db_lock);
    up(read_lock); // reopen gate so readers proceed
}

// Reade must pass the gate
void read_lock() {
    down(read_lock); // pass the gate
    up(read_lock); // reopen for others behind

    down(count_lock);
    count++;
    if (count == 1)
        down(db_lock); // first reader acquires DB
    up(count_lock);
}

void read_unlock() {
    down(count_lock);
    count--;
    if (count == 0)
        up(db_lock); // last reader releases DB
    up(count_lock);
}
```
- A writer that arrives grabs read_lock and keeps it until done, and it prevents new readers from entering read_lock().

- Readers already inside their critical path can finish, and once count drops to 0, writer gets db_lock and proceeds.

#### 4. Is this solution
The above is writer preference: once a writer takes read_lock, all new readers must wait. This eliminates writer starvation, but in a heavy writer arrival pattern, readers can starve. With read_lock as above, the system is safe (mutual exclusion holds) and free of writer starvation. However, For two-way fairness, adopting a fair turnstile is required.



