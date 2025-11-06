---
title: Hierarchical Bayesian Models
hide:
  - title
---

# **11. Hierarchical Bayesian Models**

---

## **1) Why Hierarchical Models**

Hierarchical models are used when data are grouped or come from multiple related populations:

- Clinical trials across hospitals  
- Student test scores across schools  
- Manufacturing defects from multiple factories  

They allow us to share information across groups, balancing:

| Model Type | Description | Drawback |
|------------|-------------|----------|
| **Complete pooling** | Combine all data as if from one group | Ignores group differences |
| **No pooling (separate models)** | Fit each group independently | Unstable if group size is small |
| **Hierarchical / Partial pooling** | Groups share a common prior/hyperparameters | Best compromise |

---

## **2) Two-Level Hierarchical Structure**

Typical model structure:

- **Level 1 (Observation level):**  
  $$
  y_j \mid \theta_j \sim p(y_j \mid \theta_j)
  $$

- **Level 2 (Group-level parameters):**  
  $$
  \theta_j \mid \alpha, \beta \sim p(\theta_j \mid \alpha, \beta)
  $$

- **Level 3 (Hyperpriors):**  
  $$
  \alpha, \beta \sim p(\alpha, \beta)
  $$

Posterior factorization:

$$
p(\theta, \alpha, \beta \mid y) \propto
\left[ \prod_{j=1}^J p(y_j \mid \theta_j) \right]
\left[ \prod_{j=1}^J p(\theta_j \mid \alpha, \beta) \right]
p(\alpha, \beta)
$$

---

## **3) Motivating Example: Binomial-Beta Hierarchical Model**

Suppose we have $J$ experiments/groups:

- Data: $y_j \sim \text{Binomial}(n_j, \theta_j)$  
- Group-level parameters: $\theta_j \sim \text{Beta}(\alpha, \beta)$  
- Hyperparameters $(\alpha, \beta)$ unknown

Posterior for all parameters:

$$
p(\theta_1,\dots,\theta_J,\alpha,\beta \mid y) \propto
\left[\prod_{j=1}^J \theta_j^{y_j}(1-\theta_j)^{n_j-y_j} \right]
\left[\prod_{j=1}^J \theta_j^{\alpha-1}(1-\theta_j)^{\beta-1} \right]
p(\alpha,\beta)
$$

---

## **4) Posterior for Each Group Parameter θᵢ**

Given hyperparameters $(\alpha, \beta)$:

$$
\theta_j \mid y_j, \alpha, \beta \sim
\text{Beta}(y_j + \alpha,\; n_j - y_j + \beta)
$$

Posterior mean:

$$
E[\theta_j \mid y_j, \alpha, \beta] =
\frac{y_j + \alpha}{n_j + \alpha + \beta}
$$

This can be rewritten as a shrinkage form:

$$
E[\theta_j \mid y_j] =
w_j \cdot \frac{y_j}{n_j} + (1 - w_j) \cdot \frac{\alpha}{\alpha + \beta}
$$

where the shrinkage weight is:

$$
w_j = \frac{n_j}{n_j + \alpha + \beta}
$$

✔ If $n_j$ is small → more shrinkage toward the population mean  
✔ If $n_j$ is large → θ_j relies mostly on its data

---

## **5) Full Bayesian Inference**

We often want the posterior of $(\alpha, \beta)$:

$$
p(\alpha, \beta \mid y) \propto
p(\alpha, \beta) \prod_{j=1}^J
\frac{B(y_j + \alpha, n_j - y_j + \beta)}{B(\alpha, \beta)}
$$

Then **θᵢ is averaged over hyperparameters**:

$$
p(\theta_j \mid y) =
\int p(\theta_j \mid \alpha, \beta, y_j)
\; p(\alpha, \beta \mid y) \; d\alpha \, d\beta
$$

This accounts for uncertainty in α and β.

---

## **6) 71 Rats Tumor Experiment**

- 71 laboratories  
- Each records number of tumors $y_j$ out of $n_j$ rats  
- Data is highly variable; some labs have small $n_j$  

Model:

$$
y_j \sim \text{Bin}(n_j, \theta_j),
\quad
\theta_j \sim \text{Beta}(\alpha, \beta)
$$

Goal: Estimate each lab’s tumor rate $\theta_j$ while **sharing information across labs**.

---

## **7) Priors for Hyperparameters (α, β)**

Common weakly-informative prior:

$$
p(\alpha, \beta) \propto (\alpha + \beta)^{-5/2}
$$

Or in mean–precision form:

- Let $\mu = \frac{\alpha}{\alpha + \beta}$  
- Let $\kappa = \alpha + \beta$  
- Then $\alpha = \mu\kappa,\ \beta = (1 - \mu)\kappa$

Place priors on $(\mu, \kappa)$ instead for better interpretability.

---

## **8) Why Hierarchical Models Work So Well**

✔ They borrow strength across groups  
✔ They produce partial pooling (shrinkage)  
✔ Reduce overfitting in small datasets  
✔ Provide more realistic uncertainty quantification

---

## **9) Summary**

| Feature | Benefit |
|---------|---------|
| Group-specific θⱼ | Allows variation across groups |
| Hyperparameters (α, β) | Capture population-wide behavior |
| Partial pooling | Balances group data with overall mean |
| Posterior shrinkage | Small samples are stabilized |
| Fully Bayesian | Accounts for all uncertainty |

---

<sub>© Jeongsoo Pang — All rights reserved
