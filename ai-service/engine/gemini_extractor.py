"""
Gemini Extraction Engine for KnowBridge AI
Leverages Google Gemini API (gemini-2.5-flash) with structured JSON generation
for high-precision Knowledge Reconstruction and Evidence Extraction.
Enforces strict grounding: no hallucination, explicit 'Insufficient Evidence' markings,
and verifiable source quote linkage.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

from .fallback_extractor import FallbackExtractor

logger = logging.getLogger("knowbridge.gemini")


class GeminiReconstructionEngine:
    """Interacts with Google Gemini for zero-shot structured project state reconstruction."""

    @classmethod
    def reconstruct_project(
        cls,
        project_name: str,
        project_description: str,
        sources: List[Dict[str, Any]],
        target_role: str = "General",
        departing_member: Optional[str] = None,
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs Gemini structured extraction. Falls back gracefully to heuristic extractor if unavailable."""
        active_api_key = api_key or os.getenv("GEMINI_API_KEY")

        if not active_api_key or not genai:
            logger.info("No Gemini API key provided or SDK missing. Using high-precision FallbackExtractor.")
            result = FallbackExtractor.extract_all(project_name, sources, target_role)
            result["engine_used"] = "heuristic_pattern_engine"
            return result

        try:
            client = genai.Client(api_key=active_api_key)

            # Build condensed source representation
            sources_summary = []
            for s in sources:
                content_sample = s.get("content", "")
                # Truncate per source if huge to avoid exceeding context
                if len(content_sample) > 25000:
                    content_sample = content_sample[:25000] + "\n...[truncated for context limits]..."

                sources_summary.append(
                    f"--- SOURCE ID: {s.get('id')} | NAME: {s.get('name')} | TYPE: {s.get('type')} ---\n"
                    f"{content_sample}\n"
                )

            compiled_sources = "\n\n".join(sources_summary)

            prompt = f"""
You are KnowBridge AI, an intelligent knowledge-handover platform designed to "Prevent Critical Knowledge From Leaving With People".
Your objective is to reconstruct the current true state of project '{project_name}' from the authorized sources below.

PROJECT CONTEXT:
Project Name: {project_name}
Project Description: {project_description}
Target Incoming Role: {target_role}
Departing Member: {departing_member or 'Unknown/Team Member'}

AUTHORIZED SOURCES CONTENT:
{compiled_sources}

CRITICAL RULES:
1. NEVER INVENT OR HALLUCINATE MISSING INFORMATION.
2. If evidence is insufficient for any attribute (such as decider, date, rationale, assignee, deadline), you MUST explicitly write "Insufficient Evidence".
3. Every claim, decision, task, and risk MUST include a verbatim 'evidence_excerpt' (an exact quote from the source text) and cite the exact 'source_name' and 'source_id'.
4. Differentiate between active tasks, technical blockers, and architectural decisions.
5. Identify any 'ownership_gap' where critical duties were handled solely by the departing member or have no assigned owner.
6. Return your analysis strictly as a valid JSON object matching the schema below.

JSON SCHEMA REQUIREMENT:
{{
  "project_name": "{project_name}",
  "health_score": <number between 0 and 100 representing overall documentation and transition readiness>,
  "summary": "<high-level executive state summary of where the project stands and key handover priorities>",
  "decisions": [
    {{
      "id": "DEC-001",
      "title": "<short descriptive title of the decision>",
      "decision": "<what was decided>",
      "date": "<date or 'Insufficient Evidence'>",
      "decider": "<who made it or 'Insufficient Evidence'>",
      "why": "<rationale recorded in source>",
      "alternatives_considered": ["<alternative 1>", "<alternative 2>"],
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>",
      "section_or_page": "<section, line, or page reference>",
      "confidence": <number 0.0 to 1.0>,
      "status": "active"
    }}
  ],
  "unfinished_work": [
    {{
      "id": "TSK-001",
      "title": "<task or feature title>",
      "description": "<details of unfinished work>",
      "type": "<pending_task | incomplete_feature | delayed_activity | unresolved_issue | missing_deliverable>",
      "priority": "<critical | high | medium | low>",
      "assigned_to": "<person or 'Insufficient Evidence'>",
      "ownership_status": "<assigned | unassigned | departing_owner>",
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>",
      "estimated_effort": "<estimate or 'Unknown'>"
    }}
  ],
  "ownership": [
    {{
      "id": "OWN-001",
      "role_or_domain": "<domain or module name>",
      "current_owner": "<current owner name or 'Insufficient Evidence'>",
      "handover_to": "{target_role}",
      "responsibilities": ["<responsibility 1>", "<responsibility 2>"],
      "key_contacts": ["<contact 1>"],
      "ownership_gap": <true if no owner or departing owner with no successor, else false>,
      "gap_risk_level": "<none | low | medium | high>",
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>"
    }}
  ],
  "dependencies": [
    {{
      "id": "DEP-001",
      "dependent_item": "<item that depends on something>",
      "depends_on": "<prerequisite item or service>",
      "type": "<task_dependency | technical_dependency | external_dependency>",
      "is_blocked": <true or false>,
      "blocker_details": "<reason if blocked or null>",
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>"
    }}
  ],
  "risks": [
    {{
      "id": "RSK-001",
      "title": "<risk title>",
      "description": "<risk description>",
      "category": "<technical | transition | operational | timeline | security>",
      "severity": "<critical | high | medium | low>",
      "probability": "<high | medium | low>",
      "mitigation": "<recommended mitigation>",
      "is_unresolved": true,
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>"
    }}
  ],
  "next_actions": [
    {{
      "id": "ACT-001",
      "action": "<specific immediate action for incoming {target_role}>",
      "priority": "<immediate | short_term | mid_term>",
      "target_role": "{target_role}",
      "timeline_phase": "<Day 1-30 | Day 31-60 | Day 61-90>",
      "dependencies": ["<dependency>"],
      "evidence_excerpt": "<exact quote from source>",
      "source_name": "<exact source name>",
      "source_id": "<exact source id>"
    }}
  ],
  "unresolved_questions": [
    {{
      "id": "QUE-001",
      "question": "<critical question needing clarification>",
      "reason": "<missing_information | contradictory_records | unclear_ownership | unknown_deadlines | unsupported_assumptions>",
      "insufficient_evidence": true,
      "impact": "<impact on project continuity>",
      "suggested_action": "<action to resolve>",
      "source_name": "<exact source name or 'Cross-Source Analysis'>"
    }}
  ],
  "evidence_claims": [
    {{
      "claim_id": "CLM-001",
      "claim_text": "<factual statement regarding project state>",
      "claim_category": "<decision | risk | dependency | unfinished_work | ownership | next_action>",
      "source_id": "<exact source id>",
      "source_name": "<exact source name>",
      "document_reference": "<section or document reference>",
      "page_or_section": "<page or line>",
      "relevant_excerpt": "<exact quote from source>",
      "confidence_score": 0.95,
      "verification_status": "unverified",
      "last_verified_date": null
    }}
  ]
}}
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )

            response_text = response.text.strip()
            # Clean possible markdown fence
            if response_text.startswith("```"):
                lines = response_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                response_text = "\n".join(lines).strip()

            parsed_data = json.loads(response_text)

            # Calculate stats
            parsed_data["stats"] = {
                "source_count": len(sources),
                "decision_count": len(parsed_data.get("decisions", [])),
                "task_count": len(parsed_data.get("unfinished_work", [])),
                "risk_count": len(parsed_data.get("risks", [])),
                "dependency_count": len(parsed_data.get("dependencies", [])),
                "unresolved_question_count": len(parsed_data.get("unresolved_questions", [])),
                "evidence_claim_count": len(parsed_data.get("evidence_claims", [])),
                "unassigned_tasks": sum(1 for t in parsed_data.get("unfinished_work", []) if t.get("ownership_status") == "unassigned")
            }
            parsed_data["engine_used"] = "google_gemini_2_5_flash"
            return parsed_data

        except Exception as e:
            logger.error(f"Gemini API error during reconstruction: {str(e)}. Falling back to local pattern engine.")
            fallback_res = FallbackExtractor.extract_all(project_name, sources, target_role)
            fallback_res["engine_used"] = "heuristic_pattern_engine_fallback"
            fallback_res["engine_error"] = str(e)
            return fallback_res
