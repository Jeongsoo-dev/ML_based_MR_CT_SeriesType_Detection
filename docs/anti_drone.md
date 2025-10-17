---
title: "Anti-Drone Project"
hide:
  - title
---

<div class="hero">
  <img src="../images/army.jpg" alt="Jeongsoo Pang" class="headshot-hero">

  <div class="hero-text">
    <h1>Anti-Drone Project — FMCW Radar & Electro-Optical Fusion</h1>
    <strong class="bio-name">Jeongsoo Pang</strong><br>
    AI Capacity Competition by Korean National Defense<br>
    FMCW Radar Signal & Image Intelligence<br>
    2023.11
  </div>
</div>

<div class="clear"></div>

---

## Abstract
The **Anti-Drone Project** focused on developing a reliable, low-latency **machine learning pipeline** to detect and classify UAVs using **FMCW radar spectrograms** and **RCS imagery**.  
The system integrates classical machine learning (SVM, Random Forest, Gradient Boosting) and deep convolutional architectures (AlexNet, ResNet, GoogLeNet, NasNet, SqueezeNet) to achieve optimal trade-offs between **accuracy**, **robustness**, and **real-time inference** on edge devices.

---

## Project Objective
- Build an **end-to-end ML framework** for **drone detection and classification** from Doppler and RCS data.
- Benchmark traditional classifiers versus deep CNN backbones for **FMCW spectrograms**.
- Evaluate **robustness under noise**, **latency**, and **hardware constraints** for embedded radar platforms.
- Provide a **research-grade reproducible implementation** with clear documentation and modularity.

---

## Dataset & Preprocessing
| Dataset | Description | Modality |
|----------|--------------|-----------|
| **Goorm-AI-04 Drone Doppler** | FMCW radar Doppler spectrograms labeled by drone type | FMCW Spectrogram |
| **Goorm-AI-04 RCS Image** | Radar cross-section images of drone surfaces | RCS Imagery |
| **Real Doppler RAD-DAR** ([Kaggle](https://www.kaggle.com/datasets/iroldan/real-doppler-raddar-database)) | Real Doppler datasets recorded by the **RAD-DAR** radar system, a widely used platform internationally | FMCW Doppler |
| **Drone Remote Controller RF Signal** ([IEEE Dataport](https://ieee-dataport.org/open-access/drone-remote-controller-rf-signal-dataset)) | RF baseband captures from drone remote controllers for auxiliary signal analysis | RF / I/Q |

- **Flattening & Normalization:** Converted radar tensors to 224 × 224 gray-scale arrays, normalized with ImageNet statistics for transfer learning compatibility.  
- **Noise Augmentation:** Simulated Gaussian noise at σ² ∈ {1e-4 … 1e-2} to evaluate noise tolerance of SVC, HGBC, and RF models.  
- **Stratified Splits:** Ensured balanced representation across drone types with 10% validation sets.  
- **Dynamic Range Calibration:** Capped and floor-normalized pixel intensities to mitigate power spikes and saturation artifacts.

---

## Model Architectures
### Classical ML Models
| Model | Core Idea | Strength |
|------|-----------|----------|
| **LinearSVC / SVC** | Multi-class margin-maximization on flattened radar frames | Fast, interpretable |
| **Random Forest Classifier** | Ensemble of decision trees with bagging | Noise-robust |
| **HistGradientBoosting Classifier** | Histogram-based boosting with native categorical support | High accuracy / structured data |
| **SGDClassifier** | Online linear optimization baseline | Lightweight reference |

### Deep CNN Backbones
| Model | Parameter (M) | Notes |
|------|----------------|------|
| **AlexNet** | 61.0 | Classic CNN baseline for radar texture learning |
| **GoogLeNet** | 6.8 | Inception-based multi-scale spatial features |
| **ResNet-34 / ResNet-101** | 21.3 / 44.5 | Residual skip-connections for stable training |
| **SqueezeNet** | 1.2 | Lightweight model ideal for embedded inference |
| **NasNet** | 5.3 | Neural architecture search optimized backbone |
| **MobileNetV2** | 3.5 | Depthwise separable convs; strong accuracy/FLOPs ratio |

All deep networks were fine-tuned from **PyTorch ImageNet weights**, with a custom **three-class output layer** corresponding to drone categories (quadrotor, fixed-wing, multi-rotor).

---

## Training Strategy
- **Framework:** PyTorch + (optional) Hugging Face + W&B logging.  
- **Batch Size:** 128 (train) / 20 (eval).  
- **Epochs:** 8–12 with early stopping and cosine LR scheduler.  
- **Optimizer:** AdamW (lr ∈ {1e-4, 5e-4, 1e-3, 1e-2}, weight decay = 1e-3).  
- **Mixed Precision (FP16):** Enabled where supported for throughput.  
- **Metric Callback:** Custom `compute_metrics()` tracking accuracy, F1, precision, recall, and AUC.  
- **Hyperparameter Search:** Grid over learning rates and batch sizes + W&B sweeps for convergence profiling.

---

## Evaluation Methodology
- **Cross-Validation:** 10% validation per seed ∈ {21, 42, 77}.  
- **Noise Perturbation Tests:** Measured model accuracy across σ² ∈ {1e-4 … 1e-2} noise levels.  
- **Inference Profiling:** Averaged 100 runs to estimate per-image latency (`perf_counter()` loop).  
- **Metrics:** Micro-averaged F1, precision/recall, and timing std (μ ± σ).

---

## Results Summary
| Model | Accuracy (%) | F1 | Avg Inference (s) | Params (M) |
|------|---------------|----|-------------------|------------|
| Linear SVC | 92.4 | 0.92 | 0.004 | – |
| Hist GB Classifier | 95.1 | 0.95 | 0.007 | – |
| Random Forest | 94.8 | 0.94 | 0.009 | – |
| **SqueezeNet** | **97.3** | **0.97** | **0.012** | 1.2 |
| ResNet-34 | 96.5 | 0.96 | 0.017 | 21.3 |
| GoogLeNet | 96.9 | 0.96 | 0.015 | 6.8 |

> **SqueezeNet** achieved the best **accuracy-efficiency balance**, making it the **production-ready model** for real-time radar deployment.

---

## Additional Experiment — Noise on Image Datasets
To stress-test robustness, we performed **accuracy experiments on noise-added image datasets** (Gaussian noise with σ² ∈ {1e-4 … 1e-2}).  
We evaluated both CNNs and classical models:

- **CNNs:** ResNet-101, GoogLeNet, **MobileNetV2**  
- **Classical:** SVC, Linear SVC, Gradient Boosted Decision Trees (HistGBDT), Random Forest

The plot below summarizes accuracy by model across noise levels:

![Noise-robustness on image datasets]({{ base_url }}/images/additional_noise.png)

Key takeaways:
- **MobileNetV2** and **GoogLeNet** maintained high accuracy up to moderate noise due to depthwise separable/inception multi-scale features.  
- **ResNet-101** remained the most stable at higher noise regimes, likely due to deeper residual capacity and batch-norm smoothing.  
- Among classical models, **HistGBDT** outperformed **RF** and **SVC** under heavier noise, aligning with its histogram-binning robustness.

---

## Technical Highlights
- **Hybrid Experimentation Framework:** Unified classical + deep models within a single harness for direct benchmarking.  
- **Custom Collate Fn:** Converted raw radar tensors into 3-channel images via NumPy + PIL augmentation before Torch batching.  
- **W&B Integration:** Auto-logged metrics, confusion matrices, parameter sweeps, and artifacts with reproducible seeds.  
- **Cross-Domain Validation:** Consistent >96% accuracy on unseen test and noise-augmented datasets.  
- **Explainability:** Interpreted radar spectrogram activations using Grad-CAM to validate model attention on micro-Doppler regions.

---

## Deployment Considerations
- **Edge Inference Optimization:** Quantized **SqueezeNet** to FP16, achieving >80 FPS on Jetson Nano.  
- **Model Serialization:** Exported via TorchScript for embedded radar pipeline.  
- **Noise-Aware Retraining:** Integrated Gaussian perturbation generator for continual retraining in field conditions.

---

## Future Work
- Real-time fusion with EO/IR imagery via feature-level concatenation.  
- Temporal smoothing (LSTM / Transformer) for tracking moving drones.  
- Radar signature augmentation using simulated micro-Doppler patterns.

---

## Repository Structure

**Link to Repository:** <https://github.com/jpangece/Anti_Drone_System>

| File | Description |
|------|-------------|
| `AlexNet.py`, `GoogLeNet.py`, `ResNet34.py`, `ResNet101.py`, `SqueezeNet.py`, `NasNet.py` | Deep CNN backbones (TorchVision compatible) |
| `RandomForest.py`, `SVM_SB_RFC.py` | Classical ML baselines (SVM, RF, HistGBDT) |
| `README.md` | Documentation and experimental setup |
| `wandb/` | Training logs, sweeps, and performance dashboards |

---

## Acknowledgment
This work was part of a **collaborative defense-AI initiative**, integrating FMCW radar and EO sensor data for UAV detection.  
All experiments were executed using **PyTorch 2.0** and **W&B**, with full experiment reproducibility ensured via deterministic seeds and dataset versioning.
