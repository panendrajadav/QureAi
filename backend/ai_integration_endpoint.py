# Add this endpoint to main_api.py

@app.post("/ai-analysis")
async def ai_analysis(request: ChatMessageRequest, user: dict = Depends(get_current_user)):
    """AI + Quantum + Explainability analysis endpoint."""
    try:
        # Import your existing components
        sys.path.append(os.path.join(os.path.dirname(__file__), 'ai'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 'quantum'))
        
        from ai_layer import parse_user_message, explain_symptom
        from interaction_engine import InteractionEngine
        from drug_interaction_analyzer import DrugInteractionAnalyzer
        from qubo import qubo_energy
        
        # Get user medicines
        user_medicines = await get_medicines(user)
        
        # Step 1: AI parsing
        parsed_data = parse_user_message(request.message)
        
        # Step 2: Convert to quantum format
        engine = InteractionEngine()
        medicine_data = {
            "medicines": user_medicines if user_medicines else [
                {"name": med["name"], "dose": f"{med['dose_mg']}mg", "time": "morning"}
                for med in parsed_data.get("medicines", [])
            ]
        }
        quantum_data = engine.process_medicines(medicine_data)
        
        # Step 3: Quantum analysis
        variables = quantum_data.get("variables", {})
        if variables:
            # Simple quantum risk calculation
            total_risk = sum(variables.values()) * 0.3
            risk_level = "high" if total_risk > 0.7 else "medium" if total_risk > 0.4 else "low"
            safety_score = max(0, 100 - int(total_risk * 100))
        else:
            total_risk = 0.1
            risk_level = "low"
            safety_score = 95
        
        # Step 4: AI explanation
        explanation = explain_symptom(parsed_data, risk_level)
        
        # Step 5: Drug interaction analysis
        analyzer = DrugInteractionAnalyzer()
        if user_medicines:
            drug_explanation = analyzer.explain_medicine_usage(
                parsed_data.get("diseases", ["general health"])[0] if parsed_data.get("diseases") else "general health",
                user_medicines
            )
        else:
            drug_explanation = "No medicines to analyze."
        
        return {
            "success": True,
            "parsed_input": parsed_data,
            "quantum_data": quantum_data,
            "risk_analysis": {
                "safety_score": safety_score,
                "risk_level": risk_level,
                "risk_score": total_risk
            },
            "ai_explanation": explanation,
            "drug_explanation": drug_explanation,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "explanation": "Unable to process your request at this time."
        }