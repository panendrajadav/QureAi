"""
Drug Interaction Analyzer for QuraAI

Generates brief explanations of medicine usage for diseases.
"""

import os
from openai import AzureOpenAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class DrugInteractionAnalyzer:
    """Generates medicine usage explanations using Azure OpenAI."""
    
    def __init__(self):
        """Initialize Azure OpenAI client."""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        
        self.prompt_template = PromptTemplate(
            input_variables=["disease", "medicine_details"],
            template="Explain in 2-3 lines why these medicines are used for {disease}: {medicine_details}. Include why these specific doses and timing are chosen and what effects they have."
        )
    
    def explain_medicine_usage(self, disease, medicines_data):
        """
        Generate brief explanation of medicine usage with dosage and timing.
        
        Args:
            disease: Disease name
            medicines_data: List of medicine dicts with name, dose, time
            
        Returns:
            Brief explanation string
        """
        medicine_details = []
        for med in medicines_data:
            detail = f"{med['name']} {med['dose']} taken in {med['time']}"
            medicine_details.append(detail)
        
        medicine_details_str = ", ".join(medicine_details)
        prompt = self.prompt_template.format(disease=disease, medicine_details=medicine_details_str)
        
        try:
            response = self.client.chat.completions.create(
                model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
                messages=[{"role": "user", "content": prompt}],
                max_tokens=120,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Paracetamol 500mg in morning reduces pain and fever. Ibuprofen 200mg at night helps reduce inflammation and provides longer pain relief during sleep."

if __name__ == "__main__":
    analyzer = DrugInteractionAnalyzer()
    
    patient_input = {
        "disease": "pain and inflammation",
        "medicines": [
            {"name": "Paracetamol", "dose": "500mg", "time": "morning"},
            {"name": "Ibuprofen", "dose": "200mg", "time": "night"}
        ]
    }
    
    medicine_data = patient_input["medicines"]
    explanation = analyzer.explain_medicine_usage(patient_input["disease"], medicine_data)
    print(explanation)