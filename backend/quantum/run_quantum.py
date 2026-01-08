"""
Quantum Engine Entry Point
"""
from typing import Dict, Any
from .qubo_model import QUBOModel
from .classical_solver import ClassicalSolver
from .quantum_solver import QuantumSolver

def run_quantum_engine(input_data: Dict[str, Any], use_quantum: bool = True) -> Dict[str, Any]:
    """
    Main entry point for quantum risk computation
    
    Args:
        input_data: Structured input with drugs, dosage, timing, interactions, patient_modifier
        use_quantum: Whether to use quantum solver (True) or classical (False)
        
    Returns:
        Dictionary with solution, energy, and status
    """
    try:
        # Build QUBO model
        qubo_builder = QUBOModel()
        Q = qubo_builder.build_qubo(input_data)
        drug_names = input_data["drugs"]
        
        # Choose solver
        if use_quantum and len(drug_names) <= 10:  # Quantum for small problems
            solver = QuantumSolver(reps=1)
        else:
            solver = ClassicalSolver()
        
        # Solve
        result = solver.solve(Q, drug_names)
        
        return result
        
    except Exception as e:
        # Emergency fallback
        return {
            "solution": {drug: 1 for drug in input_data["drugs"]},
            "energy": 0.0,
            "status": "ERROR"
        }

def validate_input(input_data: Dict[str, Any]) -> bool:
    """
    Validate input data structure
    """
    required_keys = ["drugs", "dosage", "timing", "interactions", "patient_modifier"]
    return all(key in input_data for key in required_keys)