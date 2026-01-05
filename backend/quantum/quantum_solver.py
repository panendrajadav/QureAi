# quantum_solver.py
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit.primitives import Sampler


def build_qubo(
    drugs,
    dosage,
    timing,
    interactions,
    modifier,
    min_drugs=2,
    penalty_strength=5.0
):
    qp = QuadraticProgram()

    for d in drugs:
        qp.binary_var(d)

    # ------------------
    # Base risk
    # ------------------
    linear = {d: dosage[d] * timing[d] * modifier for d in drugs}
    quadratic = {(i, j): w * modifier for (i, j), w in interactions.items()}

    # ------------------
    # Constraint: sum(x_i) ≈ K
    # Penalty: P*(sum(x_i) - K)^2
    # ------------------
    K = min_drugs
    P = penalty_strength

    for d in drugs:
        linear[d] += P * (1 - 2 * K)

    for i in range(len(drugs)):
        for j in range(i + 1, len(drugs)):
            pair = (drugs[i], drugs[j])
            quadratic[pair] = quadratic.get(pair, 0) + 2 * P

    qp.minimize(linear=linear, quadratic=quadratic)
    return qp


def solve_quantum(qp):
    qaoa = QAOA(
        sampler=Sampler(),
        optimizer=COBYLA(maxiter=100),
        reps=2
    )

    optimizer = MinimumEigenOptimizer(qaoa)
    return optimizer.solve(qp)
