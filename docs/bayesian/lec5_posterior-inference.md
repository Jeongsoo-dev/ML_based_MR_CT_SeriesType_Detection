---
title: Bayesian Inference
hide:
  - title
---

# **5. Bayesian Inference**

---

## **1) Overview**

Bayesian inference updates belief about unknown parameters using prior knowledge and observed data.

- **Goal:** Compute the **posterior distribution**  
  $$
  p(\theta \mid D) = \frac{p(D \mid \theta) \pi(\theta)}{p(D)}
  $$
- Prior reflects belief before data → Updated into posterior after observing data.
- Posterior distribution enables:

  - Estimation (MAP, posterior mean)
  - Credible intervals
  - Prediction for future data

---

## **2) Improper & Jeffreys’ Prior**

| Concept | Definition | Example |
|---------|------------|---------|
| **Improper Prior** | Prior that does **not integrate to 1**, but can still yield a proper posterior | $\pi(\sigma^2) \propto \frac{1}{\sigma^2}$ |
| **Jeffreys’ Prior** | Objective noninformative prior derived from Fisher Information $I(\theta)$ | $\pi(\theta) \propto \sqrt{I(\theta)}$ |

---

## **3) Posterior Derivation Example**
(Variance of Normal)

Let $Y_i \sim N(\mu, \sigma^2)$ with improper prior:
$$
\pi(\sigma^2) \propto \frac{1}{\sigma^2}
$$

Posterior:
$$
p(\sigma^2 \mid y) \propto (\sigma^2)^{-\frac{n}{2}-1} \exp\left(-\frac{1}{2\sigma^2} \sum (y_i - \mu)^2 \right)
$$

⇒ $\sigma^2 | y \sim \text{Inv-Gamma}\left(\frac{n}{2}, \frac{1}{2} \sum (y_i - \mu)^2\right)$

---

## **5) Posterior Mean & Shrinkage**

Posterior mean is a weighted average of data + prior.

### **5.1 Beta–Binomial Example**

If $X_i \sim \operatorname{Bern}(\theta)$ and $\pi(\theta)\sim \operatorname{Beta}(\alpha,\beta)$:

- **Posterior**

  $$
  \theta \mid X \sim \operatorname{Beta}(\alpha+S_n,\;\beta+n-S_n)
  $$

- **Posterior Mean**

  $$
  \hat{\theta}_E
  = \frac{S_n+\alpha}{n+\alpha+\beta}
  = \lambda\,\hat{\theta}_{\text{MLE}} + (1-\lambda)\,\theta_{\text{prior}},
  \qquad
  \lambda=\frac{n}{n+\alpha+\beta}
  $$

---

## **6) Posterior Variance**

For Beta–Binomial:

$$
\operatorname{Var}(\theta \mid X)
= \frac{(\alpha+S_n)(\beta+n-S_n)}{(n+\alpha+\beta)^2\, (n+\alpha+\beta+1)}
$$

- As $n \uparrow$ → variance $\downarrow$ → posterior concentrates.

---

## **7) Credible Intervals vs Confidence Intervals**

| Concept | Frequentist Confidence Interval | Bayesian Credible Interval |
|---|---|---|
| **Definition** | Interval $C(D)$ s.t. $P_\theta\!\big(\theta \in C(D)\big)=1-\alpha$ | $P\!\big(\theta \in I \mid D\big)=1-\alpha$ |
| **Probability refers to** | Data variability | Parameter uncertainty |
| **Interpretation** | In repeated sampling, captures true $\theta$ 95% of time | Given data, $\theta$ has 95% chance in interval |

---

### **7.1 Types of Credible Intervals**
- **Equal-tailed:** $\alpha/2$ in each tail  
- **HPD (Highest Posterior Density):** Shortest interval with $1-\alpha$ mass  
- **One-sided intervals**

---

## **8) Bayesian Prediction**

After observing data $D$:

Predictive distribution for future observation $X_{n+1}$:

$$
p(x_{n+1} | D) = \int p(x_{n+1} | \theta) \, p(\theta | D)\, d\theta
$$

→ Weighted average of likelihood using posterior as weights.

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
