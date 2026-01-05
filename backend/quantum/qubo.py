# qubo.py
from typing import Dict, Tuple


def qubo_energy(
    state: Dict[str, int],
    dosage: Dict[str, float],
    timing: Dict[str, float],
    interaction_weights: Dict[Tuple[str, str], float],
    patient_modifier: float
) -> float:
    """
    Computes total drug interaction risk.
    """

    risk = 0.0

    # Self-risk
    for d in state:
        risk += dosage[d] * timing[d] * state[d]

    # Pairwise interaction risk
    for (i, j), w in interaction_weights.items():
        risk += w * state[i] * state[j]

    return risk * patient_modifier
