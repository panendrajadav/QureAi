import subprocess
import json
from ai_layer import parse_user_message, explain_symptom

# ----------------------------
# USER INPUT (simulated frontend)
# ----------------------------
print("\nType your health message below:")
user_message = input("> ")


print("\nUser Message:")
print(user_message)

# ----------------------------
# STEP 1: AI PARSING
# ----------------------------
parsed = parse_user_message(user_message)

print("\nParsed Medical Data:")
print(json.dumps(parsed, indent=2))

# ----------------------------
# STEP 2: SEND TO QUANTUM (VM)
# ----------------------------
# We pass parsed JSON as string argument
quantum_script = "/home/phanijadav/project/QureAi/backend/quantum/json_to_quantum_test.py"
python_bin = "/home/phanijadav/project/QureAi/backend/quantum/qenv/bin/python"

result = subprocess.run(
    [python_bin, quantum_script],
    capture_output=True,
    text=True
)

print("\nQuantum Raw Output:")
print(result.stdout)

# ----------------------------
# STEP 3: INTERPRET QUANTUM RESULT
# ----------------------------
# Simple risk logic (can be improved later)
if "status=SUCCESS" in result.stdout:
    quantum_risk = "low"
else:
    quantum_risk = "medium"

# ----------------------------
# STEP 4: AI EXPLANATION
# ----------------------------
final_explanation = explain_symptom(parsed, quantum_risk)

print("\nFinal Explanation to User:")
print(final_explanation)

