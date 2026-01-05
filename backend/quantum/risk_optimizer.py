# risk_optimizer.py
import itertools
from qubo import qubo_energy


def build_risk_model():
    drugs = ["A", "B", "C", "D", "E"]

    dosage = {
        "A": 0.6,
        "B": 0.4,
        "C": 0.3,
        "D": 0.2,
        "E": 0.1
    }

    timing = {
        "A": 0.2,
        "B": 0.8,
        "C": 0.2,
        "D": 0.5,
        "E": 0.8
    }

    interaction_weights = {
        ("A", "B"): 0.7,
        ("A", "C"): 0.4,
        ("B", "C"): 0.6,
        ("B", "D"): 0.5,
        ("C", "E"): 0.3,
        ("D", "E"): 0.2
    }

    patient_modifier = 1.4
    return drugs, dosage, timing, interaction_weights, patient_modifier


def classical_bruteforce(min_drugs=2):
    drugs, dosage, timing, interactions, modifier = build_risk_model()

    best_state = None
    min_risk = float("inf")

    for combo in itertools.product([0, 1], repeat=len(drugs)):
        state = dict(zip(drugs, combo))

        # ✅ HARD CONSTRAINT
        if sum(state.values()) < min_drugs:
            continue

        risk = qubo_energy(state, dosage, timing, interactions, modifier)

        if risk < min_risk:
            min_risk = risk
            best_state = state

    return best_state, min_risk
