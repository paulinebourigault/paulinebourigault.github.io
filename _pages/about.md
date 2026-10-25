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
  <p>In particular, I ask how AI systems can learn from feedback <em>reliably</em>: when proof-improvement training learns genuine gains rather than search shortcuts, how to allocate limited evaluation queries to measure tail risk, and what logged experience can certify about a policy.</p>
  <p>Earlier, I worked on quaternion optimisation for 4D signal processing and on multimodal learning for computer vision, including vision-language models and 3D reconstruction.</p>
</div>

## Verified reasoning

**[LeanPolish: Verified Supervision for Lean Proof Compression](https://arxiv.org/abs/2609.38384)** — *Preprint, 2026*  
[Paper](https://arxiv.org/abs/2609.38384) · [Code](https://github.com/paulinebourigault/leanpolish) · [Dataset](https://huggingface.co/datasets/leanpolish-anon/lean-proof-compression)

**When does learning from verified edits really improve on symbolic search?** I built a Lean 4 proof-optimisation pipeline and found that first-success search can create a perfect but misleading ranking shortcut. I introduced complete-candidate evaluations and controlled baselines to distinguish learned gains from search artifacts: a trained ranker achieves **70.1% top-1** versus **36.9%** for the strongest frozen baseline. Whole-proof fine-tuning improves verified token reduction from **2.8% to 5.5%** on 19 PutnamBench proofs, while iterated symbolic search remains stronger than the tested neural hybrids on miniF2F. The released data include 33,402 accepted proof edits and 65,596 same-state failed attempts.

**[CovCal: Risk-Controlled Lean-as-Judge](https://arxiv.org/abs/2605.28365)** — *ICML AI for Math Workshop, 2026*  
[Paper](https://arxiv.org/abs/2605.28365) · [Code](https://github.com/paulinebourigault/covcal-lean)

Even a correct Lean proof may not faithfully represent a natural-language question. CovCal calibrates partial formal evidence for selective answer acceptance or abstention, and measures when autoformalization coverage makes that approach feasible.

**[Kimina-Prover Preview](https://arxiv.org/abs/2504.11354)** — *Collaborative project, Project Numina / Moonshot AI*  
[Technical report](https://arxiv.org/abs/2504.11354) · [Code](https://github.com/MoonshotAI/Kimina-Prover-Preview)

I contributed to model-training, inference, and automated proof-search workflows, including work on the 8B training configuration that was subsequently adopted for the 72B model.

## Reinforcement learning and tail-risk evaluation

**[Tail-Influence Sampling for CVaR Policy Evaluation](https://arxiv.org/abs/2609.38096)** — *Preprint, 2026*  
[Paper](https://arxiv.org/abs/2609.38096) · [Code](https://github.com/paulinebourigault/TIS)

**How should we spend a limited evaluation budget to measure rare failures?** I worked on deriving tail-influence-based query allocation with oracle asymptotic efficiency for CVaR estimation. On CliffWalking, the method reduces mean-squared error by **41%** versus learned occupancy and **76%** versus full rollouts at the same transition budget. We also evaluate the approach on frozen LLM review workflows.

**[Coverage Cliffs in Off-Policy Quantile Certification](https://arxiv.org/abs/2610.22565)** — *Preprint, 2026; earlier version at ICML Workshop on RL from World Feedback*  
[Paper](https://arxiv.org/abs/2610.22565) · [Code](https://github.com/paulinebourigault/coverage-cliffs)

**When can logged data reliably certify a policy's tail risk?** TailCert provides high-confidence upper bounds on tail quantiles for policies selected from logged contextual-bandit data. The paper establishes matching finite-class sample-complexity bounds and shows how discarding action identities in weighted CDF summaries can create a **coverage cliff**; retaining action counts restores the full-log rate on the analysed class.

## AI agent verification

**[VoiceAgentGuard: Contract-Gated Tool Release for Production Voice Agents](https://github.com/paulinebourigault/voiceagentguard)** — *EMNLP 2026*  
[Code](https://github.com/paulinebourigault/voiceagentguard)

Voice agents can read private data and change state through tool calls. VoiceAgentGuard forces every proposed action through an auditable contract gate before it executes, blocking unsafe private-read and state-changing calls.

**[vcore: Verified Authority Envelopes for AI Agents](/blog/2026/what-the-agent-may-do/)** — *Research note, 2026*  
[Write-up](/blog/2026/what-the-agent-may-do/) · [Code](https://github.com/certior/vcore) · [Benchmark](https://huggingface.co/datasets/paulibo/vcore-actions-benchmark) · [Corpus](https://huggingface.co/datasets/paulibo/vcore-workflow-envelopes)

**What can a coding agent in a GitHub workflow actually do?** vcore computes the agent's *authority envelope*, the sequences of tool calls its configuration permits, and checks it for exfiltration and untrusted-write paths with a procedure proved correct in Lean 4.

[**Full publication list →**](/publications/)
