---
title: "Remote Feeling Mimicking Chair"
hide:
  - title
---

<div class="hero hero--chair">
  <img src="../images/expo.jpg" alt="Jeongsoo Pang" class="headshot-hero">

  <div class="hero-text">
    <h1>Remote Feeling Mimicking Chair — Low-Latency Dual-Chair Haptic Teleoperation</h1>
    <strong class="bio-name">Jeongsoo Pang</strong><br>
    UM–SJTU Joint Institute & BuilderX (sponsor)<br>
    2025 Design Expo
  </div>
</div>

<div class="clear"></div>

---

## Abstract
We built a **dual-chair haptic system** that reproduces **tilt** (pitch/roll) and **vibration** from a remote machine seat in real time. **Chair-1** (on the machine) streams IMU motion; **Chair-2** (operator side) sits on a **3-actuator Stewart-inspired platform** and recreates the motion using inverse kinematics and vibration motors. The control core is **ESP32**, with **BLE** providing sub-10 ms command latency and **native PWM** to three linear actuators via BTS7960 drivers. Key capabilities: **±15° pitch/roll**, actuator speed **≈ 84 mm/s**, haptic rate **5–10 Hz**, and **> 1000 N** load. :contentReference[oaicite:1]{index=1}

---

## System Overview

**Chair-1 (Sensing)**
- **ICM45686 6-axis IMU** captures orientation and vibration signatures.  
- **ESP32** performs timestamping, filtering, BLE packetization.

**Wireless Link**
- **Bluetooth Low Energy** with compact binary frames (quats + vibration cue); end-to-end goal **< 10 ms**; RMS jitter **< 2 ms** in lab. :contentReference[oaicite:2]{index=2}

**Chair-2 (Actuation)**
- **3 linear worm-gear actuators** in an equilateral triangle (2-DOF pitch/roll).  
- **Universal/rod-end joints** for misalignment tolerance; self-locking worm gears for fail-safe holds.  
- **Seat vibration motor** for 5–80 Hz tactile cues.  
- **ESP32 + BTS7960** motor drivers, 24 V power rail.

---

## Key Specs (prototype targets & validation)
- **Tilt range:** ±15° pitch/roll; **angular velocity** up to ≈ 1.5 rad/s (comfortable/realistic).  
- **Actuation:** stroke ≥ 300 mm; nominal **84 mm/s** linear speed.  
- **Load:** > 1000 N system capacity (≈ 100 kg user + safety margin).  
- **Haptics:** 5–80 Hz vibration band coverage (terrain & engine signatures).  
- **Latency:** **sub-10 ms** end-to-end (sensor→BLE→IK→actuator command). :contentReference[oaicite:3]{index=3}

---

## Control & Algorithms
- **Inverse Kinematics (IK):** closed-form mapping from desired pitch/roll → actuator lengths on the triangular platform; **rate limiter** + **S-curve** interpolation avoids jerk.  
- **Filtering:** complementary filter on IMU (gyro drift removal, accel tilt reference); optional **notch** for known mechanical resonance.  
- **Safety:** motion bounds (±15°), current/temperature monitor on drivers, **self-locking** actuators for power-loss hold. :contentReference[oaicite:4]{index=4}

---

## Electrical & Firmware Highlights
- **MCU:** ESP32 (dual core) – one task for BLE I/O, one for control loop (5–10 Hz tilt + high-rate PWM for motors).  
- **Drivers:** 3 × **BTS7960** H-bridges (43 A peak), hardware current sense.  
- **Packet format:** `[t, qx, qy, qz, qw, vib]` (little-endian) with sequence ID + simple CRC; dropped-frame smoothing via **exponential hold**. :contentReference[oaicite:5]{index=5}

---

## Mechanical Design
- **Triangular top & base frames** (aluminum + wood core) for stiffness with low mass.  
- **Universal joints** both ends; **rod-ends** to isolate lateral loads.  
- **Seatbelt** and leg-support frame for occupant stability.  
- **Static hold** without power thanks to worm gears; safety factor ≈ 3× at 100 kg payload. :contentReference[oaicite:6]{index=6}

---

## Validation (summary)
- **Latency & jitter:** met < 10 ms target in bench tests; BLE link robust indoors (lab scale).  
- **Tilt accuracy:** commanded vs. measured IMU tilt trace aligned within prototype tolerances; smooth interpolation with no overshoot.  
- **Haptic fidelity:** 5–10 Hz “terrain” envelopes reproduced convincingly; high-frequency engine harmonics perceptible via seat motor.  
- **Structure:** load & stability checks passed; no binding under worst-case tilts. :contentReference[oaicite:7]{index=7}

---

## Use Cases & Extensions
- Remote excavator/forklift teleop; VR/AR training; rehabilitation devices.  
- **Roadmap:** add EO/IR fusion (feature-level), temporal smoothing (LSTM/Transformer), and private-5G/TSN for deterministic links. :contentReference[oaicite:8]{index=8}

---

## Acknowledgment
BuilderX (sponsor), UM–SJTU JI capstone team, and supervisor Prof. Chengbin Ma. :contentReference[oaicite:9]{index=9}
