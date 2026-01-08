from ai.ai_layer import parse_user_message, explain_symptom
from quantum.run_quantum import run_quantum_engine

def run_pipeline(user_message: str):
    # 1. AI parse
    parsed = parse_user_message(user_message)

    # 2. Prepare quantum input
    drugs = [m["name"] for m in parsed["medicines"]]
    dosage = {m["name"]: float(m["dose_mg"]) / 1000 for m in parsed["medicines"]}

    timing_map = {"morning": 0.2, "afternoon": 0.5, "night": 0.8}
    timing = {m["name"]: timing_map[m["time"]] for m in parsed["medicines"]}

    interactions = {}
    patient_modifier = 1.3

    quantum_input = {
        "drugs": drugs,
        "dosage": dosage,
        "timing": timing,
        "interactions": interactions,
        "patient_modifier": patient_modifier
    }

    # 3. Quantum
    quantum_result = run_quantum_engine(quantum_input, use_quantum=True)

    # 4. Risk mapping
    energy = quantum_result["energy"]
    risk = "low" if energy > -10 else "medium" if energy > -20 else "high"

    # 5. AI explanation
    explanation = explain_symptom(parsed, risk)

    return {
        "parsed": parsed,
        "quantum": quantum_result,
        "risk": risk,
        "explanation": explanation
    }
