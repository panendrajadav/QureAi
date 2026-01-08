"""
VM API Pipeline - Complete AI + Quantum Pipeline for Frontend Integration
Based on pipeline_test.py but with Flask API endpoints
Upload this file to your VM backend folder
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import sys
import os
from datetime import datetime

# Add paths for imports (correct VM paths)
sys.path.append('/home/phanijadav/project/QureAi/backend/ai')
sys.path.append('/home/phanijadav/project/QureAi/backend/quantum')

from ai_layer import parse_user_message, explain_symptom

app = Flask(__name__)
CORS(app)

def calculate_safety_score(fval):
    """Convert quantum fval to safety score (0-100) and risk level"""
    if fval <= -5.0:
        score = 90 + min(10, abs(fval + 5) * 2)
        risk_level = "Low Risk"
    elif fval <= -2.0:
        score = 70 + (abs(fval + 2) / 3) * 20
        risk_level = "Low Risk"
    elif fval <= 0.0:
        score = 50 + (abs(fval) / 2) * 20
        risk_level = "Medium Risk"
    elif fval <= 2.0:
        score = 30 + (2 - fval) / 2 * 20
        risk_level = "Medium Risk"
    else:
        score = max(10, 30 - (fval - 2) * 5)
        risk_level = "High Risk"
    
    return {
        'score': max(0, min(100, int(score))),
        'risk_level': risk_level,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_health():
    """
    Main pipeline endpoint - receives prompt from frontend
    Replicates pipeline_test.py logic but as API
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'success': False, 'error': 'Message is required'}), 400

        print(f"\nReceived User Message: {user_message}")

        # ----------------------------
        # STEP 1: AI PARSING (same as pipeline_test.py)
        # ----------------------------
        parsed = parse_user_message(user_message)
        print(f"Parsed Medical Data: {json.dumps(parsed, indent=2)}")

        # ----------------------------
        # STEP 2: SEND TO QUANTUM (correct VM paths)
        # ----------------------------
        quantum_script = "/home/phanijadav/project/QureAi/backend/quantum/json_to_quantum_test.py"
        python_bin = "/home/phanijadav/project/QureAi/backend/quantum/qenv/bin/python"

        result = subprocess.run(
            [python_bin, quantum_script],
            capture_output=True,
            text=True
        )

        print(f"Quantum Raw Output: {result.stdout}")

        # ----------------------------
        # STEP 3: INTERPRET QUANTUM RESULT (same as pipeline_test.py)
        # ----------------------------
        fval = -1.0
        quantum_status = "FAILED"
        
        if result.returncode == 0 and result.stdout:
            # Parse quantum output to extract fval
            lines = result.stdout.strip().split('\n')
            for line in lines:
                if 'fval=' in line:
                    try:
                        # Extract fval from output like "fval=-2.345"
                        fval_str = line.split('fval=')[1].split(',')[0].split()[0]
                        fval = float(fval_str)
                        quantum_status = "SUCCESS"
                        break
                    except Exception as e:
                        print(f"Error parsing fval: {e}")
                        pass
                        
        # Simple risk logic (same as pipeline_test.py)
        if "status=SUCCESS" in result.stdout or quantum_status == "SUCCESS":
            quantum_risk = "low"
        else:
            quantum_risk = "medium"

        # ----------------------------
        # STEP 4: CALCULATE SAFETY SCORE FROM FVAL
        # ----------------------------
        safety_data = calculate_safety_score(fval)

        # ----------------------------
        # STEP 5: AI EXPLANATION (same as pipeline_test.py)
        # ----------------------------
        final_explanation = explain_symptom(parsed, quantum_risk)
        print(f"Final Explanation: {final_explanation}")

        # ----------------------------
        # STEP 6: RETURN STRUCTURED RESPONSE FOR FRONTEND
        # ----------------------------
        response = {
            'success': True,
            'parsed_data': parsed,
            'quantum_result': {
                'fval': fval,
                'status': quantum_status,
                'raw_output': result.stdout
            },
            'safety_score': safety_data['score'],
            'risk_level': safety_data['risk_level'],
            'explanation': final_explanation,
            'timestamp': safety_data['timestamp']
        }

        print(f"API Response: {json.dumps(response, indent=2)}")
        return jsonify(response)

    except Exception as e:
        print(f"Pipeline Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'service': 'QureAi VM Pipeline',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'QureAi VM Pipeline API',
        'endpoints': {
            'POST /api/analyze': 'Main health analysis pipeline',
            'GET /api/health': 'Health check'
        }
    })

if __name__ == '__main__':
    print("=" * 50)
    print("Starting QureAi VM Pipeline API...")
    print("=" * 50)
    print("Endpoints:")
    print("  POST /api/analyze - Main pipeline (receives frontend prompts)")
    print("  GET /api/health - Health check")
    print("  GET / - API info")
    print("=" * 50)
    print("Make sure your VM firewall allows port 5000")
    print("Frontend should connect to: http://YOUR_VM_IP:5000")
    print("=" * 50)
    
    # Run on all interfaces so frontend can connect
    app.run(host='0.0.0.0', port=5000, debug=True)
