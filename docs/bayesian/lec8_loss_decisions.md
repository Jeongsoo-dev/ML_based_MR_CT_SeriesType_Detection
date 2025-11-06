---
title: Bayesian Decision Theory
hide:
  - title
---

# **8. Bayesian Decision Theory**

---

## **1) Overview**

Bayesian Decision Theory provides a framework for making optimal decisions under uncertainty by combining:

- **Probability (Bayesian inference)**  
- **Consequences (loss function)**

Key idea: Choose the decision that *minimizes expected loss*.

---

## **2) Components of a Bayesian Decision Problem**

| Component | Meaning |
|-----------|---------|
| **Parameter** $\theta$ | Unknown state of nature |
| **Data** $x$ | Observation from distribution $p(x \mid \theta)$ |
| **Decision rule** $\delta(x)$ | Function mapping data → action |
| **Loss function** $L(\theta, \delta(x))$ | Penalty for choosing decision $\delta(x)$ when $\theta$ is true |

---

## **3) Loss Functions**

| Loss Type | Definition | Use Case |
|-----------|------------|----------|
| **0–1 Loss (Classification/Hypothesis Test)** | $L(\theta, \delta(x)) = \begin{cases} 0, & \theta = \delta(x) \\ 1, & \theta \ne \delta(x) \end{cases}$ | Yes/No decision problems |
| **Squared Error Loss** | $L(\theta, \delta(x)) = (\theta - \delta(x))^2$ | Parameter estimation |
| **Example (Umbrella Problem)** | Decision = bring umbrella or not. Loss = cost of being wet vs inconvenience of carrying umbrella | Risk comparison |

---

## **4) Frequentist Risk**

Expected loss over all possible samples when $\theta$ is fixed:

$$
R(\theta, \delta) = \mathbb{E}_\theta \big[ L(\theta, \delta(X)) \big]
= \int L(\theta, \delta(x)) \, f(x \mid \theta) \, dx
$$

Risk = average penalty from repeated sampling under same $\theta$.

---

## **5) Posterior Risk (Bayesian Perspective)**

Given data $x$, posterior expected loss is:

$$
\rho(\delta(x)) = \int_\Theta L(\theta, \delta(x)) \, \pi(\theta \mid x) \, d\theta
$$

**Bayes Action (Optimal Decision):**

$$
\delta^\*(x) = \arg\min_{\delta(x)} \, \rho(\delta(x))
$$

---

## **6) Bayes Estimator**

> Under squared error loss, the Bayes estimator is the **posterior mean**.

**Proof Sketch:**

Minimize

$$
\rho(\delta(x)) = \int (\theta - \delta(x))^2 \, \pi(\theta|x)\, d\theta
$$

Differentiate w.r.t. $\delta(x)$ and set to 0:

$$
\delta^\*(x) = \mathbb{E}[\theta \mid x]
$$

✔ Posterior mean minimizes expected squared error.

---

## **7) Bayes Risk**

Total (overall) expected loss:

$$
r(\pi, \delta) =
\iint L(\theta, \delta(x)) f(x \mid \theta)\, \pi(\theta) \, dx \, d\theta
= \int \rho(\delta(x)) \, \pi(x) \, dx
$$

- Measures performance **averaged over both prior and data**  
- **Bayes rule** $\delta_B$ minimizes $r(\pi, \delta)$

---

## **8) Minimax Decision Rule (Frequentist)**

When no prior is assumed:

$$
\delta^\*_{\text{minimax}} = \arg\min_\delta \max_{\theta} R(\theta, \delta)
$$

- Protects against the **worst-case** $\theta$  
- Purely frequentist — no prior involved

---

## **9) Example — Umbrella Decision**

| Nature / Decision | Take Umbrella (T) | Don’t Take (D) |
|-------------------|-------------------|----------------|
| **Rain (R)**      | 0 (dry)          | 10 (wet)       |
| **No Rain (N)**   | 1 (inconvenience) | 0              |

If rain probability $P(R)=p$:

- Bayes risk of **Take Umbrella**: $r(T) = 1 - p$  
- Bayes risk of **Don’t Take**: $r(D) = 10p$  

Choose $T$ if $1 - p < 10p \Rightarrow p > \frac{1}{11} \approx 0.09$

**Decision rule:**  
- If $P(\text{rain}) > 0.09$ → bring umbrella  
- Else → leave it

---

## **10) Summary**

✔ Decisions combine **data + prior + loss function**  
✔ **Posterior risk** is minimized to choose optimal decision  
✔ **Posterior mean = Bayes estimator** (for squared loss)  
✔ **Bayes risk** evaluates decision rules globally  
✔ **Minimax rule** = safest against worst-case $\theta$ (no prior)  
✔ Umbrella example illustrates real-world Bayesian reasoning

---

<sub>© Jeongsoo Pang — All rights reserved</sub>
