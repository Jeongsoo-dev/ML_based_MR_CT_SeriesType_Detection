---
title: Bayesian Computation
hide:
  - title
---

# **9. Bayesian Computation**

---

## **1) Why Bayesian Computation**

Bayesian inference often requires evaluating posterior distributions:

$$
p(\theta \mid y) = \frac{p(y \mid \theta)\pi(\theta)}{p(y)}
$$

But the denominator (marginal likelihood):

$$
p(y) = \int p(y \mid \theta)\pi(\theta)\, d\theta
$$

is frequently **intractable**, especially when:

- Parameter space is high-dimensional  
- No conjugacy exists  
- Likelihood is complex  

So, we use **computational methods**:

- Analytical solutions (rare)
- Numerical integration (low dimension only)
- Simulation methods (Monte Carlo, MCMC)

---

## **2) Monte Carlo Integration**

Monte Carlo (MC) is used to approximate integrals:

$$
E[g(\theta)] = \int g(\theta) p(\theta \mid y)\, d\theta
$$

### **2.1) Monte Carlo approximation:**

1. Sample $\theta^{(1)}, \dots, \theta^{(N)} \sim p(\theta \mid y)$  
2. Approximate expectation:

$$
\hat{E}[g(\theta)] = \frac{1}{N}\sum_{i=1}^N g(\theta^{(i)})
$$

As $N \to \infty$, $\hat{E} \to E[g(\theta)]$ (Law of Large Numbers)

---

## **3) Direct Sampling (Ideal Case)**

If we can sample directly from posterior $p(\theta|y)$, we can compute anything.

Example: Conjugate Normal-Normal model  

- Prior: $\theta \sim N(\mu_0, \tau_0^2)$  
- Likelihood: $y|\theta \sim N(\theta, \sigma^2)$  
- Posterior: $N(\mu_n, \tau_n^2)$ → direct sampling possible

**Problem:** Most posteriors are not analytically tractable → need approximate methods.

---

## **4) Rejection Sampling**

Goal: Sample from target distribution $p(\theta)$ using a simpler proposal $q(\theta)$.

### **4.1) Algorithm**
1. Choose proposal density $q(\theta)$ such that  
   $$ p(\theta) \le M q(\theta) \quad \text{for all } \theta $$
2. Repeat:
   - Sample $\theta^* \sim q(\theta)$  
   - Sample $u \sim \text{Uniform}(0,1)$  
   - Accept $\theta^*$ if:
     $$
     u < \frac{p(\theta^*)}{M q(\theta^*)}
     $$

### **4.2) Pros & Cons**
| Pros | Cons |
|------|------|
| Simple | Needs $M$ bounding constant |
| Exact samples | Becomes inefficient in high dimensions |

---

## **5) Importance Sampling**

Approximates expectations under $p(\theta)$ using samples from another distribution $q(\theta)$.

**Key idea:**

$$
E_p[g(\theta)] = \int g(\theta)\frac{p(\theta)}{q(\theta)}q(\theta)\,d\theta
≈ \frac{1}{N} \sum_{i=1}^N g(\theta^{(i)}) w(\theta^{(i)})
$$

Where weights:

$$
w(\theta) = \frac{p(\theta)}{q(\theta)}
$$

**Normalized weights:**

$$
\tilde{w}_i = \frac{w_i}{\sum_{j=1}^N w_j}
$$

**Important requirement:** 

$q(\theta) > 0$ wherever $p(\theta) > 0$.

---

## **6) Markov Chain Monte Carlo (MCMC)**

When direct sampling is impossible, we construct a **Markov chain** whose stationary distribution is $p(\theta | y)$.

**Key idea:**

- Generate dependent samples $\theta^{(1)}, \theta^{(2)}, \dots$  
- After burn-in, the chain approximates $p(\theta|y)$

---

## **7) Metropolis–Hastings (MH) Algorithm**

The Metropolis–Hastings algorithm is a Markov Chain Monte Carlo method for sampling from a target distribution  
(e.g., posterior $p(\theta \mid y)$) when direct sampling is difficult.

---

### **7.1 Algorithm (Step-by-step)**

**Goal:** Construct a Markov chain $\{\theta^{(t)}\}$ whose stationary distribution is $p(\theta \mid y)$.

**Procedure:**

1. **Initialize:** Choose a starting value $\theta^{(0)}$.
2. **At iteration $t$ (for $t = 0,1,2,\dots$):**
   - **(a) Propose a candidate**  
     $$
     \theta^\* \sim q(\theta^\* \mid \theta^{(t)})
     $$
   - **(b) Compute the acceptance probability**
     $$
     \alpha(\theta^{(t)}, \theta^\*) = 
     \min \left[
     1,\;
     \frac{p(\theta^\*) \; q(\theta^{(t)} \mid \theta^\*)}
          {p(\theta^{(t)}) \; q(\theta^\* \mid \theta^{(t)})}
     \right]
     $$
   - **(c) Accept or reject**
     - With probability $\alpha$, set $\theta^{(t+1)} = \theta^\*$  
     - Otherwise, keep previous value: $\theta^{(t+1)} = \theta^{(t)}$

### **7.2 Special Case: Random Walk Metropolis**

A common and simple choice of proposal is a symmetric random walk:

$$
q(\theta^\* \mid \theta^{(t)}) = \mathcal{N}(\theta^{(t)}, \sigma^2)
$$

Since this proposal is **symmetric**:
$$
q(\theta^\* \mid \theta^{(t)}) = q(\theta^{(t)} \mid \theta^\*)
$$

The acceptance probability simplifies to:

$$
\alpha = \min \left( 1,\;
\frac{p(\theta^\*)}{p(\theta^{(t)})}
\right)
$$

---

## **8) Gibbs Sampling**

A special case of MCMC where we sample **from full conditional distributions.**

### **8.1) When to use**
Parameter $\theta = (\theta_1, \theta_2, \dots, \theta_k)$ is multi-dimensional and conditionals are tractable.

### **8.2) Algorithm**
At each step $t$:

1. Sample $\theta_1^{(t+1)} \sim p(\theta_1 \mid \theta_2^{(t)}, \dots, \theta_k^{(t)})$
2. Sample $\theta_2^{(t+1)} \sim p(\theta_2 \mid \theta_1^{(t+1)}, \theta_3^{(t)}, \dots)$  
...
k. Sample $\theta_k^{(t+1)} \sim p(\theta_k \mid \theta_1^{(t+1)}, \dots)$

### **8.3) Advantages**
- No rejection step (always accepted)
- Works well with conjugate models

---

## **9) Convergence Diagnostics**

How do we know if MCMC is reliable

| Diagnostic | Purpose |
|------------|---------|
| Trace plot | Visual mixing + stationarity |
| Autocorrelation | Check independence of samples |
| Effective Sample Size (ESS) | Measures actual number of independent draws |
| Gelman-Rubin $\hat{R}$ | Compare multiple chains for convergence |

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
