import pymupdf4llm
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_file(file_path: str):
    markdown_pages = pymupdf4llm.to_markdown(
        file_path,
        page_chunks=True,
    )

    return markdown_pages


def split_text(pages):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=100,
        separators=[
            "\n# ",
            "\n## ",
            "\n### ",
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    chunks = []

    for idx, page in enumerate(pages):
        # Handle pages with or without metadata
        if isinstance(page, dict):
            metadata = page.get("metadata", {})
            page_num = metadata.get("page", idx) + 1
            text = page.get("text", page) if "text" in page else str(page)
        else:
            # If page is not a dict, treat it as text
            page_num = idx + 1
            text = str(page)

        split_chunks = splitter.split_text(text)

        for chunk in split_chunks:
            chunks.append({
                "text": chunk,
                "page": page_num,
            })

    return chunks