"""
QUBO Model Builder for Drug Interaction Risk Optimization
"""
import numpy as np
from typing import Dict, List, Tuple, Any

class QUBOModel:
    def __init__(self):
        self.Q = None
        self.drug_indices = {}
        self.num_drugs = 0
    
    def build_qubo(self, input_data: Dict[str, Any]) -> np.ndarray:
        """
        Build QUBO matrix from structured input data
        
        Args:
            input_data: Dictionary containing drugs, dosage, timing, interactions, patient_modifier
            
        Returns:
            QUBO matrix Q where energy = x^T Q x
        """
        drugs = input_data["drugs"]
        dosage = input_data["dosage"]
        timing = input_data["timing"]
        interactions = input_data["interactions"]
        patient_modifier = input_data["patient_modifier"]
        
        self.num_drugs = len(drugs)
        self.drug_indices = {drug: i for i, drug in enumerate(drugs)}
        
        # Initialize QUBO matrix
        self.Q = np.zeros((self.num_drugs, self.num_drugs))
        
        # Add self-risk terms (diagonal)
        for drug in drugs:
            i = self.drug_indices[drug]
            self_risk = dosage[drug] * timing[drug] * patient_modifier
            self.Q[i, i] = self_risk
        
        # Add interaction terms (off-diagonal)
        for (drug1, drug2), interaction_risk in interactions.items():
            i = self.drug_indices[drug1]
            j = self.drug_indices[drug2]
            # Symmetric interaction
            self.Q[i, j] = interaction_risk / 2
            self.Q[j, i] = interaction_risk / 2
        
        return self.Q
    
    def get_drug_indices(self) -> Dict[str, int]:
        return self.drug_indices
    
    def get_num_drugs(self) -> int:
        return self.num_drugs