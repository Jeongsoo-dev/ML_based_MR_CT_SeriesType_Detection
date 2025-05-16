# Advanced ML Pipeline for MR/CT Series Type Detection Using DICOM Headers
Author : Jeongsoo Pang

## Abstract

Modern radiology workflows involve parsing different DICOM series from MR and CT modalities for further image processing or operation. Determining the exact **series type** (e.g., PWI, DWI, SWI, T2 FLAIR, CT Angiography) is essential for accurate processing, post-analysis, and visualization. However, due to vendor specific DICOM formatting, DICOM This post introduces a robust, production-ready ML pipeline that automatically classifies series type based solely on metadata extracted from DICOM headers.

---
### Goal
- Access and extract vendor specific private values located under nested structure from DICOM-meta-data
    Vendors : GM, Siemens, Philips
- Build ML model that **Training Data and Features are able to be Expanded in the future** 
- Achieve >90% classification accuracy
- Considering cases where some important headers (Series-Description, b-value, etc...) does not exist

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
```
## 🔁 Series Type Prediction Logic

When a new folder is passed to the system for prediction, the logic flows as follows:

### 📥 Step 1: Input
- Accept a **single folder path** containing DICOM images of a 3D series.

### 🩻 Step 2: Modality Check
- Automatically determines whether the input belongs to **MR** or **CT** by checking DICOM tags (e.g., `Modality` field).
  
### 🧬 Step 3: Feature Extraction
- Depending on modality:
  - For MR: run `MRFeatureExtractor`
  - For CT: run `CTFeatureExtractor`
- Extract only **header-based metadata**, no pixel data needed.

### ⚙️ Step 4: Choose Model Variant
- The system takes a boolean argument (e.g., `use_series_description`)
- Based on this, it selects one of the 4 trained models:

| Modality | With SD | Without SD |
|----------|---------|------------|
| **MR**   | ✅ `MR-Model-SD.pkl` | ✅ `MR-Model-noSD.pkl` |
| **CT**   | ✅ `CT-Model-SD.pkl` | ✅ `CT-Model-noSD.pkl` |

This ensures compatibility with real-world data where `SeriesDescription` may or may not be present.

### 🔮 Step 5: Prediction
- Selected model runs `predict()` and `predict_proba()` on the extracted feature vector.
- Returns:
```json
{
  "modality": "mr",
  "prediction": "t1_contrast",
  "score": {
    "t1_contrast": 0.87,
    "t2": 0.06,
    "t1": 0.04
  },
  "patient_id": "XYZ",
  "study_id": "...",
  "series_id": "..."
}
```
![Series Type Detection Flowchart](../images/series_prediction_flow.png)
