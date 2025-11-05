---
title: Priors and Conjugacy
hide:
  - title
---

# **3. Prior Distributions (Prior I)**
**Author:** Jeongsoo Pang  

---

## **1) Recap & Posterior Validity**
- **Bayes (discrete):** $P(A\mid B)=\dfrac{P(B\mid A)P(A)}{P(B)}\propto P(B\mid A)P(A)$  
- **Bayes (continuous):** $p(\theta\mid x)=\dfrac{p(x\mid\theta)p(\theta)}{p(x)}\propto p(x\mid\theta)p(\theta)$ with $p(x)=\int p(x\mid\theta)p(\theta)\,d\theta$  
- **Proper posterior is required:** $\sum_\theta p(\theta\mid x)=1$ (discrete) or $\int p(\theta\mid x)d\theta=1$ (continuous).  

**Useful identities**

- **Odds form:** $\displaystyle \frac{P(\theta_1\mid Y)}{P(\theta_2\mid Y)}=\frac{P(\theta_1)P(Y\mid\theta_1)}{P(\theta_2)P(Y\mid\theta_2)}$  
- **Total expectation:** $E[U]=E_V\!\big[E[U\mid V]\big]$  
- **Total variance:** $\mathrm{Var}(U)=E[\mathrm{Var}(U\mid V)]+\mathrm{Var}(E[U\mid V])$  

---

## **2) What is a Prior**
- Priors encode information before observing $x$.  
- Not all priors are “subjective”: can be chosen by **objective principles**, **mathematical convenience**, **decision-theoretic arguments**, or **elicitation** from experts.  
- **Families**: **conjugate**, **informative/weakly-informative**, **non/informative**, **reference**, **Jeffreys**, **improper**, **invariant**, **nonparametric**.  

---

## **3) Conjugate Priors**
A prior $\pi(\theta)$ is **conjugate** to likelihood $p(x\mid\theta)$ if the **posterior** $\pi(\theta\mid x)\propto p(x\mid\theta)\pi(\theta)$ is in the **same family** as $\pi(\theta)$.  
> Benefit: closed-form posteriors, simple hyperparameter updates.

---

## **4) Core Conjugate Pairs**

### **4.1) Normal mean**
- Model: $X\sim\mathcal N(\mu,\sigma^2)$, $\sigma^2$ known  
- Prior: $\mu\sim\mathcal N(\nu,\eta^2)$  
- Posterior:
  $$
  \mu\mid X \sim \mathcal N\!\left(
  \frac{\eta^2 X+\sigma^2 \nu}{\eta^2+\sigma^2}\;,\;
  \frac{\eta^2\sigma^2}{\eta^2+\sigma^2}
  \right)
  $$
  **Interpretation:** posterior mean is a **precision-weighted average** of $X$ and $\nu$:
  $$
  \mu\mid X \sim \mathcal N\!\left(
  \frac{X/\sigma^2+\nu/\eta^2}{1/\sigma^2+1/\eta^2}\;,\;
  \frac{1}{1/\sigma^2+1/\eta^2}
  \right)
  $$

### **4.2) Bernoulli/Binomial**
- Bernoulli $X_i\sim\mathrm{Ber}(\theta)$ or $Y\sim\mathrm{Bin}(n,\theta)$  
- Prior: $\theta\sim\mathrm{Beta}(\alpha,\beta)$  
- Let $S=\sum_i X_i$ (or $y$). Posterior:
  $$
  \theta\mid X \sim \mathrm{Beta}\!\big(\alpha+S,\;\beta+n-S\big)
  $$

### **4.3) Geometric**
- $X\sim\mathrm{Geom}(\theta)$ (trials until first success, support $1,2,\dots$)  
- Prior: $\theta\sim\mathrm{Beta}(\alpha,\beta)$  
- Posterior:
  $$
  \theta\mid X=x \sim \mathrm{Beta}\!\big(\alpha+1,\;\beta+x-1\big)
  $$

