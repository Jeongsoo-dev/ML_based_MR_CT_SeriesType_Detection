---
title: "OS: Processes and Threads"
hide:
  - title
---
# **Processes and Threads**
---

## **1) Process Concept**
A **Process** is an instance of a program in execution (basic unit of work in a system)

Each process includes:

- **Program Code** (Text Section)
- **Program Counter (PC)** – current instruction address
- **Stack** – function calls, local variables
- **Data Section** – global/static variables
- **Heap** – dynamically allocated memory

> A process is not just code, but a running entity with state, memory, and resources.

---

## **2) Process States**

| State        | Description |
|---------------|--------------|
| **New**       | The process is being created. |
| **Ready**     | The process is waiting to be assigned to a CPU. |
| **Running**   | Instructions are being executed. |
| **Waiting (Blocked)** | The process is waiting for some event (e.g., I/O completion). |
| **Terminated** | The process has finished execution. |

### **State Transitions**
New → Ready → Running → Waiting → Ready → Terminated

---

## **3) Process Control Block (PCB)**
The Process Control Block (PCB) stores all information about a process.

| Field | Description |
|--------|-------------|
| **Process State** | Running, Waiting, etc. |
| **Program Counter** | Next instruction address |
| **CPU Registers** | Saved values during context switch |
| **CPU Scheduling Info** | Priority, scheduling parameters |
| **Memory Management Info** | Page tables, segment tables |
| **Accounting Info** | CPU usage, process ID |
| **I/O Status Info** | List of open files, I/O devices |

> The PCB allows the OS to suspend and resume processes efficiently.

---

## **4) Context Switch**
A Context Switch occurs when the CPU switches from one process to another. 

The OS must:

1. Save the current process’s state (PCB)
2. Load the next process’s PCB and restore its state

### **Cost**
Context switching is overhead (no useful work is done during the switch)

---

## **5) Process Scheduling**
Scheduling determines which process runs next on the CPU.

### **Schedulers**
| Scheduler | Description |
|------------|-------------|
| **Long-Term Scheduler** | Selects which processes are admitted into memory (controls degree of multiprogramming). |
| **Short-Term Scheduler** | Chooses which ready process will run next (CPU scheduling). |
| **Medium-Term Scheduler** | Handles swapping (suspending/resuming processes). |

### **Ready Queue & Device Queues**
- **Ready Queue**: All processes waiting for CPU.  
- **Device Queues**: Processes waiting for specific I/O devices.  

---

## **6) Process Creation and Termination**

### **Creation**
- Parent process creates child via `fork()`.
- Child gets a duplicate of the parent’s memory and resources.

```c
pid_t pid = fork();
if (pid == 0) {
    // Child process
    execlp("/bin/ls", "ls", NULL);
} else {
    // Parent process
    wait(NULL);
}
```
### Termination

- Normal exit (exit())
- Error exit
- Killed by another process (abort())
- Cascading termination: when a parent terminates, all children are also killed.

## **7) Process Hierarchies**
Processes form parent–child relationships.

Parent may share resources or restrict child access.

In UNIX:

- `ps` command shows parent PID (PPID).
- `init` (PID 1) is ancestor of all processes.

## **8) Interprocess Communication (IPC)**
Reasons for IPC
- Data sharing
- Computation speedup
- Modularity (separation of concerns)

| Model               | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| **Shared Memory**   | Processes share a region of memory and communicate via read/write operations.  |
| **Message Passing** | Processes communicate via send/receive messages (used in distributed systems). |

## **9) Threads – The Lightweight Process**
A Thread is the smallest unit of CPU utilization, consisting of:

- Thread ID
- Program Counter
- Register Set
- Stack

Threads share within the same process:

- Code Section
- Data Section (globals, heap)
- OS Resources (files, signals, address space)

> Threads in the same process communicate cheaply via shared memory, but must synchronize to avoid races.

---

## **10) Benefits of Multithreading**
| Advantage            | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **Responsiveness**   | UI stays responsive while background tasks (I/O, compute) proceed.          |
| **Resource Sharing** | Threads share the same address space and resources of the process.          |
| **Economy**          | Creating/switching threads is cheaper than processes.                       |
| **Scalability**      | Maps naturally onto multicore CPUs for speedups.                            |

---

## **11) Multithreading Models**
| Model            | Mapping                    | Pros                                        | Cons                                        |
|------------------|----------------------------|---------------------------------------------|---------------------------------------------|
| **Many-to-One**  | Many user -> 1 kernel       | Simple, low overhead                         | One blocks all; no true parallelism         |
| **One-to-One**   | 1 user -> 1 kernel          | True parallelism, better isolation           | Higher overhead (many kernel threads)       |
| **Many-to-Many** | Many user -> Many kernel    | Combines benefits; flexible scheduling       | More complex implementation                 |

---

## **12) Example: Pthreads**
```c
#include <pthread.h>
#include <stdio.h>

void* print_message(void* arg) {
    printf("Hello from thread!\n");
    return NULL;
}

int main() {
    pthread_t thread;
    pthread_create(&thread, NULL, print_message, NULL);
    pthread_join(thread, NULL);
    return 0;
}
```
Functions:

- `pthread_create()` – Create a thread
- `pthread_join()` – Wait for thread to finish
- `pthread_exit()` – Terminate thread
- `pthread_yield()` – Yield CPU voluntarily

> A process is an independent execution unit; a thread is a lightweight component sharing the same resources. Always distinguish between process-level isolation and thread-level concurrency.
