"""
Authentication API Endpoints for QuraAI
FastAPI routes for signup, login, logout, and session verification
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from auth.auth_manager import AuthManager

app = FastAPI(title="QuraAI Authentication API")
auth_manager = AuthManager()

# Request models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Response models
class AuthResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
    session_token: Optional[str] = None
    user_data: Optional[dict] = None

@app.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """Create new user account."""
    result = auth_manager.signup(request.email, request.password, request.full_name)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return AuthResponse(**result)

@app.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Authenticate user and create session."""
    result = auth_manager.login(request.email, request.password)
    
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    
    return AuthResponse(**result)

@app.post("/logout")
async def logout(authorization: str = Header(None)):
    """Logout user by deactivating session."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    session_token = authorization.replace("Bearer ", "")
    result = auth_manager.logout(session_token)
    
    return {"message": result["message"]}

@app.get("/verify")
async def verify_session(authorization: str = Header(None)):
    """Verify session token and return user data."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    session_token = authorization.replace("Bearer ", "")
    result = auth_manager.verify_session(session_token)
    
    if not result["valid"]:
        raise HTTPException(status_code=401, detail=result["message"])
    
    return {
        "valid": True,
        "user_id": result["user_id"],
        "user_data": result["user_data"]
    }

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "QuraAI Authentication API is running"}

# Dependency for protected routes
async def get_current_user(authorization: str = Header(None)):
    """Dependency to get current authenticated user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    session_token = authorization.replace("Bearer ", "")
    result = auth_manager.verify_session(session_token)
    
    if not result["valid"]:
        raise HTTPException(status_code=401, detail=result["message"])
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)