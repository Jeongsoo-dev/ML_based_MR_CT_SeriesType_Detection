# Machine Learning Based MR&CT Series Type Detection

---

## DATA

All Train and Test data is stored in Blackbox remote server. 

Train Data Size :

Test Data Size : 

### Train Features

- 12 specific DICOM headers for MR

| NumberTemporalPositions | PhaseEncodingDirection |
| --- | --- |
| RepetitionTime | FlipAngle |
| InversionTime | EchoTrainLength |
| MagneticFieldStrength | EchoSpacing |
| PulseSequenceName | SequenceVariant |
| Bvalue | ScanOptions |
- 10 specific DICOM headers (features) for CT

| ContrastBolusAgent | ContrastBolusVolume |
| --- | --- |
| ExposureTime | ScanOptions |
| ReconstructionDiameter | TableSpeed |
| KVP | Modality |
| SeriesTime | ConvolutionKernel |

### Target Series Types

- MR
    
    
    | PWI_DSC | T2 |
    | --- | --- |
    | PWI_DCE | T2_Flair |
    | SWI | T1 |
    | DWI | T1_Contrast |
- CT
    
    
    | CT_Angiography | CT_Perfusion | CT_Noncontrast |
    | --- | --- | --- |

---

## Algorithm Structure Overview

### Data Input

Path to Study-Case folder (blackbox server) including folders with different series types containing multiple 2D images.

ex) mr_stroke_aarhus/PWI/001_0001.dcm

### Train Data Preprocessing

extracted headers and features are saved in data_class

1. Header Extraction from DICOM and save it as string in format of list of lists
    1. 12 specific headers for MR
    2. 10 specific headers for CT
2. Feature Extraction from extracted Headers and save it as list of lists
3. Group extracted features in same study case folder, and save it as json file.

<Example Trian Data>

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
        },
