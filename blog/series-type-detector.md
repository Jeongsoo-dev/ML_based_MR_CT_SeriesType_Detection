# 🧠 Advanced ML Pipeline for MR/CT Series Type Detection Using DICOM Headers

## 🌍 Overview

Modern radiology workflows involve parsing thousands of DICOM series from MR and CT modalities. Determining the exact **series type** (e.g., SWI, T2 FLAIR, CT Angiography) is essential for accurate processing, post-analysis, and visualization. This post introduces a robust, production-ready ML pipeline that automatically classifies series type based solely on metadata extracted from DICOM headers.

---

## 🔍 Problem Statement

Historically, systems used static rule-based logic trees to infer modality and series types. These logic trees were:

- ❌ Brittle and hard to scale  
- ❌ Dependent on vendor-specific `SeriesDescription`  
- ❌ Prone to errors from inconsistent metadata  

### ✅ Our Goals

- Build a **vendor-agnostic ML classifier**  
- Base predictions on robust DICOM header features  
- Achieve >95% classification accuracy  

---

## 📊 Dataset & Feature Engineering

### 💼 Source Datasets

- CT: `ct_ich_aarhus`, `ct_stroke_heidelberg`, `ct_test`  
- MR: `mr_stroke_aarhus`, `mr_stroke_iknow`, `mr_onco_aarhus`, `mr_onco_tcia`, `mr_additional_train`, `mr_test_data`

### 📂 Extracted Features

We extract both **standard and private DICOM header fields** including:

- `SeriesDescription`, `EchoTime`, `RepetitionTime`, `FlipAngle`, `InversionTime`, `EchoTrainLength`  
- `NumberTemporalPositions`, `MagneticFieldStrength`, `EchoSpacing`, `PulseSequenceName`, `SequenceVariant`, `ScanOptions`  
- `BValue` (from vendor-specific tags like Siemens, GE, Philips)  
- `PixelSpacing1`, `PixelSpacing2`, `SliceThickness`

### 🔬 Why These Features?

Each MR series type is acquired under unique scan parameters:

| Series Type     | Key Identifiable Features |
|----------------|----------------------------|
| **DWI**        | High `BValue`, short `EchoTime`, distinct `PulseSequenceName` |
| **SWI**        | Long `EchoTime`, high `FlipAngle` |
| **PWI (DSC)**  | Many temporal positions, short `RepetitionTime`, bolus indicators |
| **PWI (DCE)**  | Uses contrast, long acquisition, `ScanOptions` flags |
| **T1**         | Short `RepetitionTime`, moderate `FlipAngle` |
| **T1 Contrast**| Same as T1 with contrast indicators in metadata |
| **T2**         | Long `EchoTime`, `RepetitionTime` |
| **T2 FLAIR**   | Long `InversionTime` + T2 characteristics |

---

## 🧠 Model Architecture

### 🏃 Why Histogram-Based Gradient Boosting?

We use **HistGradientBoostingClassifier (HGBC)** because it:

- ⚡ Trains faster with histogram binning  
- 🧩 Handles **missing values natively**  
- 🧮 Works well with mixed numerical/categorical features  
- 🔍 Supports SHAP explainability and production pipelines  

### 🔠 Training Pipeline

```python
Pipeline([
  ("preprocessor", ColumnTransformer([
    ("num", SimpleImputer(), numeric_features),
    ("cat", Pipeline([
      ("imputer", SimpleImputer(fill_value="missing")),
      ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ]), categorical_features)
  ])),
  ("model", HistGradientBoostingClassifier(...))
])
