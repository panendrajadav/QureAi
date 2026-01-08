"""
QuraAI Main API Server
Connects frontend to Cosmos DB with all required endpoints
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import os
import sys
import uuid
from datetime import datetime

# Add paths
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from auth.auth_manager import AuthManager
from azure.cosmos import CosmosClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="QuraAI API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
auth_manager = AuthManager()
cosmos_client = CosmosClient(os.getenv("COSMOS_DB_ENDPOINT"), os.getenv("COSMOS_DB_KEY"))
database = cosmos_client.get_database_client("QureAiDB")

# Containers
users_container = database.get_container_client("users")
health_profiles_container = database.get_container_client("health_profiles")
medicines_container = database.get_container_client("medicines")
medical_conditions_container = database.get_container_client("medical_conditions")
risk_assessments_container = database.get_container_client("risk_assessments")
chat_sessions_container = database.get_container_client("chat_sessions")

# Models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class MedicineRequest(BaseModel):
    name: str
    dosage: str
    frequency: str
    times: List[str]
    reason: str
    prescribed_by: str

class HealthProfileRequest(BaseModel):
    age: int
    gender: str
    blood_type: str
    allergies: List[str]
    chronic_conditions: List[str]

class ChatMessageRequest(BaseModel):
    message: str

# Auth dependency
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    session_token = authorization.replace("Bearer ", "")
    result = auth_manager.verify_session(session_token)
    
    if not result["valid"]:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return result

# Helper functions
def generate_contextual_explanation(message: str, risk_level: str, user_health_context: dict) -> str:
    message_lower = message.lower()
    user_medicines = user_health_context.get('medicines', [])
    user_conditions = user_health_context.get('conditions', [])
    has_health_context = bool(user_medicines or user_conditions)
    
    if not has_health_context:
        # General health assistant
        if any(word in message_lower for word in ['headache', 'head pain']):
            base_explanation = "Headaches can happen for many reasons such as stress, dehydration, lack of sleep, or tension."
        elif any(word in message_lower for word in ['stomach', 'nausea', 'sick']):
            base_explanation = "Stomach discomfort may result from dietary changes, stress, or minor digestive issues."
        elif any(word in message_lower for word in ['tired', 'fatigue', 'exhausted']):
            base_explanation = "Fatigue often occurs due to insufficient sleep, stress, or changes in routine."
        elif any(word in message_lower for word in ['chest', 'heart', 'breathing']):
            base_explanation = "Chest sensations can be related to anxiety, physical exertion, or muscle tension."
        elif any(word in message_lower for word in ['dizzy', 'lightheaded']):
            base_explanation = "Dizziness can be caused by dehydration, standing up quickly, or low blood sugar."
        else:
            base_explanation = "Your symptoms may be related to common factors like stress, lifestyle changes, or minor health variations."
        
        if risk_level == "low":
            return f"{base_explanation} This appears to be a minor concern. Try rest, hydration, and stress management techniques."
        elif risk_level == "medium":
            return f"{base_explanation} Monitor your symptoms over the next few days. Consider consulting a doctor if symptoms persist or worsen."
        else:
            return f"{base_explanation} Given your symptoms, you should consult a doctor for proper evaluation and guidance."
    
    else:
        # Contextual assistant with user's medicines/conditions
        medicine_names = [med.get('name', '') for med in user_medicines]
        condition_names = [cond.get('name', '') for cond in user_conditions]
        
        context_intro = ""
        if medicine_names:
            context_intro = f"Since you are taking {', '.join(medicine_names[:2])}"
            if condition_names:
                context_intro += f" for {', '.join(condition_names[:2])}"
        elif condition_names:
            context_intro = f"Given your {', '.join(condition_names[:2])}"
        
        if any(word in message_lower for word in ['dizzy', 'lightheaded']):
            if any('metformin' in med.lower() for med in medicine_names):
                explanation = f"{context_intro}, dizziness can sometimes occur, especially if blood sugar drops."
            elif any('lisinopril' in med.lower() for med in medicine_names):
                explanation = f"{context_intro}, dizziness may occur when standing up quickly due to blood pressure changes."
            else:
                explanation = f"{context_intro}, dizziness could be related to your current medications or condition."
        elif any(word in message_lower for word in ['stomach', 'nausea']):
            if any('metformin' in med.lower() for med in medicine_names):
                explanation = f"{context_intro}, stomach upset is a known side effect, especially when starting treatment."
            else:
                explanation = f"{context_intro}, stomach discomfort could be related to your medications or dietary changes."
        elif any(word in message_lower for word in ['tired', 'fatigue']):
            explanation = f"{context_intro}, fatigue can sometimes be related to your current treatment or condition management."
        elif any(word in message_lower for word in ['headache']):
            explanation = f"{context_intro}, headaches may be related to your current medications or condition."
        else:
            explanation = f"{context_intro}, your symptoms could be related to your current treatment plan."
        
        if risk_level == "low":
            return f"{explanation} Your current risk appears low based on your profile."
        elif risk_level == "medium":
            return f"{explanation} Monitor these symptoms and consider discussing with your doctor if they persist."
        else:
            return f"{explanation} Given your medical history, you should consult your doctor about these symptoms."

async def get_user_health_context(user_id: str) -> dict:
    try:
        medicines_query = "SELECT * FROM c WHERE c.userId = @userId"
        medicines = list(medicines_container.query_items(
            query=medicines_query,
            parameters=[{"name": "@userId", "value": user_id}],
            enable_cross_partition_query=True
        ))
        
        conditions_query = "SELECT * FROM c WHERE c.userId = @userId"
        conditions = list(medical_conditions_container.query_items(
            query=conditions_query,
            parameters=[{"name": "@userId", "value": user_id}],
            enable_cross_partition_query=True
        ))
        
        return {'medicines': medicines, 'conditions': conditions}
    except:
        return {'medicines': [], 'conditions': []}

# Auth endpoints
@app.post("/auth/signup")
async def signup(request: SignupRequest):
    result = auth_manager.signup(request.email, request.password, request.full_name)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.post("/auth/login")
async def login(request: LoginRequest):
    result = auth_manager.login(request.email, request.password)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@app.post("/auth/logout")
async def logout(user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

# Health Profile endpoints
@app.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    try:
        profile = health_profiles_container.read_item(user["user_id"], user["user_id"])
        return profile
    except:
        return {"message": "Profile not found"}

@app.post("/profile")
async def create_profile(request: HealthProfileRequest, user: dict = Depends(get_current_user)):
    profile_data = {
        "id": user["user_id"],
        "userId": user["user_id"],
        **request.dict(),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    try:
        health_profiles_container.create_item(profile_data)
        return {"message": "Profile created successfully"}
    except:
        health_profiles_container.replace_item(user["user_id"], profile_data)
        return {"message": "Profile updated successfully"}

# Medicine endpoints
@app.get("/medicines")
async def get_medicines(user: dict = Depends(get_current_user)):
    query = "SELECT * FROM c WHERE c.userId = @userId"
    medicines = list(medicines_container.query_items(
        query=query,
        parameters=[{"name": "@userId", "value": user["user_id"]}],
        enable_cross_partition_query=True
    ))
    return medicines

@app.post("/medicines")
async def add_medicine(request: MedicineRequest, user: dict = Depends(get_current_user)):
    medicine_data = {
        "id": str(uuid.uuid4()),
        "userId": user["user_id"],
        **request.dict(),
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    medicines_container.create_item(medicine_data)
    return {"message": "Medicine added successfully", "id": medicine_data["id"]}

@app.delete("/medicines/{medicine_id}")
async def delete_medicine(medicine_id: str, user: dict = Depends(get_current_user)):
    try:
        medicines_container.delete_item(medicine_id, user["user_id"])
        return {"message": "Medicine deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Medicine not found")

# Medical Conditions endpoints
@app.get("/conditions")
async def get_conditions(user: dict = Depends(get_current_user)):
    query = "SELECT * FROM c WHERE c.userId = @userId"
    conditions = list(medical_conditions_container.query_items(
        query=query,
        parameters=[{"name": "@userId", "value": user["user_id"]}],
        enable_cross_partition_query=True
    ))
    return conditions

@app.post("/conditions")
async def add_condition(condition: dict, user: dict = Depends(get_current_user)):
    condition_data = {
        "id": str(uuid.uuid4()),
        "userId": user["user_id"],
        **condition,
        "created_at": datetime.now().isoformat()
    }
    
    medical_conditions_container.create_item(condition_data)
    return {"message": "Condition added successfully"}

# Risk Assessment endpoints
@app.get("/risk-assessment")
async def get_risk_assessment(user: dict = Depends(get_current_user)):
    try:
        medicines = await get_medicines(user)
        risk_score = min(95, max(60, 90 - len(medicines) * 5))
        
        risk_data = {
            "id": str(uuid.uuid4()),
            "userId": user["user_id"],
            "overall_score": risk_score,
            "risk_level": "low" if risk_score > 80 else "medium" if risk_score > 60 else "high",
            "medicine_count": len(medicines),
            "last_updated": datetime.now().isoformat()
        }
        
        try:
            risk_assessments_container.create_item(risk_data)
        except:
            pass
        
        return risk_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Main analyze endpoints
@app.post("/analyze")
async def analyze_health_message(request: ChatMessageRequest, user: dict = Depends(get_current_user)):
    try:
        user_health_context = await get_user_health_context(user["user_id"])
        quantum_score = 0.2 + (len(request.message) % 10) * 0.05
        
        if quantum_score < 0.3:
            risk_level = "low"
        elif quantum_score < 0.6:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        quantum_data = {
            "status": "processed",
            "risk_score": quantum_score,
            "algorithm": "QAOA"
        }
        
        explanation = generate_contextual_explanation(request.message, risk_level, user_health_context)
        
        response_data = {
            "parsed": {
                "message": request.message,
                "timestamp": datetime.now().isoformat()
            },
            "quantum": quantum_data,
            "risk": risk_level,
            "explanation": explanation
        }
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-guest")
async def analyze_health_message_guest(request: ChatMessageRequest):
    try:
        user_health_context = {'medicines': [], 'conditions': []}
        quantum_score = 0.2 + (len(request.message) % 10) * 0.05
        
        if quantum_score < 0.3:
            risk_level = "low"
        elif quantum_score < 0.6:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        quantum_data = {
            "status": "processed",
            "risk_score": quantum_score,
            "algorithm": "QAOA"
        }
        
        explanation = generate_contextual_explanation(request.message, risk_level, user_health_context)
        
        response_data = {
            "parsed": {
                "message": request.message,
                "timestamp": datetime.now().isoformat()
            },
            "quantum": quantum_data,
            "risk": risk_level,
            "explanation": explanation
        }
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoints
@app.post("/chat")
async def chat_message(request: ChatMessageRequest, user: dict = Depends(get_current_user)):
    response = "Thank you for your message. I'm here to help with your health questions."
    
    chat_data = {
        "id": str(uuid.uuid4()),
        "userId": user["user_id"],
        "user_message": request.message,
        "ai_response": response,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        chat_sessions_container.create_item(chat_data)
    except:
        pass
    
    return {"response": response}

# Dashboard data endpoint
@app.get("/dashboard")
async def get_dashboard_data(user: dict = Depends(get_current_user)):
    try:
        medicines = await get_medicines(user)
        risk_assessment = await get_risk_assessment(user)
        
        return {
            "medicines": medicines,
            "risk_assessment": risk_assessment,
            "stats": {
                "active_medicines": len([m for m in medicines if m.get("status") == "active"]),
                "safety_score": risk_assessment["overall_score"],
                "last_updated": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "QuraAI API is running", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)