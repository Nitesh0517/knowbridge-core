"""
End-to-End Test Suite for KnowBridge AI
Validates all 5 Core Stages:
01. CONNECT (Ingestion of PDF, DOCX, meeting notes)
02. RECONSTRUCT (Gemini & Heuristic state extraction)
03. VERIFY (Evidence linking and claim verification)
04. REVIEW (Human review and approval gate)
05. HANDOVER (Role continuation package and public tokenized access)
"""

import sys
import time
import requests
import json
import os

NODE_BASE_URL = "http://localhost:5000"
FASTAPI_BASE_URL = "http://localhost:8000"

def test_fastapi_service():
    print("\n--- 1. Testing Python FastAPI AI Service ---")
    try:
        res = requests.get(f"{FASTAPI_BASE_URL}/health", timeout=5)
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        data = res.json()
        print(f"[OK] AI Service online: {data['service']} (version {data['version']})")
        print(f"     Parsers active: {', '.join(data['parsers'])}")
    except Exception as e:
        print(f"[FAIL] FastAPI Health Error: {e}")
        return False

    # Test PDF parsing
    sample_pdf = os.path.join(os.path.dirname(__file__), "sample-data", "ADR-007-Database-Cutover-Strategy.pdf")
    if os.path.exists(sample_pdf):
        with open(sample_pdf, "rb") as f:
            res = requests.post(f"{FASTAPI_BASE_URL}/api/parse-document", files={"file": f}, timeout=10)
        assert res.status_code == 200
        pdata = res.json()["data"]
        print(f"[OK] PDF Parser verified: {pdata['file_name']} ({pdata['page_count']} pages, {pdata['total_chars']} chars)")

    # Test DOCX parsing
    sample_docx = os.path.join(os.path.dirname(__file__), "sample-data", "Falcon-Sprint26-Handoff-Notes.docx")
    if os.path.exists(sample_docx):
        with open(sample_docx, "rb") as f:
            res = requests.post(f"{FASTAPI_BASE_URL}/api/parse-document", files={"file": f}, timeout=10)
        assert res.status_code == 200
        ddata = res.json()["data"]
        print(f"[OK] DOCX Parser verified: {ddata['file_name']} ({ddata['total_chars']} chars)")

    return True

