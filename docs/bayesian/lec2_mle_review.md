---
title: Distributions and MLE
hide:
  - title
---

# **2. Distribution and Statistical Inference**
---

## **1) Overview**
Reviewing essential probability distributions and introduces Maximum Likelihood Estimation (MLE)

---

## **2) Common Probability Distributions**

### **2.1) Discrete**

- **Bernoulli $(p)$** — Binary outcome (success/failure)  
  $$
  f(x|p) = p^x(1 - p)^{1-x}, \quad x \in \{0,1\}
  $$  
  $$
  E[X] = p, \quad Var(X) = p(1 - p)
  $$  

- **Binomial $(n, p)$** — Number of successes in $n$ trials  
  $$
  P(X = x) = \binom{n}{x} p^x (1 - p)^{n-x}
  $$  
  $$
  E[X] = np, \quad Var(X) = np(1 - p)
  $$  

- **Negative Binomial $(r, p)$** — Trials until $r$-th success  
  $$
  P(X = x) = \binom{x-1}{r-1} p^r (1 - p)^{x-r}
  $$  
  $$
  E[X] = \frac{r}{p}, \quad Var(X) = \frac{r(1 - p)}{p^2}
  $$  

- **Geometric $(p)$** — Trials until the first success  
  $$
  P(X = x) = (1 - p)^{x-1}p, \quad x = 1, 2, \dots
  $$  
  $$
  E[X] = \frac{1}{p}, \quad Var(X) = \frac{1 - p}{p^2}
  $$  

- **Poisson $(\lambda)$** — Counts events in a time interval  
  $$
  f(x|\lambda) = \frac{\lambda^x e^{-\lambda}}{x!}, \quad x = 0,1,2,\dots
  $$  
  $$
  E[X] = Var(X) = \lambda
  $$  
---

### **2.2) Continuous**

- **Uniform $(\theta_1, \theta_2)$**  
  $$
  f(x) = \frac{1}{\theta_2 - \theta_1}, \quad x \in [\theta_1, \theta_2]
  $$  
  $$
  E[X] = \frac{\theta_1 + \theta_2}{2}, \quad Var(X) = \frac{(\theta_2 - \theta_1)^2}{12}
  $$  

- **Normal $(\mu, \sigma^2)$**  
  $$
  f(x|\mu,\sigma) = \frac{1}{\sigma \sqrt{2\pi}} \exp \Big( -\frac{(x - \mu)^2}{2\sigma^2} \Big)
  $$  
  $$
  E[X] = \mu, \quad Var(X) = \sigma^2
  $$  

- **Exponential $(\lambda)$**  
  $$
  f(x|\lambda) = \lambda e^{-\lambda x}, \quad x \ge 0
  $$  
  $$
  E[X] = \frac{1}{\lambda}, \quad Var(X) = \frac{1}{\lambda^2}
  $$  

- **Gamma $(\alpha, \beta)$**  
  $$
  f(x|\alpha,\beta) = \frac{\beta^\alpha}{\Gamma(\alpha)}x^{\alpha - 1} e^{-\beta x}, \quad x \ge 0
  $$  
  $$
  E[X] = \frac{\alpha}{\beta}, \quad Var(X) = \frac{\alpha}{\beta^2}
  $$
  
- **Beta $(\alpha, \beta)$**  
  $$
  f(x|\alpha,\beta) = \frac{1}{B(\alpha,\beta)} x^{\alpha - 1} (1 - x)^{\beta - 1}, \quad 0 \le x \le 1
  $$  
  $$
  E[X] = \frac{\alpha}{\alpha + \beta}, \quad Var(X) = \frac{\alpha\beta}{(\alpha + \beta)^2 (\alpha + \beta + 1)}
  $$  

---

## **3) Maximum Likelihood Estimation**
**Goal:** Estimate parameters $\theta$ that make observed data most probable.  
Likelihood:  

$$
L(\theta; x) = f(x|\theta)
$$  
Log-likelihood:  

$$
\ell(\theta) = \ln L(\theta) = \sum_i \ln f(x_i|\theta)
$$  
MLE estimate:  


$$
\hat{\theta}_{MLE} = \arg\max_\theta \ell(\theta)
$$  

**Example: Coin flips**
$$
L(p; x) = \binom{n}{x}p^x(1 - p)^{n - x}
$$  
$$
\ell(p) = x\ln p + (n - x)\ln(1 - p)
$$  
$$
\frac{d\ell}{dp}=0 \Rightarrow \hat{p}_{MLE} = \frac{x}{n}
$$  

---

## **4) Transition to Bayesian**
Frequentist treats $\theta$ as fixed.  
Bayesian treats $\theta$ as random with prior $p(\theta)$:
$$
p(\theta|x) = \frac{p(x|\theta)p(\theta)}{p(x)} \propto p(x|\theta)p(\theta)
$$  
> This connects directly to Lecture 3: Priors and Bayesian

---
<sub>© Jeongsoo Pang — All rights reserved
