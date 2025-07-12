from PIL import Image
import os

def save_compressed_image(image_file, filename_base):
    img = Image.open(image_file)

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    img.thumbnail((1200, 800))  # Resize

    upload_dir = os.path.join('website', 'static', 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    save_path = os.path.join(upload_dir, filename_base + '.webp')
    img.save(save_path, format="WEBP", optimize=True, quality=70)

    return filename_base + '.webp'
