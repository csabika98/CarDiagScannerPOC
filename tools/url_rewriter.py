import os
import re
from pathlib import Path

def rewrite_static_paths(directory, base_path="/cardiag"):
    pattern = re.compile(
        r'''(['"`])\/(?!\/)''' 
        r'''(?!''' + re.escape(base_path) + r'''\/)'''  
        r'''(?![>\s])'''  
        r'''([^/\s'"`\)>]*)''' 
    )
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html')):
                file_path = Path(root) / file
                try:
                    with open(file_path, 'r+', encoding='utf-8') as f:
                        content = f.read()
                        modified = content
                        
                        modified = pattern.sub(
                            lambda m: f"{m.group(1)}/{base_path}/{m.group(2)}", 
                            modified
                        )
                        
                        modified = re.sub(
                            r'(url\(\s*)\/(?!\/)(?!' + re.escape(base_path) + r'/)',
                            rf'\1/{base_path}/',
                            modified
                        )

                        if modified != content:
                            f.seek(0)
                            f.write(modified)
                            f.truncate()
                            print(f"Updated: {file_path}")
                            
                except UnicodeDecodeError:
                    print(f"Skipped binary file: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {str(e)}")

if __name__ == "__main__":
    target_directory = "/home/csabasallai/ClaimTheiaFinalFrontEnd/alpha_version/"
    base_path = "cardiag"
    
    print("WARNING: Always make a backup before running this script!")
    input("Press Enter to continue or Ctrl+C to abort...")
    
    rewrite_static_paths(target_directory, base_path)
    print("Path rewriting complete. Verify changes!")