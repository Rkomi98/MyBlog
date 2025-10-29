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

    # Pattern for Harvard citations [Author, Year] or similar - improved
    # Match complete citations within brackets, with better filtering
    citation_pattern = r'\[([^\[\]]{5,100})\]'  # Match content within brackets, 5-100 chars
    found_citations = re.findall(citation_pattern, text)

    for citation in found_citations:
        citation = citation.strip()
        # Filter out citations that are just numbers, URLs, very short fragments, or punctuation
        if (citation and
            len(citation) > 4 and  # Minimum length increased
            not citation.isdigit() and
            not citation.startswith('http') and
            not '://' in citation and
            not citation.startswith('DOI:') and
            not re.match(r'^[^\w\s]*$', citation) and  # Avoid pure punctuation
            not re.match(r'^\d{4}$', citation) and  # Avoid just years
            not re.match(r'^\w+,\s*\d{4}$', citation) and  # Avoid simple "Author, Year" that might be fragments
            ',' in citation and  # Must contain comma (likely author, year format)
            ' ' in citation):  # Must contain space (more complete citations)
            citations.append(citation)

    # Also extract URLs which are likely sources
    url_pattern = r'https?://[^\s\[\]<>"{}|\\^`]+'
    urls = re.findall(url_pattern, text)
    citations.extend(urls)

    # Extract DOI links
    doi_pattern = r'(?:doi\.org|arxiv\.org)[^\s\[\]<>"{}|\\^`]+'
    dois = re.findall(doi_pattern, text)
    citations.extend([f"https://{doi}" for doi in dois if doi])

    # Extract additional citation patterns that might be missed (without brackets)
    # Only extract complete citations like "Author et al. (Year)" - avoid fragments
    additional_pattern = r'\b([A-Z][a-z]+(?:\s+et\s+al\.?\s*\([^)]+\)|\s+et\s+al\.?\s*\(\d{4}\)))'
    additional_citations = re.findall(additional_pattern, text)
    for citation in additional_citations:
        citation = citation.strip()
        if (citation and
            len(citation) > 8 and  # Must be reasonably complete
            citation not in citations):
            citations.append(citation)

    # Clean and deduplicate citations
    unique_citations = []
    seen = set()
    for citation in citations:
        citation = citation.strip()
        # More robust filtering and normalization
        if (citation and
            len(citation) > 3 and
            not citation.isdigit() and
            not re.match(r'^[^\w]*$', citation)):  # Avoid citations that are only punctuation

            # Normalize citation for deduplication (remove extra spaces, normalize case for URLs)
            normalized = citation.lower() if citation.startswith('http') else citation

            if normalized not in seen:
                unique_citations.append(citation)
                seen.add(normalized)

    return unique_citations


def create_bibliography_section(citations):
    """Create a formatted bibliography section."""
    if not citations:
        return ""

    bibliography = "\n\n## Bibliografia\n\n"

    # Separate URLs from textual citations
    urls = [c for c in citations if c.startswith('http')]
    textual_citations = [c for c in citations if not c.startswith('http')]

    # Sort citations: textual first, then URLs
    sorted_citations = textual_citations + urls

    for i, citation in enumerate(sorted_citations, 1):
        # If it's a URL, create a markdown link
        if citation.startswith('http'):
            # Try to create a more readable title from URL
            title = citation
            # Extract meaningful parts from common URL patterns
            if 'arxiv.org' in citation:
                title = f"arXiv: {citation.split('/')[-1] if '/' in citation else citation}"
            elif 'doi.org' in citation:
                title = f"DOI: {citation.split('/')[-1] if '/' in citation else citation}"
            elif 'github.com' in citation:
                title = f"GitHub: {citation.split('/')[-2] if '/' in citation else citation}"
            bibliography += f"{i}. [{title}]({citation})\n"
        else:
            # For textual citations, format them nicely with number
            bibliography += f"{i}. {citation}\n"

    return bibliography


def add_inline_citations(text, citations_dict):
    """Replace citation brackets with inline references to bibliography."""
    result = text

    # Find all citation patterns [text] in the text
    citation_pattern = r'\[([^\[\]]{3,100})\]'
    found_citations = re.findall(citation_pattern, result)

    for citation in found_citations:
        citation = citation.strip()
        # Check if this citation is in our bibliography
        if citation in citations_dict:
            citation_num = citations_dict[citation]
            # Replace [citation] with [citation_num]
            result = re.sub(r'\[' + re.escape(citation) + r'\]', f'[{citation_num}]', result)

    return result


def apply_citations_to_document(pdf_path, citations_dict, assets_dir, extracted_images_hashes):
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
                text_with_citations = add_inline_citations(text, citations_dict)

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
        # Open PDF
        doc = fitz.open(pdf_path)
        pdf_name = Path(pdf_path).stem

        # Initialize markdown content
        markdown_content = f"# {pdf_name}\n\n"

        all_citations = []
        extracted_images_hashes = {}  # Track extracted images to avoid duplicates

        # Process each page
        for page_num in range(len(doc)):
            page = doc[page_num]

            # Extract text
            text = page.get_text()
            if text.strip():
                # Extract citations from original text before cleaning
                page_citations = extract_citations(text)
                all_citations.extend(page_citations)

                # Apply inline citations to original text before cleaning
                # This will replace [citation text] with [number] in the original text
                text_with_inline_citations = text  # Will be processed later with all citations

                # Clean and format text
                clean_page_text = clean_text(text_with_inline_citations)

                # Skip the last page if it contains mostly sources/links (avoid duplication in bibliography)
                if page_num == len(doc) - 1 and ('http' in clean_page_text.lower() or len(page_citations) > 5):
                    # Don't include text content for last page
                    pass
                else:
                    # Add page content
                    if page_num > 0:  # Add page separator for pages after first
                        markdown_content += f"\n\n---\n\n## Pagina {page_num + 1}\n\n"
                    else:
                        markdown_content += "## Pagina 1\n\n"

                    markdown_content += clean_page_text + "\n\n"

            # Extract and add images (except for last page if it's sources)
            if page_num < len(doc) - 1 or not ('http' in text.lower() or len(extract_citations(text)) > 5):
                image_paths = extract_images_from_page(page, page_num, assets_dir, extracted_images_hashes)
                for img_path in image_paths:
                    markdown_content += f"![Immagine]({os.path.join('Assets', img_path)})\n\n"

        # Create unique citations list and citation dictionary for inline references
        unique_citations = list(set(all_citations))
        citations_dict = {citation: i+1 for i, citation in enumerate(unique_citations) if not citation.startswith('http')}

        # Apply inline citations to the entire document content before adding bibliography
        # We need to re-process the PDF to apply citations inline
        markdown_content_with_citations = apply_citations_to_document(pdf_path, citations_dict, assets_dir, extracted_images_hashes)

        # Replace the content with citations
        if markdown_content_with_citations:
            markdown_content = markdown_content_with_citations

        # Add bibliography section
        bibliography = create_bibliography_section(unique_citations)
        markdown_content += bibliography

        # Generate table of contents and add it after the title
        toc = generate_table_of_contents(markdown_content)

        # Insert TOC after the main title
        title_end_pos = markdown_content.find('\n\n')
        if title_end_pos != -1:
            final_content = markdown_content[:title_end_pos + 2] + toc + markdown_content[title_end_pos + 2:]
        else:
            final_content = markdown_content

        # Save markdown file
        output_file = os.path.join(output_dir, f"{pdf_name}.md")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_content)

        print(f"Successfully converted {pdf_path} to {output_file}")
        print(f"Extracted {len(all_citations)} unique citations")

        doc.close()
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
