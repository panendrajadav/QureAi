import itertools

# -----------------------------
# INPUT (from AI layer)
# -----------------------------

drugs = ["A", "B", "C", "D"]

dosage = {
    "A": 0.6,
    "B": 0.4,
    "C": 0.3,
    "D": 0.2
}

timing = {
    "A": 0.2,  # morning
    "B": 0.8,  # night
    "C": 0.2,
    "D": 0.8
}

interaction_weights = {
    ("A", "B"): 0.7,
    ("B", "C"): 0.6,
    ("A", "C"): 0.4,
    ("C", "D"): 0.2
}

patient_modifier = 1.3

# -----------------------------
# QUBO ENERGY FUNCTION
# -----------------------------

def qubo_energy(state):
    """
    state: dict like {"A":0/1, "B":0/1, ...}
    """
    energy = 0

    # self-risk (dosage * timing)
    for d in drugs:
        energy += dosage[d] * timing[d] * state[d]

    # interaction risk
    for (i, j), w in interaction_weights.items():
        energy += w * state[i] * state[j]

    # patient condition scaling
    energy *= patient_modifier

    return energy

# -----------------------------
# SOLVE (brute-force simulation)
# -----------------------------

best_state = None
max_energy = -1

for combo in itertools.product([0, 1], repeat=len(drugs)):
    state = dict(zip(drugs, combo))
    e = qubo_energy(state)

    if e > max_energy:
        max_energy = e
        best_state = state

# -----------------------------
# OUTPUT
# -----------------------------

print("Most dangerous drug combination:")
print(best_state)
print("Risk score:", round(max_energy, 3))
