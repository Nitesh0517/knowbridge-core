"""
Pitch Deck Generator for KnowBridge AI
Generates a 16:9 widescreen PowerPoint presentation (.pptx)
styled with KnowBridge brand identity: Deep Navy, Royal Blue, Cyan, and Violet.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "KnowBridge_AI_Hackathon_Pitch_Deck.pptx")

# Brand Color Palette
C_NAVY_950 = RGBColor(7, 13, 30)
C_NAVY_900 = RGBColor(15, 23, 42)
C_NAVY_800 = RGBColor(23, 37, 84)
C_ROYAL = RGBColor(37, 99, 235)
C_CYAN = RGBColor(6, 182, 212)
C_VIOLET = RGBColor(124, 58, 237)
C_WHITE = RGBColor(255, 255, 255)
C_SLATE_50 = RGBColor(248, 250, 252)
C_SLATE_100 = RGBColor(241, 245, 249)
C_SLATE_200 = RGBColor(226, 232, 240)
C_SLATE_500 = RGBColor(100, 116, 139)
C_SLATE_600 = RGBColor(71, 85, 105)
C_SLATE_700 = RGBColor(51, 65, 85)
C_SLATE_800 = RGBColor(30, 41, 59)
C_EMERALD = RGBColor(22, 163, 74)
C_AMBER = RGBColor(245, 158, 11)
C_ROSE = RGBColor(220, 38, 38)

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Helper: Add background color
    def set_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    # Helper: Add card shape
    def add_card(slide, left, top, width, height, fill_color, border_color=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = fill_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # Helper: Add header on light slides
    def add_slide_header(slide, tag_text, title_text, subtitle_text):
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(8), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag_text.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11), Inches(0.7))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_950

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.5), Inches(0.5))
        tf = sub_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = subtitle_text
        p.font.size = Pt(12)
        p.font.color.rgb = C_SLATE_600

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE (Dark Enterprise Theme)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, C_NAVY_950)

    # Accent decorative glow bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.6), Inches(0.1), Inches(4.2))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_CYAN
    bar.line.fill.background()

    # Pill badge
    pill = add_card(s1, 1.1, 1.6, 4.2, 0.45, C_NAVY_900, C_CYAN)
    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.65), Inches(4.0), Inches(0.35))
    p = tb.text_frame.paragraphs[0]
    p.text = "INDIVIDUAL HACKATHON SUBMISSION"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # Project Title
    tb_title = s1.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(10.5), Inches(1.4))
    tf = tb_title.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "KnowBridge AI"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Intelligent Knowledge Handover & Continuity Platform"
    p2.font.size = Pt(20)
    p2.font.color.rgb = C_CYAN

    # Tagline & Problem Statement Box
    box_stmt = add_card(s1, 1.1, 3.8, 11.0, 1.6, C_NAVY_900, C_ROYAL)
    tb_stmt = s1.shapes.add_textbox(Inches(1.3), Inches(3.9), Inches(10.6), Inches(1.4))
    tf = tb_stmt.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = 'TAGLINE: "Never Lose Knowledge. Never Lose Momentum."'
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p_prob = tf.add_paragraph()
    p_prob.text = 'HACKATHON PROBLEM STATEMENT: "Prevent Critical Knowledge From Leaving With People."'
    p_prob.font.size = Pt(12)
    p_prob.font.bold = True
    p_prob.font.color.rgb = C_AMBER

    p_desc = tf.add_paragraph()
    p_desc.text = 'Reconstructs ground-truth project state from multi-format documents, meeting notes, and GitHub into evidence-linked, role-tailored 30-60-90 day continuation roadmaps guarded by a 4-eye human review gate.'
    p_desc.font.size = Pt(11)
    p_desc.font.color.rgb = C_SLATE_200

    # Presenter / Repo Info Footer
    tb_footer = s1.shapes.add_textbox(Inches(1.1), Inches(6.0), Inches(11.0), Inches(0.6))
    tf = tb_footer.text_frame
    p = tf.paragraphs[0]
    p.text = "Presenter: Nitesh Kumar Barnwal  |  GitHub: github.com/Nitesh0517/knowbridge-core  |  Stack: React 19 + Node.js + FastAPI + Gemini 2.5 Flash"
    p.font.size = Pt(10)
    p.font.color.rgb = C_SLATE_500

    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM (The Silent Brain Drain)
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, C_SLATE_50)
    add_slide_header(s2, "The Core Dilemma", "When People Leave, Critical Knowledge Disappears With Them",
                     "Even when documentation exists, institutional context remains scattered across tickets, PDFs, meeting minutes, and code commits.")

    # 3 Problem Cards
    cards_data = [
      ("Untraceable Decisions",
       "Why was a specific framework or database chosen? Why was an alternative rejected?\n\nIncoming engineers waste weeks re-debating settled questions because the original rationale was never formalized in accessible ADRs.",
       C_ROSE),
      ("Unfinished Work Loses Ownership",
       "Pending deliverables, incomplete features, and undocumented edge-case fixes fall through the cracks.\n\nWithout explicit ownership mapping, silent dependencies stay neglected until a production incident surfaces them.",
       C_AMBER),
      ("Prolonged Onboarding Friction",
       "New team members take 3 to 6 months to achieve full operational velocity.\n\nThey remain heavily dependent on ad-hoc chats with departed members, creating immense vulnerability during team transitions.",
       C_ROYAL)
    ]

    for idx, (head, body, acc_col) in enumerate(cards_data):
        c_left = 0.8 + idx * 4.0
        card = add_card(s2, c_left, 2.1, 3.7, 4.5, C_WHITE, C_SLATE_200)

        # Top accent bar inside card
        acc = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(c_left), Inches(2.1), Inches(3.7), Inches(0.12))
        acc.fill.solid()
        acc.fill.fore_color.rgb = acc_col
        acc.line.fill.background()

        tb = s2.shapes.add_textbox(Inches(c_left + 0.25), Inches(2.4), Inches(3.2), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_950

        p_body = tf.add_paragraph()
        p_body.text = body
        p_body.font.size = Pt(11)
        p_body.font.color.rgb = C_SLATE_600

    # -------------------------------------------------------------
    # SLIDE 3: THE SOLUTION: KNOWBRIDGE AI
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, C_SLATE_50)
    add_slide_header(s3, "Product Philosophy", "KnowBridge AI: Archaeology, Not Generic Chatbots",
                     "Why simple LLM summarizers fail and how KnowBridge establishes verifiable ground-truth.")

    # Left: What Generic Chatbots Do (Flawed)
    c_fail = add_card(s3, 0.8, 2.1, 5.6, 4.6, C_WHITE, C_ROSE)
    tb_fail = s3.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.2), Inches(4.2))
    tf = tb_fail.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ Why Generic Chatbots & Summarizers Fail"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_ROSE

    fail_points = [
      "Frequent Hallucinations: Models guess missing dates, deciders, or deadlines when context is sparse.",
      "No Audit Trail: Summaries provide statements with zero direct line/page citation to raw documents.",
      "No Human Review Gate: Output is generated blindly without sign-off from departing leads or PMs.",
      "One-Size-Fits-All: Produces generic prose instead of role-tailored (Frontend, Backend, DevOps, PM) action roadmaps.",
      "Ephemeral Context: Does not identify tacit bottlenecks like master decryption keys or single-point maintainers."
    ]
    for pt in fail_points:
        p_item = tf.add_paragraph()
        p_item.text = f"• {pt}"
        p_item.font.size = Pt(10.5)
        p_item.font.color.rgb = C_SLATE_700

    # Right: What KnowBridge AI Delivers (Grounded)
    c_win = add_card(s3, 6.9, 2.1, 5.6, 4.6, C_WHITE, C_EMERALD)
    tb_win = s3.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.2), Inches(4.2))
    tf = tb_win.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✅ The KnowBridge AI Grounding Paradigm"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    win_points = [
      "Strict Zero-Hallucination Policy: Missing or conflicting evidence is explicitly labeled 'Insufficient Evidence'.",
      "Verbatim Quote Grounding: Every claim links to exact excerpts and page numbers from PDFs, Word docs, and commits.",
      "Multi-Source Archaeology: Ingests PDF (PyMuPDF), DOCX (python-docx), real GitHub REST API v3, and meeting logs.",
      "4-Eye Human Approval Gate: Departing members and PMs audit, flag, and digitally sign off on handovers.",
      "Role-Tailored 30-60-90 Day Roadmaps: Actionable continuation milestones customized for incoming engineers.",
      "Controlled Tokenized Sharing: Secure, time-limited cryptographic access portals for incoming members."
    ]
    for pt in win_points:
        p_item = tf.add_paragraph()
        p_item.text = f"• {pt}"
        p_item.font.size = Pt(10.5)
        p_item.font.color.rgb = C_SLATE_700

    # -------------------------------------------------------------
    # SLIDE 4: THE 5 ESSENTIAL STAGES PIPELINE
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, C_SLATE_50)
    add_slide_header(s4, "Core User Experience", "The 5 Essential Stages of Continuity",
                     "A disciplined engineering lifecycle turning fragmented records into verified, executable onboarding packages.")

    stages_data = [
      ("01", "CONNECT", "Authorized Ingestion",
       "PDF (PyMuPDF), DOCX (python-docx), Markdown, plain text, and real GitHub REST API v3 commits/issues. Native ADR and meeting logs.",
       C_ROYAL),
      ("02", "RECONSTRUCT", "Gemini 2.5 Flash",
       "Synthesizes Decisions, Unfinished Tasks, Ownership Gaps, Risks, and Dependencies. Zero-hallucination 'Insufficient Evidence' checks.",
       C_CYAN),
      ("03", "VERIFY", "Evidence Grounding",
       "Indexes claims with exact verbatim excerpts and confidence ratings. 1-click human verification slide-over to audit source context.",
       C_VIOLET),
      ("04", "REVIEW", "4-Eye Human Gate",
       "Departing leads and PMs inspect synthesized packages, request revisions, or provide digital timestamped sign-off seals.",
       C_AMBER),
      ("05", "HANDOVER", "Continuation Plan",
       "Role-tailored 30-60-90 day roadmap. Controlled cryptographic share tokens (/handover/view/:token) for incoming member clarity.",
       C_EMERALD),
    ]

    for idx, (num, title, sub, desc, col) in enumerate(stages_data):
        c_left = 0.8 + idx * 2.4
        card = add_card(s4, c_left, 2.2, 2.25, 4.4, C_WHITE, col)

        # Number badge
        nb = add_card(s4, c_left + 0.15, 2.35, 0.7, 0.5, col)
        tb_num = s4.shapes.add_textbox(Inches(c_left + 0.15), Inches(2.35), Inches(0.7), Inches(0.5))
        p = tb_num.text_frame.paragraphs[0]
        p.text = num
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

        # Stage titles
        tb = s4.shapes.add_textbox(Inches(c_left + 0.15), Inches(3.0), Inches(1.95), Inches(3.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_950

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(9.5)
        p_sub.font.bold = True
        p_sub.font.color.rgb = col

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(9)
        p_desc.font.color.rgb = C_SLATE_600

    # -------------------------------------------------------------
    # SLIDE 5: SYSTEM ARCHITECTURE & TECH STACK
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, C_SLATE_50)
    add_slide_header(s5, "Engineering Architecture", "Production-Ready Multi-Tier Cloud Topology",
                     "Decoupled React 19 Frontend, Express REST Backend, and FastAPI AI Engine with dual-mode database persistence.")

    tiers = [
      ("React 19 Frontend Application",
       "Vite • Tailwind CSS • Lucide React • Recharts • Framer Motion • Axios\n\n18 production routes including Landing Page, Dashboard, Project Workspaces, Source Ingestion, Decision Timeline, Tasks Matrix, Evidence Registry, Approvals Gate, and Public Handover Portal.",
       C_ROYAL),
      ("Node.js 24 REST API Backend",
       "Express.js • Mongoose • Multer (Uploads) • Firebase Admin JWT Verification\n\nDual-mode persistence engine: connects to MongoDB Atlas in cloud deployment with automatic resilient local file-store persistence for 100% offline hackathon demonstration.",
       C_EMERALD),
      ("Python 3.14 FastAPI AI Engine",
       "FastAPI • Uvicorn • Google Gemini 2.5 Flash SDK • PyMuPDF • python-docx\n\nDedicated document parsing microservice. Extracts page counts, character offsets, and runs zero-shot structured JSON extraction with deterministic NLP fallback.",
       C_CYAN),
      ("Security & Integration Layer",
       "GitHub REST API v3 Client • Firebase Auth • Cryptographic Share Tokens\n\nLive authorized GitHub integration auditing commits, PRs, and issues. Tenant workspace isolation with 90-day expiring UUIDv4 tokens for controlled public handover sharing.",
       C_VIOLET)
    ]

    for idx, (title, desc, col) in enumerate(tiers):
        row = idx // 2
        col_idx = idx % 2
        c_left = 0.8 + col_idx * 5.9
        c_top = 2.2 + row * 2.3

        card = add_card(s5, c_left, c_top, 5.6, 2.1, C_WHITE, C_SLATE_200)

        # Left indicator
        ind = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(c_left), Inches(c_top), Inches(0.1), Inches(2.1))
        ind.fill.solid()
        ind.fill.fore_color.rgb = col
        ind.line.fill.background()

        tb = s5.shapes.add_textbox(Inches(c_left + 0.25), Inches(c_top + 0.15), Inches(5.1), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_950

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = C_SLATE_600

    # -------------------------------------------------------------
    # SLIDE 6: COMPETITIVE ADVANTAGE
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, C_SLATE_50)
    add_slide_header(s6, "Competitive Differentiation", "Why KnowBridge AI Wins Over Existing Tools",
                     "Comparison against generic LLMs, document summarizers, and enterprise wikis.")

    # Table layout
    table_shape = s6.shapes.add_table(6, 5, Inches(0.8), Inches(2.2), Inches(11.7), Inches(4.5))
    table = table_shape.table

    # Column widths
    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(2.0)
    table.columns[2].width = Inches(2.0)
    table.columns[3].width = Inches(2.0)
    table.columns[4].width = Inches(2.5)

    headers = ["Evaluation Metric", "ChatGPT / LLM", "Doc Summarizers", "Confluence / Notion", "KnowBridge AI"]
    for col_i, text in enumerate(headers):
        cell = table.cell(0, col_i)
        cell.text = text
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_NAVY_900 if col_i < 4 else C_ROYAL
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER if col_i > 0 else PP_ALIGN.LEFT

    matrix_rows = [
      ("Zero-Hallucination Grounding", "❌ Hallucinates", "❌ Hallucinates", "⚠️ Static Text", "✅ Strict 'Insufficient Evidence'"),
      ("Verbatim Quote & Page Citation", "❌ No Citations", "⚠️ High-level only", "❌ Manual links", "✅ Exact Excerpts + Line/Page"),
      ("Real GitHub REST API v3 Audit", "❌ No Integration", "❌ Text Only", "⚠️ Basic webhook", "✅ Real Commits, Issues & PRs"),
      ("30-60-90 Day Role-Tailored Plan", "⚠️ Generic prose", "❌ Summary only", "❌ Blank template", "✅ Auto-Phased by Role (FE/BE/PM)"),
      ("4-Eye Digital Sign-off Gate", "❌ None", "❌ None", "⚠️ Page edit log", "✅ Timestamped Human Approval")
    ]

    for row_i, row_data in enumerate(matrix_rows, start=1):
        for col_i, text in enumerate(row_data):
            cell = table.cell(row_i, col_i)
            cell.text = text
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_WHITE if col_i < 4 else C_CYAN if row_i % 2 == 0 else C_SLATE_50
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(10)
            if col_i == 4:
                p.font.bold = True
                p.font.color.rgb = C_NAVY_950
            else:
                p.font.color.rgb = C_SLATE_800
            p.alignment = PP_ALIGN.CENTER if col_i > 0 else PP_ALIGN.LEFT

    # -------------------------------------------------------------
    # SLIDE 7: VERIFICATION & DEMO RESULTS (Conclusion)
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, C_NAVY_950)

    pill7 = add_card(s7, 0.8, 0.7, 3.5, 0.45, C_NAVY_900, C_CYAN)
    tb = s7.shapes.add_textbox(Inches(0.9), Inches(0.75), Inches(3.3), Inches(0.35))
    p = tb.text_frame.paragraphs[0]
    p.text = "TESTED & VERIFIED SYSTEM"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # Title
    tb_title7 = s7.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tf = tb_title7.text_frame
    p = tf.paragraphs[0]
    p.text = "100% Tested, Verified, and Ready for Deployment"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    # 3 Summary Cards
    c1 = add_card(s7, 0.8, 2.3, 3.6, 3.6, C_NAVY_900, C_CYAN)
    tb1 = s7.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(3.2), Inches(3.2))
    tf = tb1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🧪 100% E2E Test Suite"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p_body = tf.add_paragraph()
    p_body.text = "• All 5 stages validated via test_e2e.py\n• FastAPI AI health check passed\n• Real PyMuPDF & python-docx extraction verified\n• Express backend endpoints passing\n• Public tokenized link verified with zero auth leakage"
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = C_SLATE_200

    c2 = add_card(s7, 4.8, 2.3, 3.6, 3.6, C_NAVY_900, C_ROYAL)
    tb2 = s7.shapes.add_textbox(Inches(5.0), Inches(2.5), Inches(3.2), Inches(3.2))
    tf = tb2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🌐 Multi-Track Impact"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_ROYAL
    p_body = tf.add_paragraph()
    p_body.text = "• Enterprise Squads: Prevent brain drain during architect turnover\n• Student Teams: Seamless capstone handover across academic cohorts\n• Research Labs: Preserve experiment protocols and dataset configurations\n• Startups: Protect early architecture context as team scales rapidly"
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = C_SLATE_200

    c3 = add_card(s7, 8.8, 2.3, 3.7, 3.6, C_NAVY_900, C_EMERALD)
    tb3 = s7.shapes.add_textbox(Inches(9.0), Inches(2.5), Inches(3.3), Inches(3.2))
    tf = tb3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🚀 GitHub & Submission"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p_body = tf.add_paragraph()
    p_body.text = "• Clean Repository: github.com/Nitesh0517/knowbridge-core\n• Sample Data Included: sample-data/ with real PDF, Word DOCX, & Markdown\n• 1-Click Evaluation: Built-in 'Instant Demo Access' button\n• MIT License: Open and extensible enterprise SaaS foundation"
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = C_SLATE_200

    # Bottom Tagline
    tb_tag = s7.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.6))
    tf = tb_tag.text_frame
    p = tf.paragraphs[0]
    p.text = 'KnowBridge AI — "Never Lose Knowledge. Never Lose Momentum."'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.alignment = PP_ALIGN.CENTER

    prs.save(OUTPUT_FILE)
    print(f"Presentation generated successfully: {OUTPUT_FILE}")

if __name__ == "__main__":
    create_deck()