### **4.4) Poisson**
- $X\sim\mathrm{Poisson}(\lambda)$  
- Prior: $\lambda\sim\mathrm{Gamma}(\alpha,\beta)$ (shape–rate)  
- Posterior:
  $$
  \lambda\mid X=x \sim \mathrm{Gamma}\!\big(\alpha+x,\;\beta+1\big)
  $$

---

## **5) Variance Priors & Joint Conjugacy for Normal**
### **5.1) Inverse-Gamma for variance (mean known)**
- $X\sim\mathcal N(\mu,\sigma^2)$ with $\mu$ known  
- Prior: $\sigma^2\sim\mathrm{InvGamma}(\alpha,\beta)$  
- Posterior:
  $$
  \sigma^2 \mid X \sim \mathrm{InvGamma}\!\left(\alpha+\tfrac12,\;\beta+\tfrac12(X-\mu)^2\right)
  $$

### **5.2) Normal–Inverse-Gamma (mean & variance unknown)**
- Likelihood: $X\mid\mu,\sigma^2\sim\mathcal N(\mu,\sigma^2)$  
- Prior: 
  $$
  \mu\mid\sigma^2 \sim \mathcal N\!\Big(\mu_0,\;\sigma^2/\kappa_0\Big), 
  \qquad \sigma^2 \sim \mathrm{InvGamma}(\alpha_0,\beta_0)
  $$
- Posterior updates:
  $$
  \kappa_n=\kappa_0+1,\quad 
  \mu_n=\frac{\kappa_0\mu_0+X}{\kappa_0+1},\quad 
  \alpha_n=\alpha_0+\tfrac12,\quad
  \beta_n=\beta_0+\tfrac12\,\frac{\kappa_0}{\kappa_0+1}(X-\mu_0)^2
  $$
  and
  $$
  \mu\mid\sigma^2,X\sim\mathcal N(\mu_n,\sigma^2/\kappa_n),\quad 
  \sigma^2\mid X\sim\mathrm{InvGamma}(\alpha_n,\beta_n)
  $$

---

## **6) Multinomial–Dirichlet**
- **Likelihood:** $X=(X_1,\dots,X_k)\sim\mathrm{Multinomial}(n;\,p_1,\dots,p_k)$  
- **Prior:** $\mathbf p\sim\mathrm{Dirichlet}(\alpha_1,\dots,\alpha_k)$  
- **Posterior:** $\mathbf p\mid X\sim\mathrm{Dirichlet}(\alpha_1+X_1,\dots,\alpha_k+X_k)$  

---

## **7) Exponential Family View (why conjugacy is common)**
Many likelihoods satisfy  
$$
p(x\mid\eta)=h(x)\exp\{\eta^\top t(x)-g(\eta)\}
$$
A generic conjugate prior is  
$$
\pi(\eta\mid\tau,\rho)\propto \exp\{\tau^\top\eta-\rho\,g(\eta)\}
$$
which yields posterior  
$$
\pi(\eta\mid x,\tau,\rho)\propto \exp\{(\tau+t(x))^\top\eta-(\rho+1)g(\eta)\}
$$
> **Example (Poisson):** with $\eta=\log\lambda$, the generic form reduces to **Gamma** prior on $\lambda$.

---

## **8) Choosing Hyperparameters**
1) **Match moments:** choose prior $(\alpha,\beta,\ldots)$ to hit desired prior mean/variance.  
2) **Quantiles:** set hyperparameters so prior places specific mass at meaningful cutoffs.  
3) **Hierarchical Bayes:** put priors on hyperparameters to learn them from data.  
4) **Empirical Bayes:** estimate hyperparameters from data (plug-in).  

---

## **Note**
> Conjugate priors turn Bayes’ rule into simple algebra: prior hyperparameters update with sufficient statistics, giving closed-form posteriors and crisp interpretations (precision-weighted averaging, count-additivity).

---
<sub>© Jeongsoo Pang — All rights reserved
