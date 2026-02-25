import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageFont

# Your event link
url = "https://incandescent-cuchufli-56137a.netlify.app/"

# 3 QR versions
qr_versions = [
    {"version": 1, "text": "Sai weds Anjali", "note": "Scan using Google Lens", "filename": "qr_version1.png"},
    {"version": 2, "text": "Sai weds Anjali", "note": "Use Google Lens for scanning", "filename": "qr_version2.png"},
    {"version": 3, "text": "Sai weds Anjali", "note": "Use Google Lens", "filename": "qr_version3.png"}
]

def create_custom_qr(data, version, text, note, filename):
    # ✅ High error correction for print safety
    qr = qrcode.QRCode(
        version=version,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Generate QR image
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    draw = ImageDraw.Draw(img)
    width, height = img.size

    # Load fonts (fallback to default if Arial missing)
    try:
        font_main = ImageFont.truetype("arial.ttf", 30)
        font_note = ImageFont.truetype("arial.ttf", 20)
    except:
        font_main = ImageFont.load_default()
        font_note = ImageFont.load_default()

    # Calculate text boxes
    main_box = draw.textbbox((0, 0), text, font=font_main)
    note_box = draw.textbbox((0, 0), note, font=font_note)

    text_width = main_box[2] - main_box[0]
    text_height = main_box[3] - main_box[1]
    note_width = note_box[2] - note_box[0]
    note_height = note_box[3] - note_box[1]

    # 🧊 White background box for center text
    rect_x0 = (width - text_width) / 2 - 10
    rect_y0 = (height - text_height) / 2 - 5
    rect_x1 = rect_x0 + text_width + 20
    rect_y1 = rect_y0 + text_height + 10
    draw.rectangle([rect_x0, rect_y0, rect_x1, rect_y1], fill="white")

    # Draw text and note
    draw.text(((width - text_width) / 2, (height - text_height) / 2), text, font=font_main, fill="black")
    draw.text(((width - note_width) / 2, height - note_height - 10), note, font=font_note, fill="black")

    # ✅ Upscale for print clarity (≈300 DPI)
    upscale = 3
    img = img.resize((width * upscale, height * upscale), Image.LANCZOS)

    # Save final image
    img.save(filename, dpi=(300, 300))
    print(f"✅ Saved high-quality QR: {filename}")

# Generate all three QR codes
for q in qr_versions:
    create_custom_qr(url, q["version"], q["text"], q["note"], q["filename"])

print("🎉 All 3 high-quality QR codes created successfully! Ready for print.")