---
title: "Machine-Learning–Based MR & CT Series-Type Detection"
hide:
  - title
---

<!-- 파일명 타이틀 fallback 방지용 숨김 H1 -->
<h1 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
  Machine-Learning–Based MR &amp; CT Series-Type Detection
</h1>

<!-- 좌측 프로필 / 우측 본문 -->
<section markdown="1" style="display:grid;grid-template-columns:240px 1fr;gap:24px;align-items:start;">

<aside>

<img src="images/profile.jpg" alt="Jeongsoo Pang" style="width:100%;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.15);margin-bottom:12px;">

**Jeongsoo Pang**  
UM–SJTU Joint Institute  
Electrical &amp; Computer Engineering

</aside>

<section markdown="1">

## Abstract
Radiology workflows depend on correctly identifying **series types** (e.g., MR: DWI, SWI, T1, T2 FLAIR; CT: Angio/Perfusion/Noncontrast) before reconstruction, analysis, or visualization. Vendor-specific DICOM conventions, private tags, nested data, multilingual fields, and missing metadata make rule-based detectors unreliable.  

This project delivers a **production-ready ML pipeline** that automatically classifies **8 MR** and **3 CT** series using only DICOM header metadata. It features:  
1. A robust **feature-extraction module** handling private/nested tags and multilingual headers.  
2. Two **HistGradientBoosting (HGBC)** models—trained **with** and **without** `SeriesDescription`—to remain robust when textual labels are missing or inconsistent.  
3. A **self-inspection mechanism** that flags low-confidence predictions to radiologists for review.  

Externally validated on partner-hospital datasets, the model achieved **96.69% MR** and **99.25% CT** accuracy, replacing the legacy C++ detector in production. The design emphasizes **maintainability**, **future retraining**, and **clinical safety**.

_All works and codes belong to Cercare-Medical Company._

---

## Project Goal
- Build an ML model to classify **8 MR** and **3 CT** series, replacing the company’s rule-based detector.  
- Ensure the model is **easy to retrain** for new series and **safe to deploy** through confidence-based self-inspection.  

---

## My Contributions
- **Engineered DICOM Header Extractor** robust to vendor/private/nested/multilingual tags.  
- **Data De-biasing**: one representative DICOM per 3D study.  
- **Feature Preprocessing** for numeric + categorical + missing/string values.  
- **Dual-Model Training**: HGBC with/without `SeriesDescription`.  
- **Self-Inspection Gate** with confidence thresholds and top-2 margin.  
- **External Validation & Deployment** with hospitals; production replacement.  
- **Explainability** with SHAP; reproducible JSON/serialized pipelines.

---

## Dataset Summary

| Modality | Train | Test |
|---------:|------:|-----:|
| MR       | 171   | 185  |
| CT       | 271   | 407  |

**MR (8):** `pwi_dsc`, `pwi_dce`, `swi`, `dwi`, `t2`, `t2_flair`, `t1`, `t1_contrast`  
**CT (3):** `ct_angiography`, `ct_perfusion`, `ct_noncontrast`

---

## Feature Overview

**MR:** `NumberTemporalPositions`, `PhaseEncodingDirection`, `RepetitionTime`, `FlipAngle`, `InversionTime`, `EchoTrainLength`, `MagneticFieldStrength`, `EchoSpacing`, `PulseSequenceName`, `SequenceVariant`, `Bvalue`, `ScanOptions`  

**CT:** `ContrastBolusAgent`, `ExposureTime`, `KVP`, `ScanOptions`, `ReconstructionDiameter`, `ConvolutionKernel`, `TableSpeed`, `SeriesTime`, `Modality`

---

## Pipeline Overview
1. **Ingestion**: select one DICOM per 3D series from Blackbox server.  
2. **Feature Extraction** → normalized, grouped JSON.  
3. **Preprocessing**: imputation + one-hot (unknown-safe).  
4. **Training** (HGBC): tuned `max_iter=100`, `lr=0.1`, `max_leaf_nodes=31`, `early_stopping='auto'`, `validation_fraction=0.1`.  
5. **Selective Prediction**: abstain on low confidence or tight top-2.  
6. **Validation/Deployment**: external datasets; production replacement.

---

## Why HistGradientBoosting

| Property               | Advantage                                                                 |
|------------------------|---------------------------------------------------------------------------|
| Mixed-type handling    | Works with numeric **and** categorical DICOM metadata                     |
| Missing values         | Native support; minimal imputation                                        |
| Histogram binning      | Noise-robust and fast                                                     |
| Dense matrix support   | Avoids sparse-vector overhead                                             |
| Regularization control | Fine-grained tuning                                                       |
| Early stopping         | Validation-based overfitting control                                      |

---

## Explainability & Model Safety
- **SHAP** for per-feature importance.  
- **Self-inspection thresholds** to prevent silent misclassification.  
- **Audit-ready** JSON and serialized pipelines.

---

## Deployment Readiness

| Component                         | Description                                                          |
|-----------------------------------|----------------------------------------------------------------------|
| `mr_feature_extraction_script.py` | Extract MR DICOM headers → JSON                                      |
| `mr_ml_train_test_script.py`      | Train HGBC models (with/without `SeriesDescription`)                 |
| `classify_series_type.py`         | Inference entry point for production                                 |
| `inference.py`                    | Self-inspection + prediction interface                               |
| `utils.py`                        | Helpers (I/O, validation, preprocessing)                             |

---

## Results Summary
External partner-hospital validation: **MR 96.69%**, **CT 99.25%**.  
Deployed to production; supports safe retraining and human-in-the-loop.

<!-- 두 이미지를 가로로 -->
<div style="display:flex;justify-content:space-between;align-items:center;gap:2%;margin-top:12px;">
  <img src="images/cercare_1.jpg" alt="Cercare Image 1" style="width:49%;border-radius:8px;">
  <img src="images/cercare_2.jpg" alt="Cercare Image 2" style="width:49%;border-radius:8px;">
</div>

---

## Acknowledgment
This project was conducted under **Cercare-Medical, Denmark (2024)** with direct collaboration with the **Lead AI Developer**, **Senior Software Developers**, and **Operation Team**, resulting in a successful production deployment and recommendation Letter from the **CTO**.

</section>
</section>