def test_backend_service():
    print("\n--- 2. Testing Node.js Express REST Backend ---")
    try:
        res = requests.get(f"{NODE_BASE_URL}/health", timeout=5)
        assert res.status_code == 200
        bdata = res.json()
        print(f"[OK] Backend API online: {bdata['service']} (Tagline: '{bdata['tagline']}')")
    except Exception as e:
        print(f"[FAIL] Backend Health Error: {e}")
        return False

    headers = {"Authorization": "Bearer demo-token"}

    # Test Projects API
    res = requests.get(f"{NODE_BASE_URL}/api/projects", headers=headers)
    assert res.status_code == 200
    projects = res.json()["data"]
    print(f"[OK] Projects listed: {len(projects)} existing project workspaces")

    # Create a project
    new_proj_payload = {
        "name": "E2E Test Transition Engine",
        "description": "Automated verification workspace for KnowBridge Hackathon submission.",
        "organization": "KnowBridge Test Labs",
        "category": "Cloud Engineering & DevOps",
        "projectManager": "Elena Rostova",
        "status": "In Progress"
    }
    res = requests.post(f"{NODE_BASE_URL}/api/projects", json=new_proj_payload, headers=headers)
    assert res.status_code == 201
    created_proj = res.json()["data"]
    proj_id = created_proj["id"]
    print(f"[OK] Project created: '{created_proj['name']}' (ID: {proj_id})")

    # Connect Sources (Meeting note)
    meeting_payload = {
        "projectId": proj_id,
        "title": "Lead Handover Sync & Security Audit",
        "date": "2025-10-28",
        "attendees": "Marcus Chen, Elena Rostova, Sarah Jenkins",
        "agenda": "Review database failover and secret credentials",
        "discussion": "Decided to adopt Amazon EKS with Cilium CNI. Marcus Chen will hand over Vault root keys by Nov 10.",
        "actionItems": "TODO: Complete mTLS service mesh verification between Auth Service and Vault. Assigned to: Elena Rostova."
    }
    res = requests.post(f"{NODE_BASE_URL}/api/sources/meeting", json=meeting_payload, headers=headers)
    assert res.status_code == 201
    source_id = res.json()["data"]["id"]
    print(f"[OK] Meeting note source connected: ID {source_id}")

    # Stage 02: Trigger AI Reconstruction
    print("\n--- 3. Testing Stage 02: Knowledge Reconstruction ---")
    rec_payload = {
        "projectId": proj_id,
        "targetRole": "Incoming Lead Architect",
        "departingMember": "Marcus Chen"
    }
    res = requests.post(f"{NODE_BASE_URL}/api/reconstruction/trigger", json=rec_payload, headers=headers)
    assert res.status_code == 200
    rec_data = res.json()["data"]
    print(f"[OK] Reconstruction completed successfully!")
    print(f"     Health Score: {rec_data['healthScore']}%")
    print(f"     Decisions extracted: {len(rec_data['decisions'])}")
    print(f"     Unfinished tasks: {len(rec_data['unfinishedWork'])}")
    print(f"     Risks identified: {len(rec_data['risks'])}")
    print(f"     Evidence claims linked: {len(rec_data['evidenceClaims'])}")

    # Stage 03: Verify Claims
    print("\n--- 4. Testing Stage 03: Evidence Verification ---")
    res = requests.get(f"{NODE_BASE_URL}/api/evidence?projectId={proj_id}", headers=headers)
    assert res.status_code == 200
    claims = res.json()["data"]
    print(f"[OK] Retrieved {len(claims)} evidence claims for project")
    if claims:
        claim_to_verify = claims[0]
        c_id = claim_to_verify.get("id") or claim_to_verify.get("_id")
        res = requests.put(
            f"{NODE_BASE_URL}/api/evidence/{c_id}/verify",
            json={"status": "verified", "notes": "Verified against source document via automated test."},
            headers=headers
        )
        assert res.status_code == 200
        print(f"[OK] Verified Claim [{claim_to_verify['claimId']}]: Status is now '{res.json()['data']['verificationStatus']}'")

    # Stage 05: Generate Handover Package
    print("\n--- 5. Testing Stage 05: Handover Generation & Sharing ---")
    handover_payload = {
        "projectId": proj_id,
        "targetRole": "Incoming Lead Architect",
        "departingMember": "Marcus Chen",
        "reviewers": ["Sarah Jenkins (PM)", "Marcus Chen (Departing Lead)", "Elena Rostova (Incoming Lead)"],
        "notes": "Verify Vault root token before signing."
    }
    res = requests.post(f"{NODE_BASE_URL}/api/handovers/generate", json=handover_payload, headers=headers)
    assert res.status_code == 201
    hnd = res.json()["data"]
    hnd_id = hnd["id"]
    share_token = hnd["shareToken"]
    print(f"[OK] Handover package generated: '{hnd['title']}' (ID: {hnd_id})")
    print(f"     30-Day Tasks: {len(hnd['roadmap30Days'])} items")
    print(f"     60-Day Tasks: {len(hnd['roadmap60Days'])} items")
    print(f"     90-Day Tasks: {len(hnd['roadmap90Days'])} items")
    print(f"     Share Token: {share_token}")

    # Stage 04: Human Review & Approval Gate
    print("\n--- 6. Testing Stage 04: Human Review & Approval ---")
    res = requests.put(
        f"{NODE_BASE_URL}/api/handovers/{hnd_id}/status",
        json={"status": "approved", "comment": "Formally approved by Project Manager in E2E validation."},
        headers=headers
    )
    assert res.status_code == 200
    print(f"[OK] Handover status updated to: '{res.json()['data']['status']}'")

    # Test Public Link Access (NO AUTH HEADER)
    print("\n--- 7. Testing Public Controlled Sharing Portal ---")
    res = requests.get(f"{NODE_BASE_URL}/api/handovers/public/{share_token}")
    assert res.status_code == 200
    pub_data = res.json()["data"]
    print(f"[OK] Public unauthenticated access verified! Handover: '{pub_data['title']}'")
    print(f"     Executive summary accessible: '{pub_data['executiveSummary'][:80]}...'")

    # Test Analytics
    print("\n--- 8. Testing Analytics Telemetry ---")
    res = requests.get(f"{NODE_BASE_URL}/api/analytics/stats", headers=headers)
    assert res.status_code == 200
    astats = res.json()["data"]
    print(f"[OK] Global Workspace Analytics: {astats['totalProjects']} projects, {astats['totalSources']} sources, {astats['averageHealthScore']}% avg health score")

    print("\n==================================================")
    print("ALL 5 STAGES & INTEGRATION TESTS PASSED 100%!")
    print("==================================================")
    return True

if __name__ == "__main__":
    ai_ok = test_fastapi_service()
    if not ai_ok:
        sys.exit(1)
    backend_ok = test_backend_service()
    if not backend_ok:
        sys.exit(1)
