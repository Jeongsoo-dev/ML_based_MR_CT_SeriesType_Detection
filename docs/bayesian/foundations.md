---
title: Bayesian Analysis
hide:
  - title
---

# 1. Bayesian foundations and motivation 
**Author:** Jeongsoo Pang  

## **1) Concept**
- **Bayesian Statistical Inference:** A framework that uses **Bayes’ Rule** to combine **prior knowledge** with **observed data**, forming a **posterior belief** about unknown parameters.  
- **Core Idea:** Treat parameters as **random variables** with probability distributions rather than fixed values.  
- **Focus:** **Uncertainty quantification**, **knowledge updating**, and **probabilistic reasoning**.  

---

## **2) Why Bayesian? (Motivation)**
- **Integrates prior knowledge:** Encodes existing beliefs or domain expertise.  
- **Logical updating:** Adjusts those beliefs as new data arrive.  
- **Probabilistic conclusions:** Allows probability statements about parameters (e.g., “There’s a 95% probability $\theta$ lies in this range”).  
- **Transparent modeling:** Easy to test sensitivity to assumptions.  

---

## **3) Core Equation (Bayes’ Rule)**
$$
p(\theta \mid x) \;=\; \frac{p(x \mid \theta)\,p(\theta)}{p(x)} \;\propto\; p(x \mid \theta)\,p(\theta)
$$

- **Posterior**: Updated belief after observing data.  
- **Likelihood**: Information from observed data.  
- **Prior**: Belief before observing data.  
- **Evidence (marginal likelihood)**: Normalizing constant ensuring posterior integrates to 1.  

---

## **4) Bayesian vs. Frequentist**
| **Aspect** | **Bayesian** | **Frequentist** |
|-------------|---------------|----------------|
| Parameter | Random variable with distribution | Fixed but unknown value |
| Data | Observed once; updates belief | Repeated hypothetical samples |
| Output | Posterior probability | Point estimate + confidence interval |
| Inference | Probabilistic about parameters | Probabilistic about data |

---

## **5) Where “Bayesian” Appears in ML/CS**
- **Naïve Bayes Classifier:** Spam detection; uses $P(\text{spam} \mid \text{email}) \propto P(\text{email} \mid \text{spam})\,P(\text{spam})$.  
- **Bayesian Networks:** Directed Acyclic Graphs (DAGs) modeling dependencies among variables; useful for **causal inference** and **probabilistic reasoning**.  
- **Bayesian Optimization:** Efficient search for global minima of costly black-box functions (hyperparameter tuning, A/B testing).  
- **Bayesian Experimental Design:** Adaptive experiments minimizing sample or cost (e.g., early-stopping in clinical trials).  

---

## **6) Why the Resurgence?**
- **Computational Power:** GPUs and MCMC algorithms make complex Bayesian models practical.  
- **Cultural Shift:** Acceptance of subjective priors and probabilistic thinking.  
- **Educational Change:** Modern statistics courses incorporate Bayesian reasoning.  

---

## **7) Key Terms**
- **Prior $p(\theta)$:** Belief about $\theta$ before seeing data.  
- **Likelihood $p(x \mid \theta)$:** Probability of data given $\theta$.  
- **Posterior $p(\theta \mid x)$:** Updated belief after seeing data.  
- **Evidence $p(x)$:** Normalizing term for comparison across models.  
- **Predictive Distribution $p(x_{\text{new}} \mid x)$:** Predicts unseen data, integrating over parameter uncertainty.  

---

## **8) Bayesian Workflow**
1. **Specify Prior:** Choose distribution for parameter $\theta$.  
2. **Select Likelihood:** Define model generating data.  
3. **Compute Posterior:** Combine prior and likelihood via Bayes’ rule.  
4. **Summarize Inference:** Use MAP, posterior mean, variance, or credible intervals.  
5. **Make Decisions:** Apply posterior to decision problems (e.g., minimize expected loss).  

---

## **9) Common Pitfalls**
- **Overly strong priors:** Can dominate data when sample size is small.  
- **Improper priors:** May cause invalid posteriors (non-integrable).  
- **Computational complexity:** High-dimensional models often need approximation (Monte Carlo, Variational Inference).  
- **Model checking:** Always perform posterior predictive checks.  

---

## **10) Mini Example – Naïve Bayes for Spam**
$$
P(\text{spam} \mid \text{email})
\;\propto\;
P(\text{email} \mid \text{spam})\,P(\text{spam})
$$

- **Assumption:** Words are conditionally independent given class.  
- **Result:** Fast training, interpretable features, still used for baseline text classification.  

---

## **11) What to Know for Midterm**
- Be able to **state and interpret Bayes’ Rule**.  
- Understand **difference between Bayesian and Frequentist inference**.  
- Explain **why Bayesian inference is powerful** (updates beliefs, quantifies uncertainty).  
- Know **applications in ML**: Naïve Bayes, Bayesian networks, optimization.  
- Understand **reason for resurgence**: computation + flexibility + interpretability.  

---

## **12) Summary Quote**
> *Bayesian inference formalizes learning from data by updating prior beliefs with evidence to obtain a posterior. It enables rational, probabilistic reasoning for real-world uncertainty — foundational to modern machine learning and decision-making.*
