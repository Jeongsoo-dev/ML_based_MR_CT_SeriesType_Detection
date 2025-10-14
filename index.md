# Machine-Learning–Based MR & CT Series-Type Detection
**Author:** Jeongsoo Pang  

---

## Abstract
Radiology workflows depend on correctly identifying **series types** (e.g., MR: DWI, SWI, T1, T2 FLAIR; CT: Angio/Perfusion/Noncontrast) before reconstruction, analysis, or visualization. Vendor-specific DICOM conventions, private tags, nested data, multilingual fields, and missing metadata make rule-based detectors unreliable.  

This project delivers a **production-ready ML pipeline** that automatically classifies **8 MR** and **3 CT** series using only DICOM header metadata. It features:  
1. A robust **feature-extraction module** handling private/nested tags and multilingual headers.  
2. Two **HistGradientBoosting (HGBC)** models—trained **with** and **without** `SeriesDescription`—to remain robust when textual labels are missing or inconsistent.  
3. A **self-inspection mechanism** that flags low-confidence predictions to radiologists for review.  

Externally validated on partner-hospital datasets, the model achieved **96.69% MR** and **99.25% CT** accuracy, replacing the legacy C++ detector in production. The design emphasizes **maintainability**, **future retraining**, and **clinical safety**.

All works and codes belongs to Cercare-Medical Comapany.
---

## Project Goal
- Build an ML model to classify **8 MR** and **3 CT** series, replacing the company’s rule-based detector.  
- Ensure the model is **easy to retrain** for new series and **safe to deploy** through confidence-based self-inspection.  

---

## My Contributions
- **Engineered DICOM Header Extractor**: Built a parsing module resilient to vendor differences, private tags, nested attributes, and multilingual strings.  
- **Data De-biasing**: Extracted one representative DICOM per 3D study to prevent overrepresentation of multi-slice data.  
- **Feature Preprocessing**: Normalized numerical and categorical data, handling missing and string-based values.  
- **Dual-Model Training**: Implemented two **HistGradientBoosting** classifiers (with/without `SeriesDescription`) to ensure robustness across diverse datasets.  
- **Self-Inspection Gate**: Introduced confidence thresholds using class probability margins; model abstains and escalates uncertain predictions.  
- **External Validation & Deployment**: Collaborated with CEO/CTO and hospitals to curate anonymized test data; replaced the production model after outperforming the legacy version.  
- **Explainability & Extensibility**: Integrated SHAP-based feature importance for interpretability and future model retraining.

---

## Dataset Summary
**All data stored securely on Blackbox server.**  
Preprocessed to ensure only unique and anonymized records per study.

| Modality | Train Samples | Test Samples |
|-----------|----------------|---------------|
| MR | 171 | 185 |
| CT | 271 | 407 |

**MR Classes (8)**: `pwi_dsc`, `pwi_dce`, `swi`, `dwi`, `t2`, `t2_flair`, `t1`, `t1_contrast`  
**CT Classes (3)**: `ct_angiography`, `ct_perfusion`, `ct_noncontrast`

---

## Feature Overview
### MR
`NumberTemporalPositions`, `PhaseEncodingDirection`, `RepetitionTime`, `FlipAngle`, `InversionTime`, `EchoTrainLength`, `MagneticFieldStrength`, `EchoSpacing`, `PulseSequenceName`, `SequenceVariant`, `Bvalue`, `ScanOptions`

### CT
`ContrastBolusAgent`, `ExposureTime`, `KVP`, `ScanOptions`, `ReconstructionDiameter`, `ConvolutionKernel`, `TableSpeed`, `SeriesTime`, `Modality`

---

## Pipeline Overview
1. **Data Ingestion**  
   - Access DICOM files from Blackbox server; select one DICOM per 3D series.  

2. **Feature Extraction**  
   - Extract and normalize relevant headers → grouped JSON format for structured access.  

3. **Preprocessing**  
   - Numerical columns imputed (`SimpleImputer(strategy='constant')`)  
   - Categorical columns encoded with `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`  

4. **Model Training (HGBC)**  
   - Two models: one with `SeriesDescription`, one without.  
   - HGBC chosen for its native support of missing values, histogram binning for noise resistance, and efficient dense computation.  
   - Parameters tuned (`max_iter=100`, `learning_rate=0.1`, `max_leaf_nodes=31`, `early_stopping='auto'`, `validation_fraction=0.1`).  

5. **Self-Inspection / Selective Prediction**  
   - Model abstains when confidence < threshold or top-two probabilities too close.  
   - Prevents misclassification; human review required.  

6. **Validation & Deployment**  
   - Tested with external hospital datasets.  
   - Replaced the existing production model after achieving MR 96.69% and CT 99.25% accuracy.  

---

## Why **HistGradientBoosting**
| Property | Advantage |
|-----------|------------|
| Mixed-type handling | Works seamlessly with numeric + categorical DICOM metadata |
| Missing values | Native support; no external imputation required |
| Histogram binning | Reduces noise and improves speed |
| Dense matrix support | Avoids sparse-vector inefficiency |
| Regularization control | Fine-grained tuning of model complexity |
| Early stopping | Prevents overfitting automatically |

---

## Explainability & Model Safety
- Integrated **SHAP explainer** for per-feature importance.  
- Established **self-inspection threshold** to prevent silent misclassification.  
- Designed **audit-ready** JSON structure and serialized pipelines for full reproducibility.  

---

## Future Work
- Implement probability calibration (temperature scaling).  
- Explore lightweight text normalization for multilingual `SeriesDescription`.  
- Automate drift detection and retraining triggers.  
- Expand to multi-institution datasets for improved generalization.

---

## Deployment Readiness
| Component | Description |
|------------|-------------|
| `mr_feature_extraction_script.py` | Extracts MR DICOM headers → JSON |
| `mr_ml_train_test_script.py` | Trains HGBC models (with/without `SeriesDescription`) |
| `classify_series_type.py` | Inference script for production use |
| `inference.py` | Self-inspection and prediction interface |
| `utils.py` | Shared helper utilities for file IO, validation, and preprocessing |

---

## Results Summary
Validated on external partner-hospital datasets:  
- **MR Accuracy:** 96.69%  
- **CT Accuracy:** 99.25%  
- Deployed to production, replacing legacy rule-based system.  
- Supports safe, extensible retraining and transparent human-in-the-loop decision flow.

---

## Acknowledgment
This project was conducted under **Cercare-Medical, Denmark (2024)** with direct collaboration with the **CTO**, **CEO**, and **partner hospitals**, resulting in a successful production deployment and recommendation from the executive team.

---
