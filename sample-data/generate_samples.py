"""
Sample Data Generator for KnowBridge AI
Generates realistic multi-format documents (PDF, DOCX, MD, TXT)
demonstrating knowledge loss scenarios: decisions, unfinished work, ownership gaps,
and dependencies for instant platform testing.
"""

import os
import fitz
import docx

SAMPLE_DIR = os.path.dirname(os.path.abspath(__file__))

def create_sample_pdf():
    pdf_path = os.path.join(SAMPLE_DIR, "ADR-007-Database-Cutover-Strategy.pdf")
    doc = fitz.open()

    # Page 1
    page1 = doc.new_page()
    text1 = """ARCHITECTURAL DECISION RECORD: ADR-007
Project: Falcon Real-Time Clearing Engine
Title: Zero-Downtime CDC Streaming & Sharded Database Cutover
Date: 2025-10-14
Decider: Dr. Aris Thorne (Departing Chief Architect)
Status: Approved

1. EXECUTIVE CONTEXT & MOTIVATION
Our primary transaction database currently experiences lock contention above 8,500 TPS.
To support European market expansion, we must transition to horizontally partitioned
PostgreSQL clusters using Debezium change-data-capture (CDC) pipelines.

2. ARCHITECTURAL DECISION
We decided to deploy Debezium CDC connectors with Apache Kafka and ScyllaDB for idempotency
caching, rather than batch ETL replication or AWS DMS.
Rationale: Debezium delivers sub-15ms replication lag and guarantees strict FIFO ordering.
Alternatives Considered:
- AWS Database Migration Service (DMS): Disqualified due to lack of schema evolution guarantees.
- Custom polling scripts: Rejected due to excessive read replica overhead.
"""
    page1.insert_text((50, 60), text1, fontsize=10)

    # Page 2
    page2 = doc.new_page()
    text2 = """3. UNFINISHED WORK & OUTSTANDING CRITICAL TASKS
TODO: The multi-region Kafka replication mirror-maker is still unconfigured.
Blocked by: Network latency spikes across us-east-1 and eu-central-1.
Priority: Critical Blocker for Q4 Cutover.
Assigned to: Insufficient Evidence.

Incomplete: Consumer group idempotency deduplication key is not yet implemented
in the settlement worker.
Owner: Dr. Aris Thorne (Departing).

4. RISKS & DEPENDENCIES
Risk: High risk of data divergence if the primary sequence numbers skip during failover.
Mitigation: Deploy dual-write verification shadow proxy for 72 hours prior to cutover.
Single Point of Failure: Aris Thorne is the sole administrator holding the master
GPG decryption key for production database backups. Immediate key rotation required."""
    page2.insert_text((50, 60), text2, fontsize=10)

    doc.save(pdf_path)
    doc.close()
    print(f"Generated PDF: {pdf_path}")

def create_sample_docx():
    docx_path = os.path.join(SAMPLE_DIR, "Falcon-Sprint26-Handoff-Notes.docx")
    doc = docx.Document()

    doc.add_heading('Falcon Engine: Sprint 26 Engineering Transition & Handoff Notes', 0)
    p = doc.add_paragraph('Date: October 22, 2025 | Facilitator: Rachel Vance (VP Engineering)')
    p.italic = True

    doc.add_heading('1. Departing Member Scope of Work', level=1)
    doc.add_paragraph(
        'Dr. Aris Thorne is stepping down on November 10. All architectural governance, '
        'settlement routing rules, and regulatory audit interfaces must be transitioned to the incoming lead.'
    )

    doc.add_heading('2. Critical Decisions Made in Sprint 26', level=1)
    doc.add_paragraph(
        'Decided to: Enforce HMAC-SHA256 signature verification on all partner webhook callbacks. '
        'Decider: Dr. Aris Thorne. '
        'Date: 2025-10-22. '
        'Why: Penetration testing report flagged replay attack vulnerability in staging webhook endpoint.'
    )

    doc.add_heading('3. Unfinished Deliverables & Backlog Items', level=1)
    doc.add_paragraph('The following tasks remain incomplete as of sprint closure:')
    doc.add_paragraph('• TODO: Implement automated dead-letter queue re-drive Lambda function. Priority: High. Assigned to: Unassigned.')
    doc.add_paragraph('• Incomplete: Finalize OpenAPI 3.1 specification for partner bank reconciliation API.')
    doc.add_paragraph('• Pending: Load test Kafka broker under 20,000 synthetic transaction spikes.')

    doc.add_heading('4. Unresolved Questions & Missing Evidence', level=1)
    doc.add_paragraph('• Open question: Who holds the credentials for the staging SWIFT sandbox certificate?')
    doc.add_paragraph('• Unclear: Unknown SLA requirements for weekend settlement window processing.')

    doc.save(docx_path)
    print(f"Generated DOCX: {docx_path}")

def create_sample_md():
    md_path = os.path.join(SAMPLE_DIR, "Architecture-Spec-V2.md")
    content = """# Falcon Platform Core Technical Specification (v2.4)

## Architecture Overview
The Falcon platform provides resilient, low-latency financial clearing services.
The system consists of three primary subsystems:
1. Ingress Gateway (Rust / Actix-Web)
2. Clearing Engine & State Machine (Go / Temporal)
3. Audit & Ledger Store (PostgreSQL / TimescaleDB)

## Key System Decisions
- Decided to adopt Temporal workflow orchestration for long-running two-phase settlement transactions.
  Decider: Dr. Aris Thorne.
  Date: 2025-09-05.
  Rationale: Built-in state machine recovery and deterministic replay prevent financial double-spending.
  Alternatives considered: AWS Step Functions, custom state tables in PostgreSQL.

## Active Dependencies & Blockers
- The Ingress Gateway depends on the Token Authorization Service (v3 API).
- Blocked: Clearing Engine performance tests are blocked until the synthetic market simulator is provisioned.

## Ownership Matrix
- Ingress Gateway: Maya Patel (Active)
- Clearing State Machine: Dr. Aris Thorne (Departing -> Handover Required)
- Ledger Integrity: Marcus Vance (Active)
- Disaster Recovery Failover: Unassigned (High Risk Gap)
"""
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated MD: {md_path}")

if __name__ == "__main__":
    create_sample_pdf()
    create_sample_docx()
    create_sample_md()
    print("All sample files generated successfully!")
