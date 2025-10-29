#!/usr/bin/env python3
"""
PDF to Markdown Converter
Converts PDF files to Markdown format with image extraction and bibliography handling.
"""

import os
import re
import fitz  # PyMuPDF
from pathlib import Path
import markdown


def normalize_citation(citation):
    """Normalize citation text for consistent matching and deduplication."""
    return re.sub(r'\s+', ' ', citation.strip()).lower()


def generate_table_of_contents(markdown_content):
    """Generate a table of contents from markdown headers."""
    lines = markdown_content.split('\n')
    toc_lines = []
    headers = []
    main_title_found = False

    for line in lines:
        # Match headers from # to ######
        header_match = re.match(r'^(#{1,6})\s+(.+)', line.strip())
        if header_match:
            level = len(header_match.group(1))
            title = header_match.group(2).strip()

            # Skip the main title (# ) - it's the first H1 we encounter
            if level == 1 and not main_title_found:
                main_title_found = True
                continue

            # Skip bibliography section
            if 'bibliografia' in title.lower():
                continue

            # Create anchor link (simplified)
            anchor = re.sub(r'[^\w\s-]', '', title).lower().replace(' ', '-')

            # Add to TOC with proper indentation (adjusting for H1 being skipped)
            indent_level = max(0, level - 2) if level > 1 else 0
            indent = '  ' * indent_level
            toc_lines.append(f'{indent}- [{title}](#{anchor})')

            headers.append((level, title, anchor))

    if toc_lines:
        toc = '## Indice\n\n' + '\n'.join(toc_lines) + '\n\n---\n\n'
        return toc
    return ''


def extract_images_from_page(page, page_num, output_dir, extracted_images_hashes):
    """Extract images from a PDF page and save them to the output directory.
    Avoids extracting duplicate images by checking image hashes."""
    import hashlib

    images = page.get_images(full=True)
    image_paths = []

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = page.parent.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]

        # Calculate hash to check for duplicates
        image_hash = hashlib.md5(image_bytes).hexdigest()

        # Check if this image was already extracted
        if image_hash in extracted_images_hashes:
            # Use the existing image path
            existing_filename = extracted_images_hashes[image_hash]
            image_paths.append(existing_filename)
            continue

        # Create image filename (now global counter instead of page-specific)
        image_filename = f"image_{len(extracted_images_hashes)+1:03d}.{image_ext}"
        image_path = os.path.join(output_dir, image_filename)

        # Save image
        with open(image_path, "wb") as img_file:
            img_file.write(image_bytes)

        # Mark this image as extracted
        extracted_images_hashes[image_hash] = image_filename
        image_paths.append(image_filename)

    return image_paths


def clean_text(text):
    """Clean and format text for markdown."""
    # Remove page numbers and isolated numbers that are likely artifacts
    text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # Remove excessive whitespace
    text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)

    # Fix spacing issues
    text = re.sub(r'([.!?])\s*\n\s*([A-Z])', r'\1\n\n\2', text)

    # Clean up any remaining isolated numbers
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line = line.strip()
        # Skip lines that are just numbers
        if re.match(r'^\d+$', line):
            continue
        cleaned_lines.append(line)

    return '\n'.join(cleaned_lines).strip()


def extract_citations(text):
    """Extract citations and sources from text."""
    citations = []

    # Capture bracketed citations like [Author, Year]
    bracket_pattern = r'\[([^\[\]]+?)\]'
    for match in re.findall(bracket_pattern, text):
        cleaned = match.strip().rstrip('.,; ')
        if cleaned:
            citations.append(cleaned)

    # Capture plain URLs that may represent sources
    url_pattern = r'https?://[^\s\]\)>,]+'
    for url in re.findall(url_pattern, text):
        cleaned = url.rstrip('.,; )]')
        if cleaned:
            citations.append(cleaned)

    # Capture DOI/arXiv references that might not include protocol
    doi_pattern = r'(?:doi\.org|arxiv\.org)[^\s\]\)>,]+'
    for doi in re.findall(doi_pattern, text):
        cleaned = doi.rstrip('.,; )]')
        if cleaned:
            if not cleaned.lower().startswith('http'):
                cleaned = f"https://{cleaned}"
            citations.append(cleaned)

    # Capture textual citations like "Author et al. (2023)"
    textual_pattern = r'\b([A-Z][A-Za-z]+(?:\s+(?:et\s+al\.?|and))?\s*\(\d{4}[a-z]?\))'
    for match in re.findall(textual_pattern, text):
        cleaned = match.strip()
        if cleaned:
            citations.append(cleaned)

    # Deduplicate while preserving order
    unique_citations = []
    seen = set()
    for citation in citations:
        normalized = normalize_citation(citation)
        if normalized and normalized not in seen:
            unique_citations.append(citation.strip())
            seen.add(normalized)

    return unique_citations


def create_bibliography_section(citations):
    """Create a formatted bibliography section and mapping."""
    if not citations:
        return "", {}

    bibliography_lines = ["\n\n## Bibliografia\n\n"]
    citation_map = {}

    for index, citation in enumerate(citations, 1):
        anchor_id = f"ref-{index}"
        citation_map[normalize_citation(citation)] = index

        if citation.startswith('http'):
            display_text = citation
            if 'arxiv.org' in citation:
                display_text = f"arXiv: {citation.split('/')[-1]}"
            elif 'doi.org' in citation:
                display_text = f"DOI: {citation.split('/')[-1]}"
            elif 'github.com' in citation:
                parts = citation.rstrip('/').split('/')
                if len(parts) >= 2:
                    display_text = f"GitHub: {parts[-2]}/{parts[-1]}"
            bibliography_lines.append(f"{index}. <a id=\"{anchor_id}\"></a>[{display_text}]({citation})")
        else:
            bibliography_lines.append(f"{index}. <a id=\"{anchor_id}\"></a>{citation}")

    bibliography_lines.append("")  # Ensure trailing newline
    return "\n".join(bibliography_lines), citation_map


