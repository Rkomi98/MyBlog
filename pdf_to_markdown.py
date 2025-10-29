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


def extract_images_from_page(page, page_num, output_dir):
    """Extract images from a PDF page and save them to the output directory."""
    images = page.get_images(full=True)
    image_paths = []

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = page.parent.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]

        # Create image filename
        image_filename = f"page_{page_num+1:03d}_image_{img_index+1:03d}.{image_ext}"
        image_path = os.path.join(output_dir, image_filename)

        # Save image
        with open(image_path, "wb") as img_file:
            img_file.write(image_bytes)

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

    # Pattern for Harvard citations [Author, Year] or similar
    citation_pattern = r'\[([^\]]+)\]'
    found_citations = re.findall(citation_pattern, text)

    for citation in found_citations:
        citation = citation.strip()
        if citation and len(citation) > 2:  # Avoid very short citations
            citations.append(citation)

    # Also extract URLs which are likely sources
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text)
    citations.extend(urls)

    # Extract DOI links
    doi_pattern = r'(?:doi\.org|arxiv\.org)[^\s]+'
    dois = re.findall(doi_pattern, text)
    citations.extend([f"https://{doi}" for doi in dois])

    # Clean and deduplicate citations
    unique_citations = []
    seen = set()
    for citation in citations:
        citation = citation.strip()
        if citation and citation not in seen and len(citation) > 5:  # Filter very short entries
            unique_citations.append(citation)
            seen.add(citation)

    return unique_citations


def create_bibliography_section(citations):
    """Create a formatted bibliography section."""
    if not citations:
        return ""

    bibliography = "\n\n## Bibliografia\n\n"
    for i, citation in enumerate(citations, 1):
        # If it's a URL, create a markdown link
        if citation.startswith('http'):
            bibliography += f"{i}. [{citation}]({citation})\n"
        else:
            bibliography += f"{i}. {citation}\n"

    return bibliography


def convert_pdf_to_markdown(pdf_path, output_dir, assets_dir):
    """Convert a PDF file to Markdown format."""
    try:
        # Open PDF
        doc = fitz.open(pdf_path)
        pdf_name = Path(pdf_path).stem

        # Initialize markdown content
        markdown_content = f"# {pdf_name}\n\n"

        all_citations = []

        # Process each page
        for page_num in range(len(doc)):
            page = doc[page_num]

            # Extract text
            text = page.get_text()
            if text.strip():
                # Clean and format text
                clean_page_text = clean_text(text)

                # Skip the last page if it contains mostly sources/links (avoid duplication in bibliography)
                if page_num == len(doc) - 1 and ('http' in clean_page_text.lower() or len(extract_citations(clean_page_text)) > 5):
                    # Extract citations from last page but don't include text content
                    page_citations = extract_citations(clean_page_text)
                    all_citations.extend(page_citations)
                else:
                    # Extract citations from this page
                    page_citations = extract_citations(clean_page_text)
                    all_citations.extend(page_citations)

                    # Add page content
                    if page_num > 0:  # Add page separator for pages after first
                        markdown_content += f"\n\n---\n\n## Pagina {page_num + 1}\n\n"
                    else:
                        markdown_content += "## Pagina 1\n\n"

                    markdown_content += clean_page_text + "\n\n"

            # Extract and add images (except for last page if it's sources)
            if page_num < len(doc) - 1 or not ('http' in text.lower() or len(extract_citations(text)) > 5):
                image_paths = extract_images_from_page(page, page_num, assets_dir)
                for img_path in image_paths:
                    markdown_content += f"![Immagine Pagina {page_num + 1}]({os.path.join('Assets', img_path)})\n\n"

        # Add bibliography section
        bibliography = create_bibliography_section(list(set(all_citations)))
        markdown_content += bibliography

        # Generate table of contents and add it after the title
        toc = generate_table_of_contents(markdown_content)

        # Add anchors to headers in the content
        def add_header_anchors(content):
            lines = content.split('\n')
            processed_lines = []

            for line in lines:
                header_match = re.match(r'^(#{1,6})\s+(.+)', line.strip())
                if header_match:
                    level = len(header_match.group(1))
                    title = header_match.group(2).strip()
                    anchor = re.sub(r'[^\w\s-]', '', title).lower().replace(' ', '-')
                    processed_lines.append(f'{header_match.group(1)} {title} {{#{anchor}}}')
                else:
                    processed_lines.append(line)

            return '\n'.join(processed_lines)

        # Insert TOC after the main title
        title_end_pos = markdown_content.find('\n\n')
        if title_end_pos != -1:
            final_content = markdown_content[:title_end_pos + 2] + toc + markdown_content[title_end_pos + 2:]
        else:
            final_content = markdown_content

        # Add anchors to headers
        final_content = add_header_anchors(final_content)

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
