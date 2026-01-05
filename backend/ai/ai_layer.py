"""
AI Layer for Healthcare Quantum Project

Parses natural language input and provides symptom explanations using Azure OpenAI.
"""

import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

class HealthcareAI:
    """AI layer for parsing medical information and explaining symptoms."""
    
    def __init__(self):
        """Initialize Azure OpenAI client."""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.model = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    
    def parse_user_message(self, user_message: str) -> dict:
        """
        Parse user's natural language input into structured JSON.
        
        Args:
            user_message: User's description of disease, medicines, and symptoms
            
        Returns:
            Structured JSON with diseases, medicines, and symptoms
        """
        prompt = f"""
        Extract medical information from this text and return ONLY valid JSON:
        
        Text: "{user_message}"
        
        Required JSON format:
        {{
          "diseases": [],
          "medicines": [
            {{
              "name": "",
              "dose_mg": "",
              "time": ""
            }}
          ],
          "symptom": ""
        }}
        
        Return only the JSON, no explanation.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.1
            )
            
            result = response.choices[0].message.content.strip()
            return json.loads(result)
            
        except Exception as e:
            return {
                "diseases": [],
                "medicines": [],
                "symptom": ""
            }
    
    def explain_symptom(self, parsed_data: dict, quantum_risk_level: str) -> str:
        """
        Explain the symptom in simple language using quantum risk analysis.
        
        Args:
            parsed_data: Parsed medical data from parse_user_message
            quantum_risk_level: "low", "medium", or "high" from quantum analysis
            
        Returns:
            Simple explanation of the symptom
        """
        diseases = ", ".join(parsed_data.get("diseases", []))
        medicines = [f"{m['name']} {m['dose_mg']}mg" for m in parsed_data.get("medicines", [])]
        medicines_str = ", ".join(medicines)
        symptom = parsed_data.get("symptom", "")
        
        prompt = f"""
        Explain this medical situation in simple language (max 4 sentences):
        
        Patient has: {diseases}
        Taking: {medicines_str}
        Symptom: {symptom}
        Quantum risk analysis: {quantum_risk_level} risk
        
        Rules:
        - Use very simple language
        - Explain why the symptom may have occurred
        - Mention the risk level
        - Suggest doctor consultation only if needed
        - Do not give diagnosis
        - Do not scare the patient
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return "Please consult your doctor about any symptoms you're experiencing."

# Convenience functions
ai_layer = HealthcareAI()

def parse_user_message(user_message: str) -> dict:
    """Parse user message into structured JSON."""
    return ai_layer.parse_user_message(user_message)

def explain_symptom(parsed_data: dict, quantum_risk_level: str) -> str:
    """Explain symptom with quantum risk context."""
    return ai_layer.explain_symptom(parsed_data, quantum_risk_level)

# Test example
if __name__ == "__main__":
    # Test parsing
    test_message = "I have diabetes. I take Metformin 500mg in the morning. After that I feel dizziness."
    parsed = parse_user_message(test_message)
    print("Parsed:", json.dumps(parsed, indent=2))
    
    # Test explanation
    explanation = explain_symptom(parsed, "low")
    print("Explanation:", explanation)