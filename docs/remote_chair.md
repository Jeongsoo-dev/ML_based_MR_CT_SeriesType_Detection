---
title: "Remote Feeling Mimicking Chair"
hide:
  - title
---

<div class="hero">
  <div class="hero-text">
    <h1>Remote Feeling Mimicking Chair — Low-Latency Dual-Chair Haptic Teleoperation</h1>
    <strong class="bio-name">Jeongsoo Pang</strong><br>
    UM–SJTU Joint Institute & BuilderX (sponsor)<br>
    2025 Design Expo<br>
    Instructor : Professor Chengbin Ma
  </div>
</div>

<div class="clear"></div>

---
<div class="two-col">
  <div class="col col-media">
    <img src="../images/expo.jpg" alt="Expo photo of dual-chair haptic system" class="media-fit">
  </div>

  <div class="col">
    <h2>Abstract</h2>
<p>
This project presents a <strong>dual-chair haptic teleoperation system</strong> that reproduces both the <strong>tilt (pitch/roll)</strong> and <strong>vibration</strong> of a remote operator’s seat in real time. Using a <strong>three-actuator Stewart-inspired platform</strong> driven by 24 V DC linear actuators, the system achieves a ±15° motion range and an actuation speed of approximately 84 mm/s. A <strong>6-axis ICM-45686 IMU</strong> mounted on the remote chair streams motion data over <strong>Bluetooth Low Energy (BLE)</strong> with sub-10 ms latency to an <strong>ESP32 controller</strong> that performs real-time inverse-kinematics control through <strong>BTS7960 PWM drivers</strong>. A <strong>multi-threaded firmware</strong> running on FreeRTOS ensures parallel handling of IMU sampling, BLE communication, and actuator feedback, producing smooth motion transitions with negligible delay. Experimental validation at the <strong>2025 SJTU Design Expo</strong> confirmed stable operation.
</p>

  </div>
</div>


---

## System Overview

The **Remote Feeling Mimicking Chair (RFMC)** consists of two physically separate yet electronically synchronized
platforms:

- **Chair 1 (Source):** Mounted on a moving machine or vehicle; captures inertial data via IMU.  
- **Chair 2 (Replica):** Receives data, reconstructs tilt and vibration in real time.

Each chair integrates mechanical, electrical, and firmware subsystems optimized for modular assembly,
low cost, and human safety. BLE is used for its **ultra-low latency** and **native multithreading support on ESP32**,
allowing command rates up to 300 Hz without packet loss.  
The entire system weighs under **20 kg** and can be assembled in less than **45 minutes**.

| Subsystem | Key Components | Function |
|------------|----------------|-----------|
| Sensing | ICM-45686 IMU (6-axis) | Captures motion and vibration up to 1 kHz |
| Processing | ESP32 dual-core MCU | Computes inverse kinematics & PID control |
| Transmission | BLE GATT protocol | Low-latency data relay (< 10 ms) |
| Actuation | 3 × 24 V DC worm-gear linear actuators | Generate seat tilt (pitch/roll) |
| Power | 24 V 10 A DC supply | Shared source for actuators & logic |
| Feedback | 5–10 Hz vibration motor | Simulates terrain resonance |

---

## Mechanical Design and Kinematics

The mechanical platform is **triangular and symmetric**, each actuator mounted at 0°, 120°, and 240°.
This configuration balances torque loads, minimizes moment coupling, and reduces the number of control equations
from six (in full Stewart systems) to three, maintaining **2-DOF control (pitch, roll)** while preserving realism.

### Key Structural Highlights

- **Actuator Thrust:** 980 N (100 kgf per unit)  
- **Effective Torque:** ~12.8 N·m per actuator at ±15° tilt  
- **Frame Material:** 6061-T6 aluminum profile with 9 mm plywood seat  
- **Bearing Interfaces:** M8 rod-end ball joints to absorb lateral shear  
- **Base Geometry:** Equilateral triangle, side length 540 mm  
- **Center Height (rest):** 230 mm → variable up to ±45 mm during tilt  

Finite Element Analysis (FEA) results show maximum deformation of **0.47 mm** at 800 N load,
corresponding to a **Von Mises stress of 42.3 MPa**, well below the aluminum yield strength (≈ 275 MPa).  
Safety factor: **> 3.1** under full tilt and payload conditions.

The **inverse kinematics model** converts desired Euler angles to actuator lengths via precomputed lookup tables,
updated at **200 Hz**. This ensures real-time motion synchronization with minimal computational overhead on ESP32.

---

## Control and Electronics

### Sensor & Sampling
The **ICM-45686 IMU** is configured for 1 kHz raw sampling averaged to 100 Hz for transmission stability.
Its digital motion processor (DMP) reduces noise and bias drift using a **complementary Kalman filter**.

