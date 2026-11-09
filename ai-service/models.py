"""
Pydantic Schemas for KnowBridge AI
Defines strict structured models for knowledge reconstruction, evidence linking, and handovers.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SourceInput(BaseModel):
    id: str
    name: str
    type: str  # pdf, docx, txt, md, github, meeting_note, decision_log, task_import
    content: str
    metadata: Optional[Dict[str, Any]] = None
    sections: Optional[List[Dict[str, Any]]] = None


class ReconstructionRequest(BaseModel):
    project_id: str
    project_name: str
    project_description: str
    sources: List[SourceInput]
    target_role: Optional[str] = "Incoming Member / General"
    departing_member: Optional[str] = None
    gemini_api_key: Optional[str] = None


class DecisionItem(BaseModel):
    id: str
    title: str
    decision: str
    date: Optional[str] = "Insufficient Evidence"
    decider: Optional[str] = "Insufficient Evidence"
    why: str
    alternatives_considered: Optional[List[str]] = Field(default_factory=list)
    evidence_excerpt: str
    source_name: str
    source_id: str
    section_or_page: Optional[str] = "General"
    confidence: float = 0.85
    status: str = "active"


class UnfinishedWorkItem(BaseModel):
    id: str
    title: str
    description: str
    type: str = "pending_task"  # pending_task, incomplete_feature, delayed_activity, unresolved_issue, missing_deliverable
    priority: str = "high"  # critical, high, medium, low
    assigned_to: Optional[str] = "Insufficient Evidence"
    ownership_status: str = "assigned"  # assigned, unassigned, departing_owner
    evidence_excerpt: str
    source_name: str
    source_id: str
    estimated_effort: Optional[str] = "Unknown"


class OwnershipItem(BaseModel):
    id: str
    role_or_domain: str
    current_owner: str
    handover_to: Optional[str] = "Incoming Member"
    responsibilities: List[str] = Field(default_factory=list)
    key_contacts: List[str] = Field(default_factory=list)
    ownership_gap: bool = False
    gap_risk_level: str = "none"  # none, low, medium, high
    evidence_excerpt: str
    source_name: str
    source_id: str


class DependencyItem(BaseModel):
    id: str
    dependent_item: str
    depends_on: str
    type: str = "technical_dependency"  # task_dependency, technical_dependency, external_dependency
    is_blocked: bool = False
    blocker_details: Optional[str] = None
    evidence_excerpt: str
    source_name: str
    source_id: str


class RiskItem(BaseModel):
    id: str
    title: str
    description: str
    category: str = "technical"  # technical, transition, operational, timeline, security
    severity: str = "medium"  # critical, high, medium, low
    probability: str = "medium"  # high, medium, low
    mitigation: str
    is_unresolved: bool = True
    evidence_excerpt: str
    source_name: str
    source_id: str


class NextActionItem(BaseModel):
    id: str
    action: str
    priority: str = "immediate"  # immediate, short_term, mid_term
    target_role: str
    timeline_phase: str = "Day 1-30"  # Day 1-30, Day 31-60, Day 61-90
    dependencies: List[str] = Field(default_factory=list)
    evidence_excerpt: str
    source_name: str
    source_id: str


class UnresolvedQuestionItem(BaseModel):
    id: str
    question: str
    reason: str  # missing_information, contradictory_records, unclear_ownership, unknown_deadlines, unsupported_assumptions
    insufficient_evidence: bool = True
    impact: str
    suggested_action: str
    source_name: Optional[str] = "System Analysis"


class EvidenceClaim(BaseModel):
    claim_id: str
    claim_text: str
    claim_category: str  # decision, risk, dependency, unfinished_work, ownership, next_action
    source_id: str
    source_name: str
    document_reference: str
    page_or_section: str
    relevant_excerpt: str
    confidence_score: float = 0.85
    verification_status: str = "unverified"  # verified, unverified, flagged
    last_verified_date: Optional[str] = None


class ReconstructionResponse(BaseModel):
    project_id: str
    project_name: str
    health_score: int
    summary: str
    decisions: List[DecisionItem]
    unfinished_work: List[UnfinishedWorkItem]
    ownership: List[OwnershipItem]
    dependencies: List[DependencyItem]
    risks: List[RiskItem]
    next_actions: List[NextActionItem]
    unresolved_questions: List[UnresolvedQuestionItem]
    evidence_claims: List[EvidenceClaim]
    stats: Dict[str, Any]
