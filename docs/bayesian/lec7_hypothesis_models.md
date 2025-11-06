---
title: Bayesian Inference III — Hypothesis Testing
hide:
  - title
---

# **7. Bayesian Inference III**

---

## **1) Overview**

- Posterior odds and Bayesian decision rules  
- Bayes Factor (BF) as evidence from data  
- Jeffreys’ scale for interpreting BF  
- Simple vs composite hypotheses  
- Practical examples: defective rate, IQ scores, coin fairness  
- Handling point null hypothesis in continuous parameter spaces

---

## **2) Bayesian Hypothesis Testing**

Given two hypotheses:

- $H_0: \theta \in \Theta_0$  
- $H_1: \theta \in \Theta_1$

We compute:

$$
\alpha_0 = P(\Theta_0 \mid x), \quad
\alpha_1 = P(\Theta_1 \mid x)
$$

**Decision Rule:**

- If $\alpha_0 > \alpha_1$: accept $H_0$  
- If $\alpha_1 > \alpha_0$: accept $H_1$  
- If $\alpha_0 \approx \alpha_1$: evidence is inconclusive → revise prior or collect more data

---

## **3) Bayes Factor**

The **Bayes Factor** measures how much the data support $H_0$ over $H_1$:

$$
B = \frac{\text{posterior odds}}{\text{prior odds}}
= \frac{\alpha_0 / \alpha_1}{\pi_0 / \pi_1}
= \frac{\alpha_0 \pi_1}{\alpha_1 \pi_0}
$$

For simple hypotheses ($\theta = \theta_0$ vs $\theta = \theta_1$):

$$
B = \frac{f(x \mid \theta_0)}{f(x \mid \theta_1)}
$$

Interpretation:  
- $B > 1$: data favors $H_0$  
- $B < 1$: data favors $H_1$

---

## **4) Jeffreys’ Scale**
(Jeffreys’ Scale for Interpreting BF)

| $\log_{10}(B)$ | Bayes Factor (B) | Evidence Strength |
|----------------|------------------|--------------------|
| 0 – 0.5        | 1 – 3.2          | Bare mention |
| 0.5 – 1        | 3.2 – 10         | Substantial |
| 1 – 2          | 10 – 100         | Strong |
| > 2            | > 100            | Decisive |

---

## **5) Bayes Factor vs Posterior Odds**

| Concept | Meaning |
|---------|---------|
| **Bayes Factor (BF)** | Evidence from the **data alone** ($f(x \mid H_0)/f(x \mid H_1)$) |
| **Posterior Odds** | Combine **data + prior belief**: $\frac{\alpha_0}{\alpha_1}$ |
| **Conflict case** | If BF favors $H_1$ but posterior odds favor $H_0$ → prior is dominating |

---

## **6) Defective Rate Testing Example**

A factory produces parts with unknown defect rate $\theta$. Parts are considered acceptable if $\theta \leq 0.05$.

- Sample size: $n = 100$  
- Observed defective items: $x$  
- Prior: Uniform$(0,1)$  
- Posterior:  
  $$
  \theta \mid x \sim \text{Beta}(x + 1,\; 100 - x + 1)
  $$

We test:

$$
H_0: \theta \le 0.05
\quad \text{vs} \quad
H_1: \theta > 0.05
$$

Posterior probabilities:

$$
\alpha_0(x) = \int_0^{0.05} \text{Beta}(\theta \mid x+1, 101-x)\, d\theta
$$

$$
\alpha_1(x) = 1 - \alpha_0(x)
$$

Decision Rule:

$$
\frac{\alpha_0(x)}{\alpha_1(x)} > 1 \Rightarrow \text{Accept } H_0 \ (\text{qualified})
$$

---

## **7) Types of Hypotheses**

| Type | Example |
|------|---------|
| **Simple vs Simple** | $H_0: \theta = \theta_0$ vs $H_1: \theta = \theta_1$ |
| **Simple vs Composite** | $H_0: \theta = \theta_0$ vs $H_1: \theta \ne \theta_0$ |
| **Composite vs Composite** | $H_0: \theta \in \Theta_0$ vs $H_1: \theta \in \Theta_1$ |

---

## **8) Point Null Hypothesis**

Testing:

$$
H_0: \theta = \theta_0 \quad \text{vs} \quad
H_1: \theta = \theta_1
$$

Posterior:

$$
\alpha_0(x) = \frac{f(x \mid \theta_0) \pi(\theta_0)}{m(x)}, \quad
\alpha_1(x) = \frac{f(x \mid \theta_1) \pi(\theta_1)}{m(x)}
$$

Posterior odds:

$$
\frac{\alpha_0}{\alpha_1} = \frac{\pi_0 f(x \mid \theta_0)}{\pi_1 f(x \mid \theta_1)}
$$

Bayes Factor:

$$
B = \frac{f(x \mid \theta_0)}{f(x \mid \theta_1)}
$$

---

## **9) Coin with Three Possible Biases Example**

Example : A coin is known to be one of

- Two-headed: $\theta = 1$  
- Fair coin: $\theta = 0.5$  
- Two-tailed: $\theta = 0$

Prior probabilities:

$$
\pi(0) = 0.01,\;
\pi(0.5) = 0.98,\;
\pi(1) = 0.01
$$

Observed: 4 heads in 4 flips.  
Compute likelihoods:

| Hypothesis | $\theta$ | $P(\text{4 heads} \mid \theta)$ |
|------------|----------|----------------------------------|
| $H_1$ | 1 | $1$ |
| $H_2$ | 0.5 | $(1/2)^4 = 1/16$ |
| $H_3$ | 0 | $0$ |

Then apply Bayes’ rule to compute posterior for each hypothesis.

---

## **10) IQ Test Example**

Assume:

$$
Y \mid \theta \sim N(\theta,\; 10^2),
\qquad
\theta \sim N(100,\; 15^2)
$$

Given $y = 115$, posterior:

$$
\theta \mid y \sim N(110.39,\; 63.23)
$$

Test:

$$
H_0: \theta \le 100 \quad \text{vs} \quad H_1: \theta > 100
$$

Posterior probabilities:

$$
P(\theta \le 100 \mid y) = 0.106, \quad
P(\theta > 100 \mid y) = 0.894
$$

Posterior odds $= 0.1185$ → Evidence supports $H_1$.

---

## **11) Handling Point Null**
(Handling Point Null in Continuous Case)

Problem: $P(\theta = \theta_0) = 0$ under a continuous prior.

Solutions:

**(a) Spike-and-slab prior:**

$$
\pi(\theta) = \pi_0 \delta_{\theta_0}(\theta) + \pi_1 g_1(\theta)
$$

**(b) Test interval around θ₀:**

$$
H_0: \theta \in [\theta_0 - \epsilon, \theta_0 + \epsilon]
$$

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
