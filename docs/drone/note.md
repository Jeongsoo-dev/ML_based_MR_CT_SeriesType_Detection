# Quadrotor System Modeling — Core Equations Reference

> Reference summary based on classical quadrotor modeling  
> (e.g., Wil Selby, ArduCopter Modeling)  
>  

---

## 1. Motor & ESC Electrical Model

### Variables
- \( \tau \) : motor torque (N·m)  
- \( I \) : input current (A)  
- \( I_0 \) : no-load current (A)  
- \( V \) : motor voltage (V)  
- \( R_m \) : motor resistance (Ω)  
- \( K_t \) : torque constant  
- \( K_v \) : back-EMF constant  
- \( \omega \) : motor angular velocity (rad/s)  

### Electrical Equations
\[
\tau = K_t (I - I_0)
\]

\[
V = I R_m + K_v \omega
\]

### Motor Power
\[
P_m = I V
\]

**Common simplifying assumption**
\[
R_m \approx 0,\quad I_0 \approx 0
\]

\[
\boxed{
P_m = \frac{K_v}{K_t}\,\tau\,\omega
}
\]

**Interpretation**
- ESC regulates current/voltage
- Mechanical torque and speed determine motor power

---

## 2. Thrust Generation & Hover Power

### Definitions
- \( T \) : thrust (N)  
- \( P_h \) : hover power (W)  
- \( v_h \) : induced velocity (m/s)  
- \( \rho \) : air density (kg/m³)  
- \( A \) : propeller disk area (m²)  

### Momentum Theory
\[
P_h = T v_h
\]

\[
T = 2\rho A v_h^2
\]

\[
\Rightarrow
P_h = \frac{T^{3/2}}{\sqrt{2\rho A}}
\]

### Motor–Propeller Coupling
\[
\tau = K_T T
\]

\[
P_m = \frac{K_v}{K_t} \tau \omega
\]

### Resulting Thrust Model
\[
\boxed{
T = K_T \omega^2
}
\]

**Key takeaway**
- Thrust is proportional to the **square of motor speed**
- Fundamental assumption behind mixer and allocation matrix

---

## 3. Translational Dynamics (Global Frame)

### Variables
- \( m \) : quadrotor mass (kg)  
- \( \mathbf{X}^G \) : position in global frame (m)  
- \( \mathbf{F}_T^G \) : thrust force (global frame)  
- \( \mathbf{F}_d \) : aerodynamic drag  

### Drag Model
\[
\mathbf{F}_d =
\begin{bmatrix}
K_{dx} & 0 & 0\\
0 & K_{dy} & 0\\
0 & 0 & K_{dz}
\end{bmatrix}
\dot{\mathbf{X}}^G
\]

### Force Balance
\[
\boxed{
m\ddot{\mathbf{X}}^G
=
\mathbf{F}_g
-
\mathbf{F}_T^G
-
\mathbf{F}_d
}
\]

### Thrust Mapping
\[
\mathbf{F}_T^G =
R_B^G
\begin{bmatrix}
0\\
0\\
\sum_{i=1}^{4} K_T \omega_i^2
\end{bmatrix}
\]

---

## 4. Rotational Dynamics (Body Frame)

### Variables
- \( \boldsymbol{\omega} = [p, q, r]^T \) : body angular velocity  
- \( J_b \) : body inertia matrix  
- \( \boldsymbol{\tau}_m \) : motor-generated torques  
- \( \boldsymbol{\tau}_g \) : gyroscopic torques  

### Rigid Body Equation
\[
\boxed{
J_b \dot{\boldsymbol{\omega}}
=
\boldsymbol{\tau}_m
-
\boldsymbol{\tau}_g
-
(\boldsymbol{\omega} \times J_b \boldsymbol{\omega})
}
\]

---

## 5. Motor Torque Contributions

### Roll and Pitch Torques
\[
\tau_\phi = \ell K_T(\omega_4^2 - \omega_2^2)
\]

\[
\tau_\theta = \ell K_T(\omega_1^2 - \omega_3^2)
\]

### Yaw Torque (Drag-Induced)
\[
\tau_\psi = K_d(\omega_1^2 - \omega_2^2 + \omega_3^2 - \omega_4^2)
\]

### Torque Vector
\[
\boldsymbol{\tau}_m =
\begin{bmatrix}
\tau_\phi\\
\tau_\theta\\
\tau_\psi
\end{bmatrix}
\]

---

## 6. Euler Angle Kinematics (Reference)

> Used in classical modeling; replaced by SE(3) representations in modern geometric control.

### Kinematic Relation
\[
\begin{bmatrix}
\dot{\phi}\\
\dot{\theta}\\
\dot{\psi}
\end{bmatrix}
=
\begin{bmatrix}
1 & \sin\phi\tan\theta & \cos\phi\tan\theta\\
0 & \cos\phi & -\sin\phi\\
0 & \frac{\sin\phi}{\cos\theta} & \frac{\cos\phi}{\cos\theta}
\end{bmatrix}
\begin{bmatrix}
p\\
q\\
r
\end{bmatrix}
\]

---

## 7. Full Nonlinear Equations of Motion (Euler-Based)

### Translational Acceleration
\[
\ddot{\mathbf{X}}^G =
\begin{bmatrix}
-\frac{F_T}{m}(\cos\phi\sin\theta\cos\psi+\sin\phi\sin\psi)-K_{dx}\dot{X}^G\\
-\frac{F_T}{m}(\cos\phi\sin\theta\sin\psi-\sin\phi\cos\psi)-K_{dy}\dot{Y}^G\\
-\frac{F_T}{m}(\cos\phi\cos\theta)-K_{dz}\dot{Z}^G + g
\end{bmatrix}
\]

### Angular Accelerations
\[
\ddot{\phi} = \frac{1}{J_x}[(J_y-J_z)qr + \tau_\phi]
\]

\[
\ddot{\theta} = \frac{1}{J_y}[(J_z-J_x)pr + \tau_\theta]
\]

\[
\ddot{\psi} = \frac{1}{J_z}[(J_x-J_y)pq + \tau_\psi]
\]

---

## 8. Modeling Assumptions

- Rigid and symmetric quadrotor frame
- Center of mass aligned with body frame origin
- Thrust and drag proportional to \( \omega^2 \)
- Flat, non-rotating Earth
- No wind or ground effect

---

## Notes

- This model represents **classical quadrotor dynamics**
- Modern research (e.g., geometric control) reformulates these equations on **SE(3)** to avoid Euler-angle singularities
