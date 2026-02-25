import qrcode

# Updated URL
url = "https://incandescent-cuchufli-56137a.netlify.app/"

# Generate the QR code
qr = qrcode.make(url)

# Save the QR code as an image
qr.save("website_qr.png")

print("QR code created and saved as website_qr.png")