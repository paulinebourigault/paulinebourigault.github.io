---
layout: about
title: about
permalink: /
news: false
all_publications: false
social: true
announcements:
  enabled: false
  scrollable: false
  limit: 3
---

<div class="bio-box">
  <p class="bio-intro">I am a PhD candidate at <strong>Imperial College London</strong>. My research has recently focused on reinforcement learning, LLM post-training, and verified reasoning.</p>
  <p>Earlier, I worked on quaternion optimisation for 4D signal processing and on multimodal learning for computer vision, including vision-language models and 3D reconstruction.</p>
</div>

## Verified reasoning

**[LeanPolish: Verified Supervision for Lean Proof Compression](https://arxiv.org/abs/2609.38384)** — *Preprint, 2026*  
[Paper](https://arxiv.org/abs/2609.38384) · [Code](https://github.com/paulinebourigault/leanpolish) · [Dataset](https://huggingface.co/datasets/leanpolish-anon/lean-proof-compression)  
Training on verified Lean 4 proof edits can look strong because of search shortcuts; complete-candidate evaluations separate real gains from these artifacts. We release 33k verified proof edits and 66k failed attempts.

**[CovCal: Risk-Controlled Lean-as-Judge](https://arxiv.org/abs/2605.28365)** — *ICML AI for Math Workshop, 2026*  
[Paper](https://arxiv.org/abs/2605.28365) · [Code](https://github.com/paulinebourigault/covcal-lean)  
A correct Lean proof can still misrepresent the original question. CovCal calibrates partial formal evidence to accept or abstain on answers, and shows when autoformalization coverage makes this feasible.

**[Kimina-Prover Preview](https://arxiv.org/abs/2504.11354)** — *Collaborative project, Project Numina / Moonshot AI*  
[Technical report](https://arxiv.org/abs/2504.11354) · [Code](https://github.com/MoonshotAI/Kimina-Prover-Preview)  
I contributed to training, inference and proof-search workflows, including the 8B training configuration later adopted for the 72B model.

## Reinforcement learning and tail-risk evaluation

**[Tail-Influence Sampling for CVaR Policy Evaluation](https://arxiv.org/abs/2609.38096)** — *Preprint, 2026*  
[Paper](https://arxiv.org/abs/2609.38096) · [Code](https://github.com/paulinebourigault/TIS)  
Influence-based allocation of a fixed query budget for CVaR evaluation, with oracle asymptotic efficiency, evaluated on CliffWalking and frozen LLM review workflows.

**[Coverage Cliffs in Off-Policy Quantile Certification](https://arxiv.org/abs/2610.22565)** — *Preprint, 2026; earlier version at ICML Workshop on RL from World Feedback*  
[Paper](https://arxiv.org/abs/2610.22565) · [Code](https://github.com/paulinebourigault/coverage-cliffs)  
TailCert certifies tail quantiles of policies selected from logged bandit data, and shows that discarding action identities in weighted CDF summaries creates a **coverage cliff** that keeping action counts removes.

## AI agent verification

**[VoiceAgentGuard: Contract-Gated Tool Release for Production Voice Agents](https://aclanthology.org/2026.emnlp-industry.195/)** — *EMNLP 2026 Industry Track*  
[Paper](https://aclanthology.org/2026.emnlp-industry.195/) · [Code](https://github.com/paulinebourigault/voiceagentguard)  
Every tool call a voice agent proposes must pass an auditable contract gate before it runs, blocking unsafe private reads and state changes.

**[vcore: Verified Authority Envelopes for AI Agents](/blog/2026/what-the-agent-may-do/)** — *Research note, 2026*  
[Write-up](/blog/2026/what-the-agent-may-do/) · [Code](https://github.com/certior/vcore) · [Benchmark](https://huggingface.co/datasets/paulibo/vcore-actions-benchmark) · [Corpus](https://huggingface.co/datasets/paulibo/vcore-workflow-envelopes)  
vcore computes what a GitHub-workflow coding agent's configuration lets it do, and checks this for exfiltration and untrusted-write paths with a procedure proved correct in Lean 4.

## Earlier work

**Signal processing and time series**

- **[Kernel-Based Anomaly Detection Using Generalized Hyperbolic Processes](https://arxiv.org/abs/2501.15265)**  
  **Pauline Bourigault**, Danilo P. Mandic · *ICASSP 2025* · [Code](https://github.com/paulinebourigault/GHKernelAnomalyDetect)
- **[Information-Geometric Neural Granger Causality](https://openreview.net/pdf?id=Ii0MqqztQZ)**  
  **Pauline Bourigault**, Danilo P. Mandic · *ICML Workshop on High-dimensional Learning Dynamics, 2025*
- **[Quaternion Recurrent Neural Network with Real-Time Learning and Maximum Correntropy](https://arxiv.org/abs/2402.14227)**  
  **Pauline Bourigault**, Dongpo Xu, Danilo P. Mandic · *IJCNN 2024, oral*
- **[Convex Quaternion Optimization for Signal Processing: Theory and Applications](https://doi.org/10.1109/TSP.2023.3328053)**  
  Shuning Sun, Qiankun Diao, Dongpo Xu, **Pauline Bourigault**, Danilo P. Mandic · *IEEE Transactions on Signal Processing, 2023* · [arXiv](https://arxiv.org/abs/2305.06879)
- **[The HR-Calculus: Enabling Information Processing with Quaternion Algebra](https://arxiv.org/abs/2311.16771)**  
  Danilo P. Mandic, Soroush Pourya Talebi, Clive Cheong Took, Yili Xia, Dongpo Xu, Min Xiang, **Pauline Bourigault** · *Preprint, 2023*

**Computer vision and multimodal learning**

- **[FrEVL: Leveraging Frozen Pretrained Embeddings for Efficient Vision-Language Understanding](https://arxiv.org/abs/2508.04469)**  
  Emmanuelle Bourigault, **Pauline Bourigault** · *ICCV Workshop on Safe and Trustworthy Multimodal AI Systems, 2025, oral* · [Code](https://github.com/EmmanuelleB985/FrEVL)
- **[Multi-Modal Information Bottleneck Attribution with Cross-Attention Guidance](https://bmva-archive.org.uk/bmvc/2024/papers/Paper_64/paper.pdf)**  
  **Pauline Bourigault**, Emmanuelle Bourigault, Danilo P. Mandic · *BMVC 2024*
- **[MVDiff: Scalable and Flexible Multi-view Diffusion for 3D Object Reconstruction](https://openaccess.thecvf.com/content/CVPR2024W/GCV/html/Bourigault_MVDiff_Scalable_and_Flexible_Multi-view_Diffusion_for_3D_Object_Reconstruction_CVPRW_2024_paper.html)**  
  Emmanuelle Bourigault, **Pauline Bourigault** · *CVPR Workshop on Generative Models for Computer Vision, 2024* · [Code](https://github.com/EmmanuelleB985/MVDiff)

**Medical imaging**

- **[Timing of Hypoxia PET/CT Imaging after 18F-Fluoromisonidazole Injection in NSCLC Patients](https://www.nature.com/articles/s41598-022-26199-7)**  
  **Pauline Bourigault**, Michael Skwarski, Ruth E. Macpherson, Geoff S. Higgins, Daniel McGowan · *Scientific Reports, 2022*
- **[Investigation of Atovaquone-Induced Spatial Changes in Tumour Hypoxia](https://link.springer.com/article/10.1186/s13550-021-00871-x)**  
  **Pauline Bourigault**, Michael Skwarski, Ruth E. Macpherson, Geoff S. Higgins, Daniel McGowan · *EJNMMI Research, 2021*
