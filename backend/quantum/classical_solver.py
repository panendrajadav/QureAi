"""
Classical Brute-Force QUBO Solver
"""
import numpy as np
from typing import Dict, Tuple
import itertools

class ClassicalSolver:
    def __init__(self):
        pass
    
    def solve(self, Q: np.ndarray, drug_names: list) -> Dict[str, any]:
        """
        Solve QUBO using brute-force enumeration
        
        Args:
            Q: QUBO matrix
            drug_names: List of drug names corresponding to Q indices
            
        Returns:
            Dictionary with solution, energy, and status
        """
        n = Q.shape[0]
        best_energy = float('inf')
        best_solution = None
        
        # Enumerate all possible binary solutions
        for solution_bits in itertools.product([0, 1], repeat=n):
            x = np.array(solution_bits)
            energy = x.T @ Q @ x
            
            if energy < best_energy:
                best_energy = energy
                best_solution = x
        
        # Convert solution to drug mapping
        solution_dict = {drug_names[i]: int(best_solution[i]) for i in range(n)}
        
        return {
            "solution": solution_dict,
            "energy": float(best_energy),
            "status": "SUCCESS"
        }