from risk_optimizer import build_risk_model
from qubo import build_qubo
from azure_qubo_solver import solve

base, interactions = build_risk_model(n_drugs=10)
qubo = build_qubo(base, interactions)
solution = solve(qubo)

print(solution)