def link_citations_to_bibliography(content, citation_map):
    """Link in-text citations to their bibliography entries."""
    if not citation_map:
        return content

    citation_pattern = re.compile(r'\[([^\[\]]+?)\](?!\()')

    def replace_citation(match):
        citation_text = match.group(1).strip()
        normalized = normalize_citation(citation_text)
        index = citation_map.get(normalized)
        if not index:
            return match.group(0)
        return f'[{citation_text}](#ref-{index})'

    split_marker = '\n## Bibliografia'
    if split_marker in content:
        before, after = content.split(split_marker, 1)
        linked_before = citation_pattern.sub(replace_citation, before)
        return linked_before + split_marker + after

    return citation_pattern.sub(replace_citation, content)


def add_inline_citations(text, citation_numbers):
    """Replace bracketed citations with clickable references to the bibliography."""
    citation_regex = re.compile(r'\[([^\[\]]+?)\](?!\()')

    def replacer(match):
        citation_text = match.group(1).strip()
        normalized = normalize_citation(citation_text)
        index = citation_numbers.get(normalized)
        if not index:
            return match.group(0)
        return f'[{index}](#ref-{index})'

    return citation_regex.sub(replacer, text)


def apply_citations_to_document(pdf_path, citation_numbers, assets_dir, extracted_images_hashes):
    """Re-process the PDF document applying inline citations."""
    try:
        doc = fitz.open(pdf_path)
        pdf_name = Path(pdf_path).stem

        markdown_content = f"# {pdf_name}\n\n"

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()

            if text.strip():
                # Apply inline citations to the original text
                text_with_citations = add_inline_citations(text, citation_numbers)

                # Clean the text with citations
                clean_page_text = clean_text(text_with_citations)

                # Skip last page if it's sources
                page_citations = extract_citations(text)
                if page_num == len(doc) - 1 and ('http' in clean_page_text.lower() or len(page_citations) > 5):
                    continue

                # Add page content
                if page_num > 0:
                    markdown_content += f"\n\n---\n\n## Pagina {page_num + 1}\n\n"
                else:
                    markdown_content += "## Pagina 1\n\n"

                markdown_content += clean_page_text + "\n\n"

            # Extract images (avoid duplicates using the same hash tracking)
            if page_num < len(doc) - 1 or not ('http' in text.lower() or len(extract_citations(text)) > 5):
                image_paths = extract_images_from_page(page, page_num, assets_dir, extracted_images_hashes)
                for img_path in image_paths:
                    markdown_content += f"![Immagine]({os.path.join('Assets', img_path)})\n\n"

        doc.close()
        return markdown_content

    except Exception as e:
        print(f"Error applying citations to document: {str(e)}")
        return None


def convert_pdf_to_markdown(pdf_path, output_dir, assets_dir):
    """Convert a PDF file to Markdown format."""
    try:
        pdf_name = Path(pdf_path).stem

        # First pass: extract all citations preserving order
        doc = fitz.open(pdf_path)
        all_citations = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            if text.strip():
                page_citations = extract_citations(text)
                all_citations.extend(page_citations)

        doc.close()

        unique_citations = []
        citation_numbers = {}
        for citation in all_citations:
            normalized = normalize_citation(citation)
            if normalized and normalized not in citation_numbers:
                citation_numbers[normalized] = len(unique_citations) + 1
                unique_citations.append(citation)

        # Second pass: apply inline citations and generate final markdown
        extracted_images_hashes = {}  # Track extracted images to avoid duplicates
        markdown_content = apply_citations_to_document(pdf_path, citation_numbers, assets_dir, extracted_images_hashes)

        if not markdown_content:
            return False

        # Add bibliography section
        bibliography_section, citation_map = create_bibliography_section(unique_citations)
        markdown_content += bibliography_section

        # Generate table of contents and add it after the title
        toc = generate_table_of_contents(markdown_content)

        # Insert TOC after the main title
        title_end_pos = markdown_content.find('\n\n')
        if title_end_pos != -1:
            final_content = markdown_content[:title_end_pos + 2] + toc + markdown_content[title_end_pos + 2:]
        else:
            final_content = markdown_content

        # Link citations to bibliography entries
        final_content = link_citations_to_bibliography(final_content, citation_map)

        # Save markdown file
        output_file = os.path.join(output_dir, f"{pdf_name}.md")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_content)

        print(f"Successfully converted {pdf_path} to {output_file}")
        print(f"Extracted {len(unique_citations)} unique citations")

        return True

    except Exception as e:
        print(f"Error converting {pdf_path}: {str(e)}")
        return False


def main():
    """Main function to process all PDF files in the pdf directory."""
    # Define directories
    script_dir = Path(__file__).parent
    pdf_dir = script_dir / "pdf"
    files_dir = script_dir / "files"
    assets_dir = script_dir / "Assets"

    # Ensure output directories exist
    files_dir.mkdir(exist_ok=True)
    assets_dir.mkdir(exist_ok=True)

    # Process all PDF files
    pdf_files = list(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        print("No PDF files found in pdf directory")
        return

    print(f"Found {len(pdf_files)} PDF file(s) to process")

    for pdf_file in pdf_files:
        print(f"Processing: {pdf_file.name}")
        success = convert_pdf_to_markdown(pdf_file, files_dir, assets_dir)
        if success:
            print(f"✓ Completed: {pdf_file.name}")
        else:
            print(f"✗ Failed: {pdf_file.name}")


if __name__ == "__main__":
    main()
