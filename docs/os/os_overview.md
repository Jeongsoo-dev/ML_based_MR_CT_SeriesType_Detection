---
title: "OS: Operating Systems Overview"
hide:
  - title
---

# **Operating Systems Overview**
---

## **1) Operating System**
An Operating System (OS) is a program that manages computer hardware and provides services for application programs.  

### **Main Roles**
1. **Resource Manager** – Manages CPU, memory, I/O devices, and storage.  
2. **Control Program** – Controls execution of user programs and prevents errors.  
3. **Abstraction Layer** – Hides hardware complexity and provides simple interfaces.  

>  OS acts as an intermediary between hardware and user programs

---

## **2) OS Goals and Functions**
| Function | Key Term | Description |
|-----------|-----------|-------------|
| **Resource Allocation** | CPU Scheduling, Memory Management | Allocates system resources among multiple processes |
| **Concurrency Control** | Process Synchronization | Prevents data corruption in concurrent execution |
| **Protection & Security** | Access Control, Authentication | Manages permissions and secure access |
| **Abstraction** | Virtual Memory, File System | Simplifies hardware details via logical models |
| **Error Handling** | Fault Tolerance | Detects and recovers from errors |

---

## **3) OS Structure & Components**

### **Major Components**
| Component | Term | Core Function |
|------------|------|----------------|
| **Process Manager** | Process Management | Process creation, scheduling, termination |
| **Memory Manager** | Memory Management | Controls physical and virtual memory |
| **File System** | File Management | Handles files, directories, and permissions |
| **I/O Manager** | Input/Output Management | Manages device drivers and interrupts |
| **Protection System** | Security/Protection | Provides access control and isolation |
| **Command Interpreter** | Shell | Converts user commands to system calls |

---

## **4) OS as an Abstraction Layer**

### **Concept**
The OS hides hardware complexity through **abstraction layers** that make resources easier to use.

**Flow: Physical Hardware → OS Abstractions → System Calls → Applications**

### **Example**
| Hardware | OS Abstraction | User Interface |
|-----------|----------------|----------------|
| Disk | File | File System |
| Memory | Address Space | Virtual Memory |
| CPU | Process | Scheduler |

---

## **5) System Calls**

### **Definition**
A System Call is the interface between a user program and the **OS kernel, allowing programs to request OS services.

```c
// Example: Linux System Calls
int fd = open("data.txt", O_RDONLY);
read(fd, buffer, 128);
close(fd);
```

### Categories of System Calls

| Category                    | Example                 | Description                              |
| --------------------------- | ----------------------- | ---------------------------------------- |
| **Process Control**         | fork(), exec(), wait()  | Create, manage, and terminate processes  |
| **File Manipulation**       | open(), read(), write() | Access and modify files                  |
| **Device Manipulation**     | ioctl(), read()         | Control I/O devices                      |
| **Information Maintenance** | getpid(), alarm()       | Retrieve process or system information   |
| **Communication**           | pipe(), shmget()        | Enable Inter-Process Communication (IPC) |

## **6) Computer System Organization**
- System Layers

1. Hardware – CPU, Memory, I/O Devices
2. Operating System Kernel – Core system control
3. System Programs – Command interpreters, compilers, utilities
4. User Applications – User-level programs

- Interrupts

An Interrupt is a signal from hardware or software to the CPU indicating an event that needs immediate attention.

The OS maintains an Interrupt Vector Table (IVT) to dispatch appropriate routines.

## **7) Modes of Operation**
| Mode            | Description                                      | Example                              |
| --------------- | ------------------------------------------------ | ------------------------------------ |
| **User Mode**   | Restricted access; system calls required for I/O | Running user applications            |
| **Kernel Mode** | Full access to hardware and system resources     | Executing system calls, I/O handling |

Mode Bit: A CPU flag indicating current privilege level.

- 0 : Kernel Mode
- 1 : User Mode

## **8) Dual-Mode Operation and Protection**
### Goal

Prevent user programs from directly interfering with OS or other programs.

### Protection Mechanisms

- Timer Interrupts – Prevent infinite loops or CPU hogging

- Memory Protection – Protect OS and other processes’ memory regions

- I/O Privilege Levels – Allow only kernel code to execute device operations

## **9) Boot Process**

1. Power On – CPU starts execution at a fixed memory address
2. Bootstrap Program (Firmware / BIOS) executes from ROM
3. Bootloader loads the OS kernel into memory
4. Kernel Initialization – Sets up system tables and starts services
5. User Processes – Launch user-level programs

## **10) Important Terms to Memorize**
| Term                  | Definition                                               |
| --------------------- | -------------------------------------------------------- |
| **Kernel**            | Core component of OS responsible for hardware management |
| **System Call**       | Interface for user programs to request OS services       |
| **Interrupt**         | Signal notifying CPU of an event needing attention       |
| **Context Switch**    | CPU switches from one process to another                 |
| **Trap**              | Software-generated interrupt to invoke OS functions      |
| **Privilege Level**   | CPU protection mode controlling access rights            |
| **Bootstrap Program** | Initial firmware code that loads the OS kernel           |

