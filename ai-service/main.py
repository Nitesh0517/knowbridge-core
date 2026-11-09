"""
FastAPI AI Service for KnowBridge AI
Exposes REST endpoints for Document Parsing, Knowledge Reconstruction,
Evidence Verification, and Handover Generation.
"""

import os
import shutil
import tempfile
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from models import ReconstructionRequest, ReconstructionResponse
from parsers.document_parser import DocumentParser
from engine.gemini_extractor import GeminiReconstructionEngine
from engine.fallback_extractor import FallbackExtractor

app = FastAPI(
    title="KnowBridge AI Reconstruction Engine",
    description="Intelligent Knowledge Handover & Archaeological Evidence Extraction Service",
    version="1.0.0"
)

# Enable CORS for backend communication and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "online",
        "service": "KnowBridge AI Reconstruction Engine",
        "version": "1.0.0",
        "gemini_api_configured": gemini_key_present,
        "default_model": "gemini-2.5-flash",
        "parsers": ["PyMuPDF", "python-docx", "txt", "markdown"]
    }


@app.post("/api/parse-document")
async def parse_document(
    file: UploadFile = File(...)
):
    """Parses uploaded PDF, DOCX, TXT, or MD file and returns structured text + page/section metadata."""
    temp_dir = tempfile.mkdtemp()
    try:
        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        parsed_data = DocumentParser.parse_file(file_path)
        return {
            "success": True,
            "filename": file.filename,
            "data": parsed_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/reconstruct")
async def reconstruct_knowledge(
    request: ReconstructionRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    """Reconstructs project knowledge state from authorized sources using Gemini or high-precision fallback."""
    try:
        active_key = request.gemini_api_key or x_gemini_api_key or os.getenv("GEMINI_API_KEY")

        # Convert pydantic models to dicts
        sources_dict = [s.model_dump() for s in request.sources]

        reconstruction = GeminiReconstructionEngine.reconstruct_project(
            project_name=request.project_name,
            project_description=request.project_description,
            sources=sources_dict,
            target_role=request.target_role or "Incoming Member",
            departing_member=request.departing_member,
            api_key=active_key
        )

        return {
            "success": True,
            "project_id": request.project_id,
            "reconstruction": reconstruction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconstruction failed: {str(e)}")


@app.post("/api/generate-handover")
async def generate_handover_plan(payload: Dict[str, Any]):
    """Generates a role-specific continuation roadmap (30-60-90 day plan) from reconstructed state."""
    project_name = payload.get("project_name", "Project")
    target_role = payload.get("target_role", "Incoming Member")
    reconstruction = payload.get("reconstruction", {})

    decisions = reconstruction.get("decisions", [])
    tasks = reconstruction.get("unfinished_work", [])
    risks = reconstruction.get("risks", [])
    unresolved = reconstruction.get("unresolved_questions", [])

    # Filter tasks relevant for this role
    role_lower = target_role.lower()
    critical_tasks = [t for t in tasks if t.get("priority") in ["critical", "high"]]

    # Construct 30-day (immediate survival & context), 60-day (execution & stabilization), 90-day (autonomy & optimization)
    day_30 = [
        {
            "id": "PH1-01",
            "phase": "Days 1-30: Onboarding, Access & Blocker Clearance",
            "task": f"Complete environment setup, repository access, and permission verification for {target_role}.",
            "status": "pending",
            "owner": target_role,
            "criticality": "high"
        },
        {
            "id": "PH1-02",
            "phase": "Days 1-30: Onboarding, Access & Blocker Clearance",
            "task": f"Review top {len(decisions[:3])} architectural decisions and verify baseline dependencies.",
            "status": "pending",
            "owner": target_role,
            "criticality": "high"
        }
    ]

    for idx, t in enumerate(critical_tasks[:3]):
        day_30.append({
            "id": f"PH1-0{idx+3}",
            "phase": "Days 1-30: Onboarding, Access & Blocker Clearance",
            "task": f"Tackle unfinished work: {t.get('title')}",
            "status": "pending",
            "owner": target_role,
            "criticality": t.get("priority", "medium")
        })

    day_60 = [
        {
            "id": "PH2-01",
            "phase": "Days 31-60: Core Execution & Dependency Resolution",
            "task": "Resolve flagged dependencies and clear single-point-of-failure risks.",
            "status": "pending",
            "owner": target_role,
            "criticality": "medium"
        },
        {
            "id": "PH2-02",
            "phase": "Days 31-60: Core Execution & Dependency Resolution",
            "task": f"Address open questions marked as 'Insufficient Evidence': {[q.get('question')[:40] for q in unresolved[:2]]}",
            "status": "pending",
            "owner": target_role,
            "criticality": "medium"
        }
    ]

    day_90 = [
        {
            "id": "PH3-01",
            "phase": "Days 61-90: Autonomous Architecture & Long-term Stability",
            "task": "Institutionalize updated ADR documentation and knowledge verification checkpoints.",
            "status": "pending",
            "owner": target_role,
            "criticality": "low"
        },
        {
            "id": "PH3-02",
            "phase": "Days 61-90: Autonomous Architecture & Long-term Stability",
            "task": f"Establish continuous monitoring for remaining project risks: {[r.get('title')[:35] for r in risks[:2]]}",
            "status": "pending",
            "owner": target_role,
            "criticality": "low"
        }
    ]

    handover_package = {
        "title": f"KnowBridge Handover Package: {project_name} -> {target_role}",
        "project_name": project_name,
        "target_role": target_role,
        "generated_at": payload.get("generated_at"),
        "executive_summary": reconstruction.get("summary", ""),
        "health_score": reconstruction.get("health_score", 75),
        "roadmap_30_days": day_30,
        "roadmap_60_days": day_60,
        "roadmap_90_days": day_90,
        "key_decisions": decisions[:5],
        "active_tasks": tasks,
        "critical_risks": risks,
        "unresolved_questions": unresolved,
        "evidence_claims": reconstruction.get("evidence_claims", []),
        "status": "draft",
        "reviewers": payload.get("reviewers", ["Project Manager", "Departing Lead"])
    }

    return {"success": True, "handover": handover_package}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
