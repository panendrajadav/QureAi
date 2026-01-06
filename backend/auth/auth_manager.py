"""
Authentication System for QuraAI
Handles user signup, login, and session management with Cosmos DB
"""

import os
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta
from azure.cosmos import CosmosClient
from dotenv import load_dotenv

load_dotenv()

class AuthManager:
    """Handles user authentication with Cosmos DB."""
    
    def __init__(self):
        """Initialize Cosmos DB connection."""
        self.client = CosmosClient(
            os.getenv("COSMOS_DB_ENDPOINT"),
            os.getenv("COSMOS_DB_KEY")
        )
        self.database = self.client.get_database_client(os.getenv("COSMOS_DB_NAME"))
        self.users_container = self.database.get_container_client("users")
        self.sessions_container = self.database.get_container_client("user_sessions")
    
    def hash_password(self, password: str) -> str:
        """Hash password with salt."""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}:{password_hash.hex()}"
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash."""
        try:
            salt, stored_hash = hashed.split(':')
            password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return password_hash.hex() == stored_hash
        except:
            return False
    
    def signup(self, email: str, password: str, full_name: str) -> dict:
        """Create new user account."""
        try:
            # Check if user exists
            existing_user = self.get_user_by_email(email)
            if existing_user:
                return {"success": False, "message": "Email already registered"}
            
            # Create user
            user_id = str(uuid.uuid4())
            user_data = {
                "id": user_id,
                "userId": user_id,
                "email": email.lower(),
                "password_hash": self.hash_password(password),
                "full_name": full_name,
                "created_at": datetime.now().isoformat(),
                "is_active": True
            }
            
            self.users_container.create_item(user_data)
            
            return {
                "success": True,
                "message": "Account created successfully",
                "user_id": user_id
            }
            
        except Exception as e:
            return {"success": False, "message": f"Signup failed: {str(e)}"}
    
    def login(self, email: str, password: str) -> dict:
        """Authenticate user and create session."""
        try:
            # Get user
            user = self.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "Invalid email or password"}
            
            # Verify password
            if not self.verify_password(password, user["password_hash"]):
                return {"success": False, "message": "Invalid email or password"}
            
            # Check if user is active
            if not user.get("is_active", True):
                return {"success": False, "message": "Account is deactivated"}
            
            # Create session
            session_token = secrets.token_urlsafe(32)
            session_data = {
                "id": str(uuid.uuid4()),
                "userId": user["userId"],
                "session_token": session_token,
                "created_at": datetime.now().isoformat(),
                "expires_at": (datetime.now() + timedelta(days=7)).isoformat(),
                "is_active": True
            }
            
            self.sessions_container.create_item(session_data)
            
            return {
                "success": True,
                "message": "Login successful",
                "user_id": user["userId"],
                "session_token": session_token,
                "user_data": {
                    "email": user["email"],
                    "full_name": user["full_name"]
                }
            }
            
        except Exception as e:
            return {"success": False, "message": f"Login failed: {str(e)}"}
    
    def verify_session(self, session_token: str) -> dict:
        """Verify if session token is valid."""
        try:
            # Query sessions by token
            query = "SELECT * FROM c WHERE c.session_token = @token AND c.is_active = true"
            sessions = list(self.sessions_container.query_items(
                query=query,
                parameters=[{"name": "@token", "value": session_token}],
                enable_cross_partition_query=True
            ))
            
            if not sessions:
                return {"valid": False, "message": "Invalid session"}
            
            session = sessions[0]
            
            # Check expiration
            expires_at = datetime.fromisoformat(session["expires_at"])
            if datetime.now() > expires_at:
                # Deactivate expired session
                session["is_active"] = False
                self.sessions_container.replace_item(session["id"], session)
                return {"valid": False, "message": "Session expired"}
            
            # Get user data
            user = self.get_user_by_id(session["userId"])
            if not user or not user.get("is_active", True):
                return {"valid": False, "message": "User not found or inactive"}
            
            return {
                "valid": True,
                "user_id": user["userId"],
                "user_data": {
                    "email": user["email"],
                    "full_name": user["full_name"]
                }
            }
            
        except Exception as e:
            return {"valid": False, "message": f"Session verification failed: {str(e)}"}
    
    def logout(self, session_token: str) -> dict:
        """Logout user by deactivating session."""
        try:
            # Find and deactivate session
            query = "SELECT * FROM c WHERE c.session_token = @token"
            sessions = list(self.sessions_container.query_items(
                query=query,
                parameters=[{"name": "@token", "value": session_token}],
                enable_cross_partition_query=True
            ))
            
            if sessions:
                session = sessions[0]
                session["is_active"] = False
                self.sessions_container.replace_item(session["id"], session)
            
            return {"success": True, "message": "Logged out successfully"}
            
        except Exception as e:
            return {"success": False, "message": f"Logout failed: {str(e)}"}
    
    def get_user_by_email(self, email: str) -> dict:
        """Get user by email."""
        try:
            query = "SELECT * FROM c WHERE c.email = @email"
            users = list(self.users_container.query_items(
                query=query,
                parameters=[{"name": "@email", "value": email.lower()}],
                enable_cross_partition_query=True
            ))
            return users[0] if users else None
        except:
            return None
    
    def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID."""
        try:
            return self.users_container.read_item(user_id, user_id)
        except:
            return None

# Test the authentication system
if __name__ == "__main__":
    auth = AuthManager()
    
    print("Testing Authentication System")
    print("=" * 30)
    
    # Test signup
    signup_result = auth.signup("test@example.com", "password123", "Test User")
    print(f"Signup: {signup_result}")
    
    if signup_result["success"]:
        # Test login
        login_result = auth.login("test@example.com", "password123")
        print(f"Login: {login_result}")
        
        if login_result["success"]:
            # Test session verification
            session_result = auth.verify_session(login_result["session_token"])
            print(f"Session: {session_result}")
            
            # Test logout
            logout_result = auth.logout(login_result["session_token"])
            print(f"Logout: {logout_result}")
    
    print("\nAuthentication system ready!")