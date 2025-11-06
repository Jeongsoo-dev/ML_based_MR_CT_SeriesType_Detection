
---
title: MCMC Updates
hide:
  - title
---

# **10. MCMC Update**

---

## **1) Motivation**

While basic MCMC methods (Metropolis–Hastings, Gibbs) are widely used, practical issues arise:

- Slow convergence in high dimensions  
- High autocorrelation between samples  
- Poor mixing when parameters are correlated  

To address these, we study advanced MCMC update strategies:

- Component-wise vs. block updating  
- Adaptive and gradient-based proposals  
- Diagnostics for efficiency

---

## **2) MCMC Basics Review**

A Markov chain $\{\theta^{(t)}\}$ targets posterior $p(\theta \mid y)$ if it satisfies:

- **Detailed balance**:
  $$
  p(\theta')\, K(\theta', \theta) = p(\theta)\, K(\theta, \theta')
  $$
- **Ergodicity:** chain explores the whole parameter space  
- After burn-in, draws approximate the true posterior.

---

## **3) Component-wise Updating**

Update one parameter at a time:

$$
\theta_j^{(t+1)} \sim p(\theta_j \mid \theta_{-j}^{(t)}, y)
$$

### **3.1) Pros**
- Simple; only need conditional posteriors
- Often analytical in conjugate models

### **3.2) Cons**
- Inefficient if variables are highly correlated  
- Requires many updates for independence

---

## **4) Block Updating**

Update correlated parameters jointly:

$$
(\theta_1, \theta_2)^{(t+1)} \sim p(\theta_1, \theta_2 \mid \theta_{-(1,2)}^{(t)}, y)
$$

### **4.1) Advantages**
- Reduces autocorrelation
- Speeds up convergence
- Better mixing for correlated dimensions

### **4.2) Trade-off**
- Harder to derive joint conditionals
- Requires multivariate proposals

---

## **5) Adaptive Metropolis Algorithm**

Improves the proposal covariance during sampling.

### **5.1) Idea**

Let proposal:
$$
q_t(\theta^\* \mid \theta^{(t)}) = N(\theta^{(t)}, \Sigma_t)
$$

After $t$ iterations, adapt $\Sigma_t$ using sample covariance:

$$
\Sigma_t = s_d \, \text{Cov}(\theta^{(1)}, \dots, \theta^{(t)}) + \epsilon I_d
$$

where $s_d = (2.38)^2/d$, $\epsilon$ small for stability.

### **5.1) Properties**
- Learns posterior correlation automatically
- Must satisfy *diminishing adaptation* (adaptation decreases over time)

---

## **6) Metropolis-Adjusted Langevin Algorithm (MALA)**

Incorporates gradient of log-posterior to guide proposals.

### **6.1) Proposal**

$$
\theta^\* = \theta^{(t)} + \frac{h^2}{2}\nabla_\theta \log p(\theta^{(t)} \mid y)
+ h\, \eta, \quad \eta \sim N(0, I)
$$

### **6.2) Acceptance Probability**

$$
\alpha = \min\!\left(1,
\frac{p(\theta^\* \mid y)\, q(\theta^{(t)} \mid \theta^\*)}
     {p(\theta^{(t)} \mid y)\, q(\theta^\* \mid \theta^{(t)})}
\right)
$$

### **6.3) Advantages**
- Uses local geometry → higher acceptance  
- Efficient for smooth posteriors  

### **6.4) Notes**
- Step size $h$ must be tuned (too large → low acceptance)  
- Related to Hamiltonian Monte Carlo (HMC)

---

## **7) Hamiltonian Monte Carlo**

Uses **Hamiltonian dynamics** to explore posterior efficiently.

Define:
$$
H(\theta, p) = U(\theta) + K(p)
$$
where  
- $U(\theta) = -\log p(\theta \mid y)$ (potential energy)  
- $K(p) = \frac{1}{2}p^\top M^{-1}p$ (kinetic energy)

Simulate trajectories using leapfrog steps:
1. Update momentum $p$
2. Update position $\theta$
3. Accept/reject based on energy conservation

→ Long-distance proposals with high acceptance.

---

## **8) Parameter Transformation**

MCMC can struggle if parameters are constrained (e.g. $\theta > 0$).  
Use transformations:

| Constraint | Transformation | Support |
|-------------|----------------|----------|
| $\theta > 0$ | $\phi = \log \theta$ | $\phi \in \mathbb{R}$ |
| $0 < \theta < 1$ | $\phi = \log\frac{\theta}{1-\theta}$ | $\phi \in \mathbb{R}$ |

Posterior adjustment (Jacobian):
$$
p(\phi \mid y) \propto p(\theta(\phi) \mid y)\,\left|\frac{d\theta}{d\phi}\right|
$$

---

## **9) Practical Considerations**

### **9.1) Burn-in**
Discard early samples before convergence.

### **9.2) Thinning**
Save every $k$th sample to reduce storage and correlation (useful but optional).

### **9.3) Convergence Monitoring**
- Trace plots
- $\hat{R}$ (Gelman–Rubin)
- Effective Sample Size (ESS)

### **9.4) Posterior Summaries**
After convergence, compute:
$$
E[\theta \mid y],\quad \text{Var}(\theta \mid y),\quad \text{quantiles, HPD intervals.}
$$

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
