---
title: "Anti-Drone Project"
hide:
  - title
---

<div class="hero">
  <img src="images/profile.jpg" alt="Jeongsoo Pang" class="headshot-hero">

  <div class="hero-text">
    <h1>Anti-Drone Project — RF/EO Fusion & ML Tracking</h1>

    <strong class="bio-name">Jeongsoo Pang</strong><br>
    **Cercare-Medical R&D**<br>
    **ML-Specialist**<br>
    **2024.06.01 – 2024.12.01**
  </div>
</div>

<div class="clear"></div>

## Abstract
Short paragraph describing the anti-drone problem, signals (RF/EO), constraints (latency/embedded), and the high-level ML approach.

## System Overview
- Sensors, data rates, synchronization
- Preprocessing / feature pipelines
- Model blocks (detection, tracking, fusion)

## ML Approach
- Candidate models, why chosen (e.g., gradient boosting for tabular RF features + CNN/ViT for EO crops, late fusion)
- Hyperparameters & search strategy (as you did on the MR/CT page)
- Evaluation setup and metrics

## Results
- Precision/recall/latency tables
- Example confusion analysis
- Failure modes

## Deployment
- On-device/runtime constraints
- Model compression/quantization if applicable
- Monitoring and auto-retrain triggers

## Next Steps
- Planned data collection
- Robustness improvements
- Edge MLOps items
