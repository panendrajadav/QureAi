# json_to_quantum_test.py

from quantum_solver import build_qubo, solve_quantum

# This JSON normally comes from Amazon Q
parsed_input = {
    "diseases": ["diabetes"],
    "medicines": [
        {"name": "Metformin", "dose_mg": 500, "time": "morning"}
    ],
    "symptom": "dizziness"
}

# Convert JSON → quantum inputs
drugs = [m["name"] for m in parsed_input["medicines"]]

dosage = {
    m["name"]: m["dose_mg"] / 1000
    for m in parsed_input["medicines"]
}

timing_map = {"morning": 0.2, "afternoon": 0.5, "night": 0.8}
timing = {
    m["name"]: timing_map[m["time"]]
    for m in parsed_input["medicines"]
}

interaction_weights = {}  # single drug → no pair interaction
patient_modifier = 1.3

qp = build_qubo(
    drugs,
    dosage,
    timing,
    interaction_weights,
    patient_modifier,
    min_drugs=1
)

result = solve_quantum(qp)

print("Quantum result:")
print(result)
