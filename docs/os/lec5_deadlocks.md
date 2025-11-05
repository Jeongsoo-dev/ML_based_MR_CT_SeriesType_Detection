---
title: "OS: Deadlocks"
hide:
  - title
---

# OS : Deadlocks  
---

## 1. What is a Deadlock

Deadlock occurs when a set of processes are blocked forever, each waiting for a resource held by another process.

### Four Necessary Conditions (Coffman’s Conditions)  
A deadlock can happen only if all four are true:

| Condition | Description |
|-----------|-------------|
| **1. Mutual Exclusion** | A resource can be held by only one process at a time |
| **2. Hold and Wait** | A process holds at least one resource and waits for others |
| **3. No Preemption** | Resources cannot be forcibly taken from a process |
| **4. Circular Wait** | A cycle of processes each waiting for others’ resources |

---

## 2. Resource Types

| Resource Type | Description | Example |
|---------------|-------------|---------|
| **Preemptable** | Can be taken away safely | CPU, RAM pages |
| **Non-preemptable** | Cannot be taken without causing failure | Printer, DVD burner |  

---

## 3. Resource Allocation Graph (RAG)

- **Process → Resource (request)**
- **Resource → Process (assigned)**  
- If a cycle exists and each resource has only 1 instance → Deadlock

Example:  
P1 → R1 → P2 → R2 → P1 → Deadlock

---

## 4. Example — Deadlock Detection (Single Instance)

Given the graph, detect cycle:

- D holds **U**, waiting for **S** and **T**  
- E holds **T**, waiting for **V**  
- G holds **V**, waiting for **U**  

**Cycle detected:**  
U (held by D) → T (held by E) → V (held by G) → U

**Deadlock exists among D, E, G.**

---

## 5. Ostrich Algorithm

> “If it rarely occurs, ignore it”
 
Used by UNIX/Linux systems because full prevention is costly.  
Good if "cost of handling deadlock" > "cost of ignoring".

---

## 6. Deadlock Detection (Multiple Resource Instances)

Uses matrices:  

| Symbol | Meaning |
|--------|----------|
| **E** | Existing resources |
| **A** | Available resources |
| **C** | Current allocation |
| **R** | Request (need matrix) |  


Deadlock exists if no process's request can be satisfied with A, and this persists.

---

## 7. Recovering from Deadlock

| Method | Description | Disadvantage |
|--------|-------------|--------------|
| **Preemption** | Take resources from processes | May cause corruption |
| **Kill Process** | Terminate one or more in deadlock | Lose progress |
| **Rollback** | Use saved checkpoints to restart | Requires checkpoint system |  

---

## 8. Deadlock Avoidance

### Safe vs Unsafe State (Resource Trajectories)  
| State | Meaning |
|-------|---------|
| **Safe** | There exists some order in which all processes can finish |
| **Unsafe** | Might lead to deadlock later, no guaranteed completion |

> Unsafe ≠ Deadlock. But avoid entering unsafe state.  

---

### Banker’s Algorithm (Dijkstra, 1965)

Goal: Avoid unsafe states by simulation before granting a request. 
Works if system knows in advance: max resources each process may need.

#### Banker’s Check:
1. If **Request ≤ Available**, pretend to allocate resources.
2. Check if resulting state is Safe (using safety algorithm).
3. If safe → grant request and if unsafe → deny.  

---

### Example — Safety Test

**Resource types:** Scanners, Plotters, Printers, DVD  
**Totals:**  E = (6, 3, 4, 2)  
**Available:** A = (1, 1, 2, 0)  

**Allocation C** (rows = P1..P5):

- P1: (3,0,1,1)
- P2: (0,1,0,0)
- P3: (1,0,1,0)
- P4: (1,1,0,1)
- P5: (0,0,0,0)

**Need R** (remaining request):

- P1: (2,1,0,0)
- P2: (0,1,1,1)
- P3: (3,1,0,0)
- P4: (0,0,1,0)
- P5: (3,1,1,0)

**Safety test (find completion order):**
1) A=(1,1,2,0). **P4** need (0,0,1,0) ≤ A → run P4, release C4=(1,1,0,1)  
   New A = (2,2,2,1)
2) **P2** need (0,1,1,1) ≤ A → run P2, release C2=(0,1,0,0)  
   New A = (2,3,2,1)
3) **P1** need (2,1,0,0) ≤ A → run P1, release C1=(3,0,1,1)  
   New A = (5,3,3,2)
4) **P3** need (3,1,0,0) ≤ A → run P3, release C3=(1,0,1,0)  
   New A = (6,3,4,2)
5) **P5** need (3,1,1,0) ≤ A → run P5 (C5=0)

**Safe sequence:** **P4 → P2 → P1 → P3 → P5** ⇒ State is SAFE

---

## 9. Deadlock Prevention

Break at least one of 4 conditions:

| Condition Broken | Strategy | Practical? |
|------------------|----------|------------|
| **Mutual Exclusion** | Make resources sharable | X Not possible for printer |
| **Hold & Wait** | Ask all resources at once | X Inefficient |
| **No Preemption** | Take resource forcibly | X Can corrupt data |
| **Circular Wait** | Impose ordering on resources | O Most practical |  

---

## 10. Real-world Deadlock-Like Situations

| Issue | Meaning |
|-------|--------|
| **Livelock** | Processes are active, but no one makes progress |
| **Starvation** | A process never gets resources even if system runs |
| **Database Deadlocks** | Two-phase locking used to avoid conflicts |
| **Communication Deadlocks** | Processes wait for messages, no hardware involved |  

---

<sub>© Jeongsoo Pang — All rights reserved
