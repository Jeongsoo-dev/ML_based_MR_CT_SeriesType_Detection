---
title: Advanced Priors and Jeffreys’ Rule
hide:
  - title
---

# **4. Prior Distributions II (Advanced Priors)**
**Author:** Jeongsoo Pang  

---

## **1) Overview**
Extending prior concepts into **improper, noninformative, Jeffreys, weakly informative**, and **reference priors**, exploring how **parameterization** affects prior meaning and inference

---

## **2) Categories of Priors**

| **Type of Prior** | **Definition / Concept** | **Key Properties & Purpose** | **Typical Example / Use Case** |
|--------------------|--------------------------|-------------------------------|--------------------------------|
| **Conjugate Prior** | Prior family that yields a posterior in the *same distributional family* as the prior. | Provides closed-form posterior; simple parameter updates; algebraically convenient. | Beta–Binomial, Gamma–Poisson, Normal–Normal. |
| **Improper Prior** | A prior that does **not integrate to 1**, but can still produce a *proper posterior*. | Useful when minimal information is available; must ensure posterior integrates to 1. | Flat prior $\pi(\mu)\propto1$ for Normal mean. |
| **Informative Prior** | Reflects *strong domain knowledge* or expert belief. | Low variance, sharp peak; dominates likelihood when data are scarce. | Prior on disease rate based on previous clinical data. |
| **Weakly Informative Prior** | A *vague but proper* prior that regularizes inference without overwhelming the data. | Improves stability; balances between noninformative and informative. | $\text{Beta}(1,1)$ or $\text{Beta}(0.5,0.5)$ for Binomial $\theta$. |
| **Noninformative Prior** | Attempts to make inference rely almost entirely on the data likelihood. | No universally correct form; depends on parameterization; often used in objective Bayes. | Uniform$(0,1)$ for $\theta$ in Binomial$(n,\theta)$. |
| **Reference Prior** | Maximizes *mutual information* between parameter $\theta$ and data. | Objective choice; designed to maximize expected information gain. | Used for multidimensional parameters in objective Bayes. |
| **Jeffreys Prior** | Defined as $\pi(\theta)\propto\sqrt{I(\theta)}$, where $I(\theta)$ is Fisher information. | Invariant under reparameterization; noninformative in an information-theoretic sense. | For Bernoulli $p$, $\pi(p)\propto[p(1-p)]^{-1/2}$ (Beta$(1/2,1/2)$). |
| **Invariant / Nonparametric Prior** | Defined over transformations or infinite-dimensional parameter spaces. | Used in flexible models (e.g., Gaussian Process, Dirichlet Process). | Nonparametric Bayes, hierarchical GP models. |

---

## **3) Proper vs. Improper Priors**
A prior $p(\theta)$ is **proper** if it integrates to 1:

$$
\int p(\theta)\,d\theta = 1
$$
Otherwise, it is **improper**:
$$
\int p(\theta)\,d\theta = \infty
$$

- An improper prior is **acceptable** *only if* the resulting posterior is proper.  
- If the posterior is also improper, the prior must be discarded.  

**Example:**  
For Binomial $y\sim Bin(n,\theta)$ and prior $\text{Beta}(0,0)$,  

the posterior $\text{Beta}(y, n-y)$ is proper when $y,n-y>0$.  

**Another example:**  

For $X_i\sim N(\mu,\sigma^2)$ with $\pi(\mu)\propto1$,


$$
\mu|x\sim N(\bar{x},\sigma^2/n)
$$

which is proper—so flat prior $\pi(\mu)\propto1$ works fine

---

## **4) Informative vs. Noninformative Priors**
- **Informative prior:** Low variance, expresses strong prior knowledge.  
- **Vague/diffuse prior:** High variance, weak information.  
- **Flat prior:** Constant over parameter space (e.g., $\pi(\theta)\propto1$), fully noninformative.

**Noninformative priors**:
- Aim to let data “speak for itself.”  
- Used in **objective Bayes** when little prior knowledge exists.  
- No universally agreed definition — depends on model parameterization.  

---

## **5) Parameterization Sensitivity**
Noninformative priors depend heavily on how parameters are defined.

