from PIL import Image
import os
from pathlib import Path

def compress_image(input_path: Path, output_path: Path, max_width: int = 1000):
    """Compress and resize image while maintaining aspect ratio"""
    with Image.open(input_path) as img:
        # Calculate new height maintaining aspect ratio
        width_percent = max_width / float(img.size[0])
        new_height = int(float(img.size[1]) * width_percent)
        
        if img.size[0] > max_width:
            # Only resize if image is larger than max_width
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background
        
        # Save with optimized compression
        img.save(output_path, 'JPEG', quality=85, optimize=True)

def main():
    # Get the project root directory
    project_root = Path(__file__).parent.parent
    portfolio_dir = project_root / 'public' / 'portfolio'
    output_dir = portfolio_dir / 'compressed'
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True)
    
    # Process each image in the portfolio directory
    for image_path in portfolio_dir.glob('*.JPG'):
        if 'compressed' not in str(image_path):
            print(f"Processing {image_path.name}...")
            
            output_path = output_dir / image_path.name
            compress_image(image_path, output_path)
            
            # Print size reduction
            original_size = os.path.getsize(image_path) / (1024 * 1024)  # MB
            compressed_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
            
            print(f"Original size: {original_size:.2f}MB")
            print(f"Compressed size: {compressed_size:.2f}MB")
            print(f"Reduction: {((original_size - compressed_size) / original_size * 100):.1f}%\n")

if __name__ == "__main__":
    main() 