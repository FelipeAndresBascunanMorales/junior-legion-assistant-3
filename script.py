import os
from pathlib import Path

def scan_directory(directory_path: str, output_file: str):
    file_content = ""
    
    # Convert to Path object for easier handling
    base_dir = Path(directory_path)
    
    # Walk through directory
    for root, _, files in os.walk(base_dir):
        for file in files:
            file_path = Path(root) / file
            
            try:
                # Read the file content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Add path as comment and content to our result
                file_content += f"// File: src/{file}\n\n"
                file_content += f"{content}\n\n"
                file_content += "// " + "-" * 40 + "\n\n"
                
            except Exception as e:
                print(f"Error reading {file_path}: {str(e)}")
    
    try:
        # Write everything to output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(file_content)
        print(f"Successfully wrote contents to {output_file}")
    except Exception as e:
        print(f"Error writing output file: {str(e)}")

# Usage
if __name__ == "__main__":
    src_path = os.path.join(os.getcwd(), 'src')
    output_path = os.path.join(os.getcwd(), 'source_contents.txt')
    
    scan_directory(src_path, output_path)