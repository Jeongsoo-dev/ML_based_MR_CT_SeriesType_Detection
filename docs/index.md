---
title: "Cercare Medical — ML Project"
hide:
  - title
---

<div class="hero">
  <img src="images/profile.jpg" alt="Jeongsoo Pang" class="headshot-hero">

  <div class="hero-text">
    <h1>ML-Based MR/CT Series Type Detection from DICOM Headers</h1>

    <strong class="bio-name">Jeongsoo Pang</strong><br>
    Cercare Medical (Denmark) — R&D<br>
    ML Specialist<br>
    2024.06.01 – 2024.12.01
  </div>
</div>

<div class="clear"></div>

---

## Overview

Radiology pipelines rely on correctly identifying the **series type** (MR: DWI, SWI, T1, T2, FLAIR, etc.; CT: angiography, perfusion, non-contrast) before reconstruction, post-processing, and downstream analytics. In practice, rule-based detectors fail because DICOM metadata is inconsistent across vendors and sites: private tags, nested sequences, multilingual / abbreviated fields, and missing or misleading `SeriesDescription`.

This project delivers a production-ready ML pipeline that classifies **8 MR** and **3 CT** series types using **DICOM header metadata only**, and includes a conservative **selective-prediction (self-inspection)** policy to defer uncertain cases to human review.

**External validation (partner hospitals):**
- MR accuracy: **96.69%**
- CT accuracy: **99.25%**

The system replaced a legacy rule-based detector in production and was designed for maintainability, safe operation, and future retraining.

---

## Project Goals

- Replace a brittle rule-based detector with a robust ML solution for **8 MR** and **3 CT** series types.
- Maintain utility when textual fields are missing or unreliable (notably `SeriesDescription`).
- Provide a safety mechanism that flags low-confidence predictions for radiologist review.
- Make the pipeline easy to retrain and deploy with consistent preprocessing and schema checks.

---

## My Contributions

- Implemented a **DICOM header extraction** workflow designed to tolerate missing fields and vendor variability.
- Built feature preprocessing for mixed types (numeric, categorical, missing / unknown-safe one-hot).
- Trained and validated **two HistGradientBoosting (HGBC) models** per modality:
  - With `SeriesDescription`
  - Without `SeriesDescription` (robust fallback)
- Designed a **selective-prediction gate** based on confidence and top-2 margin to abstain on ambiguous cases.
- Added explainability with **SHAP** to support QA and deployment readiness.
- Supported external validation runs and production replacement with serialized artifacts.

---

## Dataset Summary

| Modality | Train | Test |
|---------:|------:|-----:|
| MR       | 171   | 185  |
| CT       | 271   | 407  |

**MR labels (8):** `pwi_dsc`, `pwi_dce`, `swi`, `dwi`, `t2`, `t2_flair`, `t1`, `t1_contrast`  
**CT labels (3):** `ct_angiography`, `ct_perfusion`, `ct_noncontrast`

---

## Feature Set

The model uses header-derived metadata only (no pixel data). Features are intentionally pragmatic: stable across sites when possible, and useful for discriminating protocol families.

**MR examples**
- Timing / sequence: `RepetitionTime`, `InversionTime`, `EchoTrainLength`, `EchoSpacing`, `FlipAngle`
- Acquisition / encoding: `PhaseEncodingDirection`, `ScanOptions`
- System-level: `MagneticFieldStrength`
- Sequence identifiers when available: `PulseSequenceName`, `SequenceVariant`
- Diffusion hints when present: `Bvalue`

**CT examples**
- Contrast / acquisition: `ContrastBolusAgent`, `ExposureTime`, `KVP`
- Reconstruction: `ConvolutionKernel`, `ReconstructionDiameter`
- Table / timing: `TableSpeed`, `SeriesTime`
- Other: `ScanOptions`, `Modality`

---

## System Architecture

### 1) Ingestion
- Input: a multi-series study folder
- Select one representative DICOM per 3D series (reduces redundancy and avoids over-counting near-duplicate slices)

