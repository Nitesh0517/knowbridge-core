"""
Document Parser Module for KnowBridge AI
Extracts structured text, pages, headings, and metadata from PDF, DOCX, TXT, and Markdown documents.
Preserves character spans, page references, and section hierarchies for evidence linkage.
"""

import os
from typing import List, Dict, Any, Optional

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    import docx
except ImportError:
    docx = None


class DocumentParser:
    """Parser for heterogeneous document types with evidence location tracking."""

    @staticmethod
    def parse_pdf(file_path: str) -> Dict[str, Any]:
        """Extracts text from PDF by page using PyMuPDF (fitz) with fallback."""
        if not fitz:
            raise RuntimeError("PyMuPDF (fitz) is not installed.")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        doc = fitz.open(file_path)
        pages_content = []
        total_text = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            if text:
                pages_content.append({
                    "page_number": page_num + 1,
                    "text": text,
                    "char_count": len(text)
                })
                total_text.append(f"--- PAGE {page_num + 1} ---\n{text}")

        meta = doc.metadata or {}
        doc.close()

        full_content = "\n\n".join(total_text)
        return {
            "file_name": os.path.basename(file_path),
            "file_type": "pdf",
            "page_count": len(pages_content),
            "total_chars": len(full_content),
            "content": full_content,
            "pages": pages_content,
            "metadata": {
                "title": meta.get("title", ""),
                "author": meta.get("author", ""),
                "subject": meta.get("subject", ""),
            }
        }

    @staticmethod
    def parse_docx(file_path: str) -> Dict[str, Any]:
        """Extracts text and structure from DOCX files."""
        if not docx:
            raise RuntimeError("python-docx is not installed.")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        doc = docx.Document(file_path)
        sections = []
        full_paragraphs = []
        current_heading = "Introduction"

        for p in doc.paragraphs:
            text = p.text.strip()
            if not text:
                continue
            if p.style.name.startswith("Heading"):
                current_heading = text
            sections.append({
                "section": current_heading,
                "text": text,
                "style": p.style.name
            })
            full_paragraphs.append(text)

        # Include tables if any
        table_rows = []
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    table_rows.append(row_text)

        if table_rows:
            full_paragraphs.append("\n--- TABLE DATA ---\n" + "\n".join(table_rows))

        full_content = "\n\n".join(full_paragraphs)
        return {
            "file_name": os.path.basename(file_path),
            "file_type": "docx",
            "page_count": max(1, len(full_paragraphs) // 5),
            "total_chars": len(full_content),
            "content": full_content,
            "sections": sections,
            "metadata": {
                "headings_found": len([s for s in sections if s.get("style", "").startswith("Heading")])
            }
        }

    @staticmethod
    def parse_txt_or_md(file_path: str) -> Dict[str, Any]:
        """Extracts text from plain text or Markdown files."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        file_ext = os.path.splitext(file_path)[1].lower().replace(".", "")
        lines = content.splitlines()

        sections = []
        current_section = "General"
        for line in lines:
            line_str = line.strip()
            if line_str.startswith("#"):
                current_section = line_str.lstrip("#").strip()
            if line_str:
                sections.append({
                    "section": current_section,
                    "text": line_str
                })

        return {
            "file_name": os.path.basename(file_path),
            "file_type": file_ext if file_ext in ["txt", "md"] else "txt",
            "page_count": max(1, len(lines) // 40),
            "total_chars": len(content),
            "content": content,
            "sections": sections,
            "metadata": {
                "line_count": len(lines)
            }
        }

    @classmethod
    def parse_file(cls, file_path: str) -> Dict[str, Any]:
        """Autodetects extension and calls appropriate parser."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return cls.parse_pdf(file_path)
        elif ext in [".docx", ".doc"]:
            return cls.parse_docx(file_path)
        elif ext in [".txt", ".md", ".markdown", ".log", ".json", ".csv"]:
            return cls.parse_txt_or_md(file_path)
        else:
            # Fallback to plain text read
            return cls.parse_txt_or_md(file_path)
