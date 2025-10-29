---
title: "OS: Scheduling"
hide:
  - title
---

# Scheduling  
---

## **Scheduler’s Role**
- Multiple processes competing for CPU time
- When more than one is Ready, scheduler chooses who runs next
- Affects perceived system performance
- Scheduling decisions occur on: Process creation, Process exit / blocking, or I/O completion interrupt

---

## **Context Switch Overhead**
Switching tasks is expensive:

- Trap to kernel mode
- Save current CPU state (registers, memory map)
- Select new process & restore its state
- Resume execution  
Too many switches waste CPU time.

---

## **Process CPU Behavior**
Two typical categories:

| Type | Behavior | Resource Usage | Notes |
|---|---|---|---|
| **CPU-bound** | Long computations | Mostly CPU | Few I/O wait times |
| **I/O-bound** | Short bursts | Mostly I/O | Spend time waiting |

> Modern systems become more I/O-bound as CPUs get faster.

---

## **Preemptive vs Non-Preemptive Scheduling**

| Strategy | CPU Ownership Ends When… | Pros | Cons |
|---|---|---|---|
| **Preemptive** | Quantum expires or higher-priority arrival | Better for interactivity | More context switch overhead |
| **Non-Preemptive** | Process blocks or exits | Simpler, lower overhead | Bad response time if long jobs exist |

> Preemption requires timer interrupt/hardware support.

---

## **Scheduling Goals**

| System Type | Major Metrics |
|---|---|
| **All systems** | Fairness, CPU balance, enforce policy |
| **Interactive** | Response time, proportionality |
| **Batch** | Throughput ↑, turnaround time ↓, CPU utilization ↑ |
| **Real-Time** | Meet deadlines, predictability (NO data loss) |  


---

## **Common Scheduling Algorithms**

### **1. First-Come First-Served (FCFS)**
- Non-preemptive
- Simple FIFO queue 
Problem: Long jobs block short ones (convoy effect)

---

### **2. Shortest Job First (SJF)**
- Non-preemptive, requires job length knowledge
- Minimizes average turnaround time
- Not realistic → runtime unknown  
Risk: Starvation of long jobs

---

### **3. Round Robin (RR)**
- Preemptive, equal quantum for each process
- Very common in interactive systems
- Choice of quantum matters:
  - Too small → context switching overhead ↑
  - Too large → degenerates to FCFS

---

### **4. Priority Scheduling**
- Higher priority tasks run first
- Can combine with RR per priority class
- Starvation possible → fix: aging

---

### **5. Lottery Scheduling**
- Random scheduling based on # of tickets
- Dynamic, flexible priority control  
- Good when fairness with weighted share is desired

---

### **6. Earliest Deadline First (EDF)**
- Real-time focused
- Run task with closest deadline first
Hard requirement: process must announce deadline

---

## **Policy vs. Mechanism**
- **Scheduling mechanism**: how scheduling is done
- **Scheduling policy**: who should run + priority rules
- Parent process can set children priority parameters → avoids assumptions  

---

## **Scheduling Threads**
User-level vs Kernel-level scheduling  

- User level threads: Kernel unaware → user scheduler only
- Kernellevel threads: Kernel actively chooses runnable threads
- Determines runnable interleavings (A1, B1, A2, …)
---

## **Classic Synchronization Problem: Dining Philosophers**
Illustrates deadlock + starvation risks

![Dining Philosopher](images/dining_1.jpg){ width="900" }

- Five philosophers share chopsticks
- Need mutual exclusion on chopsticks
  
![Solution](images/dining_1.jpg){ width="900" }

Fix involves:

1. Correct resource ordering
2. Mutex + state tracking
3. Semaphores controlling neighbors  