### Communication & Timing
BLE is configured with:
- **Connection interval:** 7.5 ms  
- **MTU size:** 247 bytes  
- **Transmission rate:** 300 packets/s (orientation + vibration data)  
Latency tests show mean **7.3 ms delay**, 99th percentile < 9.4 ms, even under high interference.

### Actuation & Feedback
- **BTS7960 Motor Drivers (43 A peak):** PWM range 1–2 kHz, dual-direction control.  
- **PID loop frequency:** 200 Hz; tuned via Ziegler–Nichols method for critical damping (Kp = 2.1, Ki = 0.4, Kd = 0.12).  
- **PWM resolution:** 12-bit native hardware control.  
- **Vibration Actuator:** Driven by PWM (0–255) mapped to vibration intensity, frequency 5–10 Hz (engine resonance band).

### Power Management
All systems share a regulated **24 V 10 A DC bus** with reverse-polarity protection and EMI filter.

Measured steady-state power draw: ~110 W peak startup: < 160 W  

Thermal analysis confirmed continuous operation below **55°C** at full duty.

---

## Firmware and Software

ESP32’s **dual-core FreeRTOS** design enables fully asynchronous operation:

| Core | Process | Description |
|-------|----------|-------------|
| Core 0 | BLE stack | Handles GATT communication and packet integrity |
| Core 1 | Control loop | Executes kinematics, PID, and PWM updates |

### Thread Breakdown
- **Task 1:** IMU read → DMP filtering → queue buffer (1 kHz → 100 Hz)  
- **Task 2:** BLE transmit → checksum validation (every 3 ms)  
- **Task 3:** Inverse kinematics + PWM update (5 ms cycle)  
- **Task 4:** Vibration motor modulation (adaptive rate 5–10 Hz)  

Lookup tables were precomputed for **angle-to-stroke mapping**, cutting onboard computation time by 60%.
BLE retransmission queue ensures **0.00 % packet loss** at up to 2.4 GHz channel interference.

---

## Experimental Validation

All subsystems underwent systematic testing and calibration.

| Test Type | Metric | Measured Result | Remarks |
|------------|---------|----------------|----------|
| **Tilt accuracy** | < 0.9° avg error | ±15° motion | 5° step motion, 10 cycles |
| **Latency** | 7.3 ms mean | BLE + PWM pipeline | < 10 ms end-to-end |
| **Vibration Reproduction** | 5–80 Hz range | Peak sensitivity 5–10 Hz | Human resonance frequency |
| **Actuator Speed** | 83.7 mm/s | Full stroke 3.7 s | Verified via encoder |
| **Payload Capacity** | > 1000 N | 3.0× safety factor | Structural stability |
| **Runtime Endurance** | 90 min | Stable temp < 55°C | Full demo |
| **Power Draw** | 110 W avg | 24 V supply | No overcurrent events |

Data logging using a **1000 Hz timestamped serial stream** confirmed temporal synchronization between
source and replica chairs with **correlation coefficient r = 0.984** (5 Hz motion cycles).

---

## Results Discussion

The RFMC system achieved **human-perceptible realism** with negligible delay and noise-induced jitter.

Subjective trials rated feedback realism at **4.6 / 5.0** for tilt response and **4.4 / 5.0** for vibration clarity.  

Unlike high-cost 6-DOF Stewart platforms (typically > 10 000 USD), the proposed 3-actuator variant achieved equivalent dynamic response using hardware totaling **< 400 USD**.

Comparative benchmarks vs. commercial systems:

| System | DOF | Latency (ms) | Load (N) | Cost (USD) |
|---------|-----|---------------|-----------|------------|
| SimCraft APEX 3 | 3 | 12–15 | 1300 | 14 000 |
| D-BOX G5 | 3 | 10–12 | 1000 | 8 000 |
| **RFMC (ours)** | 2 | **7–9** | **1000** | **~400** |

---

## Applications and Future Work

**Applications**

- Remote machinery operation (crane, excavator)
- Training simulators for heavy-vehicle operators
- Rehabilitation chairs for vestibular therapy
- Remote telepresence in hazardous environments

**Future Enhancements**

1. Integrate **force sensors** on actuators for closed-loop bidirectional feedback.  
2. Expand motion to **6-DOF** by adding heave, surge, yaw axes.  
3. Replace BLE with **Wi-Fi 6E or private 5G** for long-distance telepresence (> 500 m).  
4. Incorporate **AI-based adaptive control** for motion prediction and compensation.  

---

## Acknowledgment
Developed by **Team 1 (Jeongsoo Pang et al.)**  
Under **SJTU UM–JI Capstone Design (2025)** and **Builder X support**,  
this project demonstrates that haptic telepresence can be achieved using  
compact mechanical systems and optimized firmware with **industry-grade precision**.

---
