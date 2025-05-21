# Machine Learning Based MR\&CT Series Type Detection
Author : Jeongsoo Pang

## Abstract

Modern radiology workflows involve parsing different DICOM series from MR and CT modalities for further image processing or operation. Determining the exact **series type** (e.g., PWI, DWI, SWI, T2 FLAIR, CT Angiography) is essential for accurate processing, post-analysis, and visualization. However, due to vendor specific DICOM formatting, DICOM This post introduces a robust, production-ready ML pipeline that automatically classifies series type based solely on metadata extracted from DICOM headers.

## DATA

All Train and Test data is stored in Blackbox remote server.
Preprocessing of Train/Test Data was required to only use unique data for training and testing. 

### MR
          **MR Train Data Size**: 171 Unique Data
          **MR Test Data Size**: 185 Unique Data
### CT
          **CT Train Data Size**: 271 Unique Data

          **CT Test Data Size**: 407 Unique Data
          
### Train/Test Features

**12 MR Train/Test Features from DICOM header**

| NumberTemporalPositions | PhaseEncodingDirection |
| ----------------------- | ---------------------- |
| RepetitionTime          | FlipAngle              |
| InversionTime           | EchoTrainLength        |
| MagneticFieldStrength   | EchoSpacing            |
| PulseSequenceName       | SequenceVariant        |
| Bvalue                  | ScanOptions            |

**10 CT Train/Test Features from DICOM header**

| ContrastBolusAgent     | ContrastBolusVolume |
| ---------------------- | ------------------- |
| ExposureTime           | ScanOptions         |
| ReconstructionDiameter | TableSpeed          |
| KVP                    | Modality            |
| SeriesTime             | ConvolutionKernel   |

### Target Series Types

**MR**

| PWI\_DSC | T2           |
| PWI\_DCE | T2\_Flair    |
| SWI      | T1           |
| DWI      | T1\_Contrast |

**CT**

| CT\_Angiography | CT\_Perfusion | CT\_Noncontrast |

---

## Algorithm Structure Overview

### Data Input

Path to Study-Case folder (on blackbox server) including folders with different series types containing multiple 2D images.

Example:

```
mr_stroke_aarhus/PWI/001_0001.dcm
```

### Train Data Preprocessing

Extracted headers and features are saved in `data_class`.

1. Header extraction from DICOM and saved as list of lists:

   * 12 headers for MR
   * 10 headers for CT
2. Feature extraction from headers → list of lists
3. Grouped by study case folder → saved as JSON

**Example Train Data**:

```json
{
  "SeriesDescription": "t2flair",
  "EchoTime": 18.0,
  "SliceThickness": 4.0,
  "Manufacturer": "Philips Medical Systems",
  "ImageType": "['ORIGINAL', 'PRIMARY', 'M_IR', 'M', 'IR']",
  "PixelSpacing1": 0.4492,
  "PixelSpacing2": 0.4492,
  "Path": "mr_onco/0031/20110420T0936/T2FLAIR/MG00022.dcm",
  "Target": "t2flair",
  "NumberTemporalPositions": 20.0,
  "PhaseEncodingDirection": "ROW",
  "RepetitionTime": 11000.0,
  "FlipAngle": 90.0,
  "InversionTime": 2800.0,
  "EchoTrainLength": 31.0,
  "MagneticFieldStrength": 3.0,
  "EchoSpacing": 5.0,
  "PulseSequenceName": "4.0",
  "SequenceVariant": "SK",
  "Bvalue": null,
  "ScanOptions": "FS"
}
```

### Model Training

Due to vendor differences and human labeling, `SeriesDescription` can be:

* Missing
* Unreliable
* Multilingual

So we train **two models**:

1. With SeriesDescription
2. Without SeriesDescription

> Model: `HistGradientBoostingClassifier`

For technical reasons behind this choice, see:

* [Gradient Boosting Classifier (GBC)](https://www.notion.so/Gradient-Boosting-Classifier-1f734215618d8013aa0fc3c1a2a2142f?pvs=21)
* [Histogram GBC](https://www.notion.so/Hist-Gradient-Boosting-Classifier-1f734215618d801e96dafaa8e46daa2f?pvs=21)

---

## WHY HistGBC

### 1. Optimal Handling of Categorical Data

* Many important features are strings (e.g., `SeriesDescription`, `Manufacturer`, `ImageType`, etc.)
* GBC with OneHotEncoding → sparse matrix → inefficiency
* HistGBC avoids this:

  * Uses OneHot + dense (`sparse_output=False`) OR
  * Uses native ordinal encoding internally

### 2. Histogram Binning for Numerical Features

* Reduces noise sensitivity
* Improves speed and robustness

### 3. Handles Missing Values (e.g., `Bvalue`) Natively

* GBC: requires imputation
* HistGBC: detects and excludes or handles automatically

### 4. Avoids Sparse Vector Problems

* Dense matrix → better cache performance
* Faster split-finding

### 5. Early Stopping and Overfitting Protection

* Supports `early_stopping='auto'` and `validation_fraction=0.1`
* Built-in overfitting control

### 6. More Hyperparameter Flexibility

* `l2_regularization`, `max_leaf_nodes`, `validation_fraction`, etc.
* Better for fine-tuned control

### ✅ Summary Table

| Reason                  | Boosted Performance in HistGBC              |
| ----------------------- | ------------------------------------------- |
| Categorical Handling    | OneHot + histogram split or native encoding |
| Numeric Stability       | Histogram binning reduces overfitting       |
| Missing Values          | Natively supported                          |
| Early Stopping          | Yes (GBC: No)                               |
| Sparse Vector Avoidance | Yes                                         |
| Advanced Hyperparams    | Supported                                   |

---

## Hyperparameter Settings (Tuned)

| Parameter                   | Value    | Description                             |
| --------------------------- | -------- | --------------------------------------- |
| `n_estimators` / `max_iter` | 100      | Standard start point                    |
| `learning_rate`             | 0.1      | General good default                    |
| `max_leaf_nodes`            | 31       | Limits tree complexity                  |
| `early_stopping`            | `'auto'` | Enables validation-based early stopping |
| `validation_fraction`       | 0.1      | 10% used for validation                 |
| `l2_regularization`         | 0.0      | No regularization by default            |
| `random_state`              | 42       | For reproducibility                     |

---

## Preprocessing and Pipeline Structure

```python
numerical_cols = features.select_dtypes(include=['number']).columns.tolist()
categorical_cols = features.select_dtypes(include=['object']).columns.tolist()

numerical_transformer = SimpleImputer(strategy='constant', fill_value=np.nan)
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer([
    ('num', numerical_transformer, numerical_cols),
    ('cat', categorical_transformer, categorical_cols)
])

self.pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', model)
])
```

---

## Fit Function Structure

```python
def fit(self, features: pd.DataFrame, targets: pd.Series) -> None:
    if self.pipeline is None:
        self._create_pipeline(features)
    self.pipeline.fit(features, targets)
    self.class_labels = ...
    self.explainer = shap.TreeExplainer(...)
```

* Automatically builds pipeline
* After training:

  * Saves label classes
  * Sets up SHAP explainer

---

## Model Evaluation & API Readiness

* Well-defined `predict_proba()` and `predict()`
* Handles multi-class probabilities
* Checks for pipeline presence → avoids runtime error

---

## Future Updates

* Try `l2_regularization = 0.1`
* Add `max_depth` tuning for better generalization
* Extend SHAP visualizations:
  * `shap.waterfall_plot()`
  * `shap.dependence_plot()`
## DATA 
**MR Train Data Size**: 171 Unique Data
**MR Test Data Size**: 185 Unique Data

| Dataset_Name | Train_Data_Count | Test_Data_Count |
| ------------ | -----------------| ----------------|
| t1           | 39               | 84              |
| t1_contrast  | 30               | 38              |
| t2flair      | 25               | 21              |
| dwi          | 21               | 6               |
| pwi_dsc      | 7                | 21              |
| t2           | 5                | 3               |
| swi          | 5                | 10              |

**CT Train Data Size**: 271 Unique Data
**CT Test Data Size**: 407 Unique Data

| Dataset_Name    | Train_Data_Count | Test_Data_Count |
| --------------- | ---------------- |---------------- |
| ct_noncontrast  | 178              | 231             |
| ct_perfusion    | 65               | 133             |
| ct_angiography  | 28               | 43              |