### **Example 1 — Binomial model**
For $y\sim Bin(n,\theta)$:

- Flat prior: $\theta\sim Uniform(0,1)$ or $\text{Beta}(1,1)$  
  $$
  \Rightarrow \theta|y\sim Beta(y+1, n-y+1)
  $$

### **Example 2 — Odds transformation**
Let $o=\frac{\theta}{1-\theta}$ and assume flat prior on $o$ ($p(o)\propto1$).  
Then the induced prior on $\theta$ is:
$$
p(\theta)\propto \frac{1}{(1-\theta)^2}, \quad 0<\theta<1
$$
This favors $\theta$ near 1 and is **improper** since $\int_0^1 (1-\theta)^{-2}d\theta=\infty$.

Posterior under Binomial likelihood:
$$
p(\theta|y)\propto \theta^y(1-\theta)^{n-y-2} \Rightarrow \theta|y\sim Beta(y+1, n-y-1)
$$
Posterior becomes improper when $n-y\le1$

---

### **Example 3 — Log-odds reparameterization**
Let $\rho=\log\!\left(\frac{\theta}{1-\theta}\right)$ and assume $\rho\sim Uniform(-\infty,\infty)$.  
Then,
$$
p(\theta)\propto \frac{1}{\theta(1-\theta)}
$$
Posterior becomes:
$$
\theta|y\sim Beta(y, n-y)
$$
**Insight:** “Flat” priors depend on the scale; uniform in $\theta$, $o$, or $\rho$ lead to very different beliefs

---

## **6) Jeffreys’ Prior**
**Motivation:** A prior should remain “uninformative” under smooth reparameterization.  

Jeffreys’ Rule:
$$
\pi(\theta)\propto \sqrt{I(\theta)}
$$
where $I(\theta)$ is the **Fisher information**:
$$
I(\theta)=E_\theta\!\left[\left(\frac{\partial}{\partial\theta}\log L(\theta;X)\right)^2\right]
$$

- Reflects information content in the data about $\theta$.  
- Gives higher weight where the likelihood is most sensitive to $\theta$.  
- Completely determined by the likelihood (no subjective input).  

---

### **Example: Bernoulli**
For $X_i\sim Bern(p)$,  
$$
I(p)=\frac{n}{p(1-p)} \Rightarrow \pi(p)\propto [p(1-p)]^{-1/2}
$$
Hence, **Jeffreys’ prior**:
$$
p(p)\sim Beta\!\left(\frac{1}{2},\frac{1}{2}\right)
$$

### **Example: Normal mean (σ² known)**
For $X\sim N(\mu,\sigma^2)$,
$$
I(\mu)=\frac{1}{\sigma^2} \Rightarrow \pi(\mu)\propto1
$$
⇒ Jeffreys’ prior is **uniform** (improper)

---

## **7) Weakly Informative Priors**
- Use proper but vague priors to **regularize** estimates and avoid improper posteriors.  
- Example: $\text{Beta}(1,1)$ or $\text{Beta}(0.5,0.5)$ for Binomial θ.  
- Behaves similarly to $\text{Beta}(0,0)$ (improper) but ensures posterior propriety.  
- Common in **modern Bayesian modeling** (e.g., logistic regression, hierarchical models)

---

## **8) Reference Priors**

A **reference prior** maximizes *mutual information* between data and parameters.

$$
p^*(\theta) = \arg\max_{p(\theta)} I(\Theta, T)
$$

where

$$
I(\Theta, T) = \iint p(\theta, t)\,
\log\!\frac{p(\theta, t)}{p(\theta)p(t)}\,d\theta\,dt
$$

- **Essentially:** choose the prior that maximizes the **expected information gain** from data.  
- Used in **objective Bayesian analysis**, especially for **multi-parameter models**.

---

## **Summary**
> *A prior’s “uninformativeness” depends on the parameter scale. Jeffreys’ rule and weakly informative priors balance mathematical invariance and practical stability—ensuring the data, not arbitrary parameterization, drives inference.*

---
<sub>© Jeongsoo Pang — All rights reserved