### 2) Header extraction → normalized feature dict
- Extract relevant tags with defensive parsing (missing values, private/nested structures)
- Normalize into a stable schema so training and inference share the exact same feature contract

### 3) Preprocessing
- Numeric: imputation
- Categorical: unknown-safe one-hot encoding
- Output: model-ready tabular feature matrix

### 4) Modeling (HGBC)
- HistGradientBoostingClassifier is a strong fit for sparse, heterogeneous tabular metadata:
  - handles missingness reliably
  - trains efficiently
  - good generalization under regularization
- Two-model strategy:
  - primary model includes `SeriesDescription` if present
  - fallback model excludes it to remain robust when text is missing or inconsistent

### 5) Selective prediction (self-inspection)
Rather than forcing a label for every case, the system abstains when confidence is insufficient.

A typical policy:
- abstain if `max_prob < τ₁`, or
- abstain if `(top1_prob − top2_prob) < τ₂`

Abstentions are routed to human review, and logs support later retraining.

![Pipeline workflow](images/workflow.png){ width="900" }

---

## Training & Tuning

Hyperparameter tuning was treated as an engineering process: consistent splits, leakage prevention, and reproducibility first.

**Search space (HGBC)**
- `learning_rate ∈ {0.03, 0.05, 0.07, 0.1}`
- `max_iter ∈ {200, 400, 800}` (with early stopping)
- `max_leaf_nodes ∈ {15, 31, 63}`
- `min_samples_leaf ∈ {10, 20, 40}`
- `l2_regularization ∈ {0.0, 0.01, 0.05, 0.1}`
- `validation_fraction=0.1`, `n_iter_no_change=20`, early stopping enabled

**Protocol**
1. Stratified cross-validation with patient-level separation to avoid leakage.
2. Random search to explore broadly, then refine around top configurations.
3. Prioritized macro-F1 and per-class recall; monitored coverage under selective prediction.

---

## Explainability & QA

- SHAP summaries were used to verify that the model relied on clinically sensible drivers (e.g., MR sequence timing parameters).
- Audited failure cases by reviewing mismatches and low-margin predictions.
- Used ablation checks (remove top features, remove `SeriesDescription`) to ensure the model’s behavior remained stable under expected metadata disruptions.

![Test map](images/test_map.png){ width="900" }

---

## Evaluation

- Patient-level splits for internal evaluation.
- External partner-hospital datasets used for final reporting to reflect real deployment conditions.
- Metrics tracked:
  - accuracy (headline)
  - macro-F1 and per-class recall (safety)
  - coverage / abstention rate under selective prediction

 ![ROC_curve](images/ROC_curve.png){ width="900" }

---

## Results

External validation on partner-hospital datasets:
- MR: **96.69%** accuracy
- CT: **99.25%** accuracy

The pipeline replaced the legacy detector in production and supports safe iteration via selective prediction and retraining-ready artifacts.

---

## Limitations & Next Steps

- Cross-vendor generalization is strong overall, but rare protocol variants remain the main source of errors.
- Long-tail classes benefit from continued data collection and targeted sampling.
- Lightweight, multilingual normalization for `SeriesDescription` can improve robustness without adopting heavy NLP stacks.
- Extend drift monitoring (coverage drop, feature distribution shift, calibration shift) to trigger retraining automatically.

---

## Acknowledgment

This project was conducted at **Cercare Medical (Denmark, 2024)** in collaboration with the **Lead AI Developer**, **Senior Software Developers**, and the **Operations team**, culminating in a successful production deployment and a recommendation letter from the CTO.

<!-- two images side-by-side -->
<div style="display:flex;justify-content:space-between;align-items:center;gap:2%;margin-top:12px;">
  <img src="images/cercare_1.jpg" alt="Cercare Image 1" style="width:49%;border-radius:8px;">
  <img src="images/cercare_2.jpg" alt="Cercare Image 2" style="width:49%;border-radius:8px;">
</div>
