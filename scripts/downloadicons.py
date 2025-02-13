import os
import requests

logos = {
    "windmill-dev.svg": "https://www.windmill.dev/img/windmill.svg",
    "heartcore-capital.png": "https://cdn.prod.website-files.com/65782f5dab04898a6b34e2ea/65782f5dab04898a6b34e440_Frame%202087324163.png",
    "frankfurt-school.png": "https://www.frankfurt-school.de/.resources/frankfurtschool/webresources/img/icons/fav/192x192.png",
    "flaschenpost.png": "https://www.flaschenpost.de/images/favicon/apple-touch-icon.png",
    "globalfounderscapital.png": "https://cdn.prod.website-files.com/5b28f73c8895e0b79ba5ab35/5b3346a035c7c0c07c123869_GFC_FavIcon.png"
}

save_dir = os.path.join("public", "logos")
os.makedirs(save_dir, exist_ok=True)

for filename, url in logos.items():
    print(f"Downloading {url} as {filename}...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(os.path.join(save_dir, filename), "wb") as f:
            f.write(response.content)
        print(f"Saved {filename} successfully.")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
