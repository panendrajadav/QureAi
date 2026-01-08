"""
Quantum QAOA Solver for QUBO Problems
"""
import numpy as np
from typing import Dict, Any
from qiskit import QuantumCircuit
from qiskit.primitives import Sampler
from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_optimization.converters import QuadraticProgramToQubo

class QuantumSolver:
    def __init__(self, reps: int = 1):
        self.reps = reps
        self.sampler = Sampler()
        self.optimizer = COBYLA(maxiter=100)
    
    def solve(self, Q: np.ndarray, drug_names: list) -> Dict[str, Any]:
        """
        Solve QUBO using QAOA
        
        Args:
            Q: QUBO matrix
            drug_names: List of drug names corresponding to Q indices
            
        Returns:
            Dictionary with solution, energy, and status
        """
        try:
            # Create QuadraticProgram
            qp = QuadraticProgram()
            n = Q.shape[0]
            
            # Add binary variables
            for i in range(n):
                qp.binary_var(f'x_{i}')
            
            # Add objective (minimize)
            linear = {}
            quadratic = {}
            
            for i in range(n):
                if Q[i, i] != 0:
                    linear[f'x_{i}'] = Q[i, i]
                for j in range(i + 1, n):
                    if Q[i, j] != 0:
                        quadratic[(f'x_{i}', f'x_{j}')] = 2 * Q[i, j]
            
            qp.minimize(linear=linear, quadratic=quadratic)
            
            # Convert to QUBO if needed
            conv = QuadraticProgramToQubo()
            qubo = conv.convert(qp)
            
            # Setup QAOA
            qaoa = QAOA(sampler=self.sampler, optimizer=self.optimizer, reps=self.reps)
            algorithm = MinimumEigenOptimizer(qaoa)
            
            # Solve
            result = algorithm.solve(qubo)
            
            # Extract solution
            solution_dict = {}
            for i, drug in enumerate(drug_names):
                var_name = f'x_{i}'
                solution_dict[drug] = int(result.x[i]) if hasattr(result, 'x') else 0
            
            return {
                "solution": solution_dict,
                "energy": float(result.fval) if hasattr(result, 'fval') else 0.0,
                "status": "SUCCESS" if result.status.name == "SUCCESS" else "FAILED"
            }
            
        except Exception as e:
            # Fallback to simple heuristic
            solution_dict = {drug: 1 for drug in drug_names}
            energy = np.sum(Q)
            
            return {
                "solution": solution_dict,
                "energy": float(energy),
                "status": "FALLBACK"
            }