---
title: Distributions and MLE
hide:
  - title
---

# **2. Distributions and MLE (Statistics Review)**
**Author:** Jeongsoo Pang  

---

## **1) Overview**

1. Review of common distributions (discrete & continuous)  
2. Maximum Likelihood Estimation (MLE)  
3. Frequentist inference foundations  
4. Transition to Bayesian thinking  

---

## **2) Common Probability Distributions**
### **Discrete**
- **Bernoulli $(p)$** — Binary outcome (success/failure)  
  $$f(x|p) = p^x(1-p)^{1-x}, \; x \in \{0,1\}$$  
  $E[X]=p,\; Var(X)=p(1-p)$  

- **Binomial $(n,p)$** — Number of successes in $n$ trials  
  $$P(X=x)=\binom{n}{x}p^x(1-p)^{n-x}$$  
  $E[X]=np,\; Var(X)=np(1-p)$  

- **Negative Binomial $(r,p)$** — Trials until $r$-th success  
  $$P(X=x)=\binom{x-1}{r-1}p^r(1-p)^{x-r}$$  
  $E[X]=\frac{r}{p},\; Var(X)=\frac{r(1-p)}{p^2}$  

- **Geometric $(p)$** — Trials until the first success  
  $$P(X=x)=(1-p)^{x-1}p,\; x=1,2,\ldots$$  
  $E[X]=\frac{1}{p},\; Var(X)=\frac{1-p}{p^2}$  

- **Poisson $(\lambda)$** — Counts events in time interval  
  $$f(x|\lambda)=\frac{\lambda^x e^{-\lambda}}{x!},\; x=0,1,2,\ldots$$  
  $E[X]=Var(X)=\lambda$  

---

### **Continuous**
- **Uniform $(\theta_1,\theta_2)$**  
  $$f(x)=\frac{1}{\theta_2-\theta_1},\; x\in[\theta_1,\theta_2]$$  
  $E[X]=\frac{\theta_1+\theta_2}{2},\; Var(X)=\frac{(\theta_2-\theta_1)^2}{12}$  

- **Normal $(\mu,\sigma^2)$**  
  $$f(x|\mu,\sigma)=\frac{1}{\sigma\sqrt{2\pi}}\,\exp\!\Big[-\frac{(x-\mu)^2}{2\sigma^2}\Big]$$  
  $E[X]=\mu,\; Var(X)=\sigma^2$  

- **Exponential $(\lambda)$**  
  $$f(x|\lambda)=\lambda e^{-\lambda x},\; x\ge0$$  
  $E[X]=\frac{1}{\lambda},\; Var(X)=\frac{1}{\lambda^2}$  

- **Gamma $(\alpha,\beta)$**  
  $$f(x|\alpha,\beta)=\frac{\beta^\alpha}{\Gamma(\alpha)}x^{\alpha-1}e^{-\beta x},\; x\ge0$$  
  $E[X]=\frac{\alpha}{\beta},\; Var(X)=\frac{\alpha}{\beta^2}$  
  > ✅ *Screenshot suggestion:* include the “Gamma function integral definition” slide (visual formula for $\Gamma(\alpha)$).

- **Beta $(\alpha,\beta)$**  
  $$f(x|\alpha,\beta)=\frac{1}{B(\alpha,\beta)}x^{\alpha-1}(1-x)^{\beta-1},\; 0\le x\le1$$  
  $E[X]=\frac{\alpha}{\alpha+\beta},\; Var(X)=\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}$  

---

## **3) Binomial to Normal Approximation**
When $n$ is large:
$$X \sim Bin(n,p) \approx N(np, np(1-p))$$  
Using Stirling’s approximation, the binomial pmf converges to a Gaussian curve centered at $np$.  
> 💡 *Screenshot suggestion:* The **Galton Board** slide (visual illustration of normal approximation).

---

## **4) Frequentist Perspective**
- **Probability** = Long-run frequency of events.  
- **Parameters** = Fixed but unknown constants (randomness only from data).  
- **Inference** uses sampling distributions, LLN, and CLT for asymptotic guarantees

Example (Coin flip):  
- $n=100$, $x=44$ heads  
  $$\hat{p}_{MLE}=\frac{x}{n}=0.44$$  
- Approx. sampling distribution: $\hat{p}\approx N(p, p(1-p)/n)$  
- $95\%$ CI: $\hat{p}\pm1.96\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}=(0.34,0.54)$  

---

## **5) Maximum Likelihood Estimation (MLE)**
For model parameter $\theta$, define likelihood:
$$L(\theta; x)=f(x|\theta)$$  
Log-likelihood:
$$\ell(\theta)=\ln L(\theta)=\sum_i \ln f(x_i|\theta)$$  
Then maximize $\ell(\theta)$ to get $\hat{\theta}_{MLE}$.  

**Example: Coin Flip**
$$L(p;x)=\binom{n}{x}p^x(1-p)^{n-x}$$  
$$\ell(p)=x\ln p+(n-x)\ln(1-p)$$  
$$\frac{d\ell}{dp}=0 \Rightarrow \hat{p}_{MLE}=\frac{x}{n}=0.44$$  

---

## **6) Transition to Bayesian Perspective**
- Frequentist: Parameters fixed, randomness from data.  
- Bayesian: Parameters are **random variables** with **prior beliefs**.  
- Use **Bayes’ Theorem** for update:  
  $$p(\theta|y)=\frac{p(y|\theta)p(\theta)}{p(y)} \;\propto\; p(\theta)p(y|\theta)$$  

> This sets up the foundation for **Lecture 3: Priors and Bayesian Updating**.

---

## **7) Key Takeaways**
- Know **mean and variance** of Bernoulli, Binomial, Poisson, Normal, Exponential, Gamma, and Beta.  
- Understand **MLE derivation** via log-likelihood maximization.  
- Grasp difference between **Frequentist vs Bayesian interpretation** of probability.  
- Remember **Normal approximation** to Binomial and **visualize via Galton board**.  

---

## **8) Summary Quote**
> *Statistical inference starts by describing randomness through distributions, estimating parameters via likelihood, and ultimately extending to Bayesian updating for uncertainty quantification.*

---
