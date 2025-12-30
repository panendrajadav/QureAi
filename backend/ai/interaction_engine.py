"""
AI Interaction Engine for QuraAI

Converts patient medicine data into quantum-ready numeric representation.
"""

import re

class InteractionEngine:
    """AI preprocessing layer - translates patient data to quantum format."""
    
    def __init__(self):
        """Initialize time encoding map."""
        self.time_map = {
            'morning': 0.2,
            'afternoon': 0.5,
            'evening': 0.7,
            'night': 0.8
        }
    
    def process_medicines(self, patient_data):
        """
        Convert patient medicines to quantum-ready format.
        
        Args:
            patient_data: Dict with 'medicines' list and 'disease'
            
        Returns:
            Dict with normalized variables, time encoding, and disease
        """
        medicines = patient_data.get('medicines', [])
        disease = patient_data.get('disease', 'unknown')
        variables = {}
        time_encoding = {}
        
        for medicine in medicines:
            name = medicine['name']
            variables[name] = self._normalize_dose(medicine['dose'])
            time_encoding[name] = self._encode_time(medicine['time'])
        
        return {
            'disease': disease,
            'variables': variables,
            'time_encoding': time_encoding
        }
    
    def _normalize_dose(self, dose_str):
        """Normalize dosage to 0-1 scale."""
        match = re.search(r'(\d+)', dose_str)
        if match:
            dose_mg = int(match.group(1))
            return min(dose_mg / 1000.0, 1.0)
        return 0.1
    
    def _encode_time(self, time_str):
        """Encode time to numeric value."""
        return self.time_map.get(time_str.lower(), 0.5)

if __name__ == "__main__":
    engine = InteractionEngine()
    
    patient_input = {
        "disease": "pain and inflammation",
        "medicines": [
            {"name": "Paracetamol", "dose": "500mg", "time": "morning"},
            {"name": "Ibuprofen", "dose": "200mg", "time": "night"}
        ]
    }
    
    result = engine.process_medicines(patient_input)
    print(result)
