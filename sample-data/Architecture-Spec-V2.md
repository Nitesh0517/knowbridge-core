# Falcon Platform Core Technical Specification (v2.4)

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