```

### Model Training

Due to vendor specific DICOM standard and human inputted DICOM data, sometimes Series-Description header is missing or in different language. Therefore train two different model:

1. ML-model trained with Series-Description
2. ML-model trained without Series-Description

**Hist-Gradient Descent Boosting Model is chosen for this case.** 

[Gradient Boosting Classifier](https://www.notion.so/Gradient-Boosting-Classifier-1f734215618d8013aa0fc3c1a2a2142f?pvs=21)

[Hist Gradient Boosting Classifier](https://www.notion.so/Hist-Gradient-Boosting-Classifier-1f734215618d801e96dafaa8e46daa2f?pvs=21)

---

WHY HistGBC

---

### 1. **범주형 데이터 처리 최적화 (One-Hot + Histogram Binning)**

- 입력 특성 중 `"SeriesDescription"`, `"Manufacturer"`, `"ImageType"`, `"PhaseEncodingDirection"`, `"ScanOptions"` 등 **문자열 범주형 변수(categorical features)**가 많음.

**GBC의 문제점**

- `GradientBoostingClassifier`는 범주형 변수를 처리하기 위해 **OneHotEncoding**을 사용.
    - OneHotEncoding은 각 범주를 독립된 열로 분리 → **차원이 급격히 증가**
    - 대부분의 값이 0이 되는 **희소 행렬(sparse matrix)** 생성
- GBC는 Numpy 배열 기반의 dense 연산을 선호하므로, 희소 행렬에서는:
    - 모든 특성을 반복 스캔하며 분할 기준 탐색 → 속도 저하
    - 캐시 일관성 감소 및 메모리 낭비
    - 결과적으로 예측 성능이 저하됨
    
    *dense 연산 : Numpy는 모든 값을 **CPU 캐시에서 빠르게 읽어 계산하기에** 벡터 연산, 행렬 곱, 통계 연산 등을 매우 빠르게 처리
    

> 고차원 희소 행렬 → 비효율적인 분할 → 예측 성능 하락
> 

---

**HistGBC의 해결 방식**

- Scikit-learn의 HistGBC는 **히스토그램 기반 처리**를 적용하여 범주형 데이터도 효율적으로 처리 가능.

✔ 방법 1: OneHotEncoder + Dense 처리

- `OneHotEncoder(sparse_output=False)` 사용시, HistGBC는 **희소 행렬 대신 dense 배열**로 최적화 처리
- 이후 히스토그램 기반 연산으로 효율적으로 계산

✔ 방법 2: Native 범주형 처리

- 내부적으로 **OrdinalEncoder 방식**으로 문자열을 정수로 인코딩
- 인코딩된 값을 범주형(category-type)으로 인식하여 **범주 조합(split)** 탐색 최적화

> i) OneHot 없이도 정확도 유지 + 계산 부하 감소
> 
> 
> ii) 범주형 변수를 **고차원 희소벡터 없이** 효과적으로 분할 가능
> 

---

### 2. **수치형 변수에 히스토그램 기반 Binning 적용**

- 주요 수치형 변수들:
    - `EchoTime`, `SliceThickness`, `PixelSpacing1`, `RepetitionTime`, `FlipAngle`, `InversionTime`, `EchoTrainLength`, `MagneticFieldStrength`, `EchoSpacing`

GBC:

- 실수값을 정밀하게 split 하려다 **노이즈에 민감**
- 분할 후보 수가 많아 계산량 증가

HistGBC:

- 수치형 데이터를 **256개 등 bin으로 구간화**
- bin 단위에서만 분할 후보 탐색 → **속도 향상 + 안정적 학습**

> Binning = 빠른 계산 + 노이즈에 덜 민감
> 

---

### 3. **결측값(NaN)에 강함**

- 예: `"Bvalue"` 등의 특성은 결측값 포함 가능

**GBC**:

- NaN 처리에 취약 → `SimpleImputer` 등 전처리에 의존

**HistGBC**:

- NaN을 자동 감지하여 **별도로 처리하거나 분할 시 제외**
- 전처리 없이도 **결측값 대응 가능**

> DICOM header에 결측치 존재 시에도 안정적 학습 가능
> 

---

### 4. **고차원 희소 벡터 문제 회피**

- OneHot 처리된 범주형 변수가 많아질 경우, 일반 GBC는 **희소 벡터** 처리에 비효율적
- HistGBC는 `OneHotEncoder(sparse_output=False)` 설정 시 **dense 배열로 변환 후 히스토그램 처리** → **계산 최적화**

---

### 5. **Scikit-learn 내부 최적화 + 조기 종료 지원**

- HistGBC는 `early_stopping='auto'`, `validation_fraction=0.1` 설정으로:
    - 검증 성능이 향상되지 않으면 **조기 종료**
    - **과적합 방지 및 일반화 성능 향상**

> 일반 GBC는 명시적 validation set 없이는 조기 종료 미지원 → 과적합 우려
> 

---

### 6. **정교하고 다양한 하이퍼파라미터 제어 가능**

- HistGBC는 `l2_regularization`, `max_leaf_nodes`, `validation_fraction` 등 **고급 튜닝 요소 지원**
- 일반 GBC는 상대적으로 단순한 하이퍼파라미터만 제공

> 복잡하고 고차원적인 문제에서 더 섬세한 모델 제어 가능
> 

---

### SUMMARY

| 이유 | HistGBC 성능 향상 요인 |
| --- | --- |
| ✅ 범주형 변수 처리 | OneHot 처리 + 히스토그램 분할의 최적 조합 |
| ✅ 수치형 데이터 | binning을 통한 노이즈 억제와 안정성 |
| ✅ 결측값 처리 | 자동 결측값 대응 |
| ✅ 조기 종료 지원 | 과적합 방지 |
| ✅ 계산 최적화 | 고차원 희소 벡터 회피, 빠른 학습 |

[backup](https://www.notion.so/backup-1f934215618d80b2bc85f4550108e639?pvs=21)

---

### HistGBC 튜닝 (하이퍼파라미터 설정)

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| `n_estimators` (→ `max_iter`) | 100 | 학습할 트리 개수. 기본값이자 안정적인 선택 |
| `learning_rate` | 0.1 | 일반적인 시작값. 작은 값으로 하면 더 많은 트리가 필요하지만 과적합 방지에 좋음 |
| `max_depth` | `None` | 제한 없음. 대신 `max_leaf_nodes`로 구조 제한 |
| `max_leaf_nodes` | 31 | 각 트리의 리프 노드 수 제한 → 모델 복잡도 제어 |
| `l2_regularization` | 0.0 | 정규화 미적용 (기본값). 과적합 가능성 고려해 추후 튜닝 추천 |
| `early_stopping` | `'auto'` | 자동 조기 종료 설정 (성능 향상 없을 때 트리 추가 중단) |
| `validation_fraction` | 0.1 | 10% 데이터를 검증용으로 사용 (조기 종료용) |
| `random_state` | 42 | 결과 재현성 확보용 고정 시드 설정 |

전반적으로 **기본값을 사용하되, 과적합을 방지할 수 있는 설정 (`max_leaf_nodes`, `early_stopping`)을 적용**

---

### 전처리 및 파이프라인 구성

- `ColumnTransformer`로 수치형, 범주형을 분리 처리
- **수치형 특성**:
    - `SimpleImputer(strategy='constant', fill_value=np.nan)` → 결측값 채움
    - 결측값(NaN)이 있는 경우, `fill_value=np.nan`로 지정된 값으로 대체
        - **범용성 확보**: 나중에 GBC나 다른 모델로 교체할 경우를 대비한 사전 처리
        - **데이터 변형 통일성 유지**: 결측치가 있을 때 다양한 모델에도 공통 적용 가능한 전처리
- **범주형 특성**:
    - `SimpleImputer(strategy='constant', fill_value='missing')` +
        
        `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`
        
        - 각 범주(category)를 별도의 열(column)로 변환
        - `handle_unknown='ignore'`: 테스트셋에 없는 새로운 범주가 들어와도 **오류 없이 무시**
        - `sparse_output=False`: 희소 행렬이 아닌 dense 배열로 변환해 HistGBC와 호환성 확보

> 범주형/수치형 데이터 전처리를 분리하고, OneHot + dense 처리까지 최적화
> 

```python
numerical_cols = features.select_dtypes(include=['number']).columns.tolist()
categorical_cols = features.select_dtypes(include=['object']).columns.tolist()

# 수치형 전처리
numerical_transformer = SimpleImputer(strategy='constant', fill_value=np.nan)

# 범주형 전처리
categorical_transformer = Pipeline(
    steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ]
)

# 열(Column)별 전처리 통합
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', categorical_transformer, categorical_cols)
    ]
)

# 전체 파이프라인: 전처리 + 모델
self.pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', model)
])
```

---

### 모델 학습 (`fit`) 구조

```python
def fit(self, features: pd.DataFrame, targets: pd.Series) -> None:
    if self.pipeline is None:
        self._create_pipeline(features)
    self.pipeline.fit(features, targets)
    self.class_labels = ...
    self.explainer = shap.TreeExplainer(...)
```

- `fit()` 함수 내에서 파이프라인이 없으면 자동으로 생성
- 학습 완료 후:
    - 클래스 정보 저장
    - `SHAP TreeExplainer` 준비 → 설명 가능성 확보

> 학습과 동시에 모델 해석을 위한 SHAP 기반 준비까지 포함
> 

---

## 평가 및 테스트 관련 구성

- `predict_proba()`와 `predict()` 함수가 명확하게 정의되어 있어:
    - 확률 기반 분류
    - 다중 클래스 대응
- 예외 처리 (`if self.pipeline is None`)도 잘 되어 있어 **사용 시 오류 방지**

---

### Future Update

- Hyper-Parameter Tuning
    - `l2_regularization=0.1` 정도로 실험 → 과적합 방지 가능성
    - `max_depth` 제한도 추가 설정 → 학습 시간 단축 및 일반화 향상
    - **SHAP 시각화 강화 :** `shap.waterfall_plot()`으로 개별 예측 설명 `shap.dependence_plot()`으로 특성 간 상호작용 시각화
