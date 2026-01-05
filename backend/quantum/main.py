# main.py
from risk_optimizer import classical_bruteforce, build_risk_model
from quantum_solver import build_qubo, solve_quantum

if __name__ == "__main__":

    # Classical result
    classical_state, classical_risk = classical_bruteforce(min_drugs=2)
    print("\nCLASSICAL RESULT")
    print("Safest drug combination:", classical_state)
    print("Risk score:", round(classical_risk, 4))

    # Quantum result
    drugs, dosage, timing, interactions, modifier = build_risk_model()
    qp = build_qubo(
        drugs,
        dosage,
        timing,
        interactions,
        modifier,
        min_drugs=2
    )

    quantum_result = solve_quantum(qp)

    print("\nQUANTUM RESULT (QAOA with constraint)")
    print(quantum_result)
