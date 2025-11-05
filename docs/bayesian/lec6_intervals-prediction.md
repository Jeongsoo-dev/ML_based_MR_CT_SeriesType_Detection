---
title: Bayesian Inference
hide:
  - title
---

# **6. Bayesian Inference**

---

## **1) Key Concepts**

This lecture focuses on:

- Difference between *onfidence Intervals (Frequentist) and Credible Intervals (Bayesian)
- HPD (Highest Posterior Density) intervals
- Bayesian credible interval calculation
- Posterior prediction
- Bayesian hypothesis testing & Bayes Factor

---

## **2) Confidence vs Credible Interval**

### **2.1 Confidence Interval (Frequentist)**  
A 100(1−α)% confidence interval satisfies:

$$
P_\theta(\theta \in C(X)) = 1 - \alpha
$$

- Probability refers to the random sample, not θ.
- Example (Normal mean, σ known):
  $$
  \bar{X} \pm z_{\alpha/2} \frac{\sigma}{\sqrt{n}}
  $$

### **2.2 Credible Interval (Bayesian)**  
A 100(1−α)% credible interval I satisfies:

$$
P(\theta \in I \mid X) = 1 - \alpha
$$

- Probability is with respect to the posterior distribution of θ.
- Directly interpretable as belief about θ after seeing data.

---

## **3) Types of Credible Intervals**

| Interval Type | Definition |
|---------------|------------|
| **Equal-Tailed** | Lower α/2 and upper 1−α/2 posterior quantiles |
| **HPD (Highest Posterior Density)** | Shortest interval B such that ∫_B p(θ|x) dθ = 1−α and all interior points have higher posterior density than outside |
| **One-Sided** | [a, ∞) or (−∞, b] |
| **Two-Sided** | Symmetric around mean or median (if posterior is symmetric) |

---

## **4) HPD Interval Definition**

For a posterior π(θ|x), HPD region is:

$$
\text{HPD} = \{\theta : \pi(\theta|x) \ge k \}
$$

where k is chosen such that:

$$
\int_{\{\pi(\theta|x) \ge k\}} \pi(\theta|x) \, d\theta = 1 - \alpha
$$

- If posterior is unimodal → HPD is one interval  
- If multimodal → HPD may consist of disjoint intervals

---

## **5) Ex1.Beta-Binomial Model**

Given:
- Data: $x = 11$ successes out of $n = 12$
- Prior: $\theta \sim \text{Beta}(7, 3)$

Posterior:

$$
\theta | x \sim \text{Beta}(18, 4)
$$

MAP estimate:

$$
\hat{\theta}_{MAP} = \frac{α - 1}{α + β - 2}
= \frac{17}{20} = 0.85
$$

80% Equal-Tailed CI:

$$
[\theta_{0.1}, \theta_{0.9}] = [0.709,\, 0.914]
$$

80% HPD Interval:

$$
[0.7329,\, 0.9313]
$$

---

## **6) Ex2.Exponential with Gamma Prior**

Model:
- $X_i \sim \text{Exponential}(\theta)$ (θ is mean)
- Prior: $\theta \sim \text{Gamma}(r, \lambda)$

Posterior:

$$
\theta | x \sim \text{Gamma}(r + n, \lambda + \sum x_i)
$$

Example values:
- $n = 13$, $\bar{x} = 0.21$
- $r = 7$, $\lambda = 12$
→ Posterior: $\text{Gamma}(20, 39.3)$  
95% credible interval = **2.5% and 97.5% quantiles**

---

## **7) Ex3.Censored Exponential Data**

Survival model:
$$
f(t|\theta) = \frac{1}{\theta} e^{-t/\theta}
$$

If r failures observed at times $t_1,...,t_r$ and $(n-r)$ survive until $t_r$:

Total exposure time:

$$
T = \sum_{i=1}^{r} t_i + (n - r) t_r
$$

Likelihood:

$$
L(\theta|t) \propto \theta^{-r} \exp\left(-\frac{T}{\theta}\right)
$$

With prior $\theta \sim \text{Inv-Gamma}(α, β)$:
$$
\theta | t \sim \text{Inv-Gamma}(α + r,\, β + T)
$$

---

## **8) Bayesian Prediction**

Predictive distribution of new data $X_{n+1}$:

$$
p(x_{n+1}|D) = \int p(x_{n+1}|\theta) \, p(\theta|D) \, d\theta
$$

Interpretation: weighted average of likelihood using posterior as weights.

---

## **9) Bayesian Hypothesis Testing**

Posterior probabilities:

$$
P(H_0 | x), \quad P(H_1 | x)
$$

Decision Rule:
- If $P(H_0 | x) > P(H_1 | x)$ → accept $H_0$
- If close → inconclusive

---

### **Bayes Factor (BF)**

For hypotheses $H_0: θ = θ_0$ vs $H_1: θ = θ_1$:

$$
B_{01} = \frac{f(x|\theta_0)}{f(x|\theta_1)}
$$

Posterior Odds:

$$
\frac{P(H_0|x)}{P(H_1|x)}
= B_{01} \cdot \frac{P(H_0)}{P(H_1)}
$$

Interpretation:
- $B_{01} > 1$: data support $H_0$
- $B_{01} < 1$: data support $H_1$

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
