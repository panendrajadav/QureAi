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
database = cosmos_client.get_database_client(os.getenv("COSMOS_DB_NAME"))

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
        # Get user's medicines
        medicines = await get_medicines(user)
        
        # Calculate basic risk score (simplified)
        risk_score = min(95, max(60, 90 - len(medicines) * 5))
        
        risk_data = {
            "id": str(uuid.uuid4()),
            "userId": user["user_id"],
            "overall_score": risk_score,
            "risk_level": "low" if risk_score > 80 else "medium" if risk_score > 60 else "high",
            "medicine_count": len(medicines),
            "last_updated": datetime.now().isoformat()
        }
        
        # Store assessment
        try:
            risk_assessments_container.create_item(risk_data)
        except:
            pass
        
        return risk_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Main analyze endpoint for AI + Quantum processing
@app.post("/analyze")
async def analyze_health_message(request: ChatMessageRequest):
    try:
        # Simple response for now - replace with your AI + Quantum logic
        response_data = {
            "parsed": {
                "message": request.message,
                "timestamp": datetime.now().isoformat()
            },
            "quantum": {
                "status": "processed",
                "risk_score": 0.3
            },
            "risk": "low",
            "explanation": f"I've analyzed your message: '{request.message}'. Based on current health data, your risk level appears to be low. Please consult with your healthcare provider for personalized medical advice."
        }
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoints
@app.post("/chat")
async def chat_message(request: ChatMessageRequest, user: dict = Depends(get_current_user)):
    # Simple AI response (integrate with your AI layer later)
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