# 📝 Blogsy

**Blogsy** is a full-featured blog platform built with Flask. It allows users to write blog posts with images and tags, like and comment on others’ posts, upload profile pictures, and build a personal reading list — all with a clean, modern interface.

---

## 🖼️ Screenshot

<p align="center">
  <img src="website/static/images/Screenshot1.png" alt="Blogsy Screenshot" width="800">
</p>

<p align="center">
  <img src="website/static/images/Screenshot2.png" alt="Blogsy Screenshot" width="800">
</p>

---

## 🚀 Features

- 🧑‍💻 **User Authentication**
  - Register / Login / Logout
- 📝 **Blog Posts**
  - Title, rich content, tags, and image (converted to WebP automatically)
  - Add multiple tags/topics per post
- 📸 **Image Uploads**
  - Blog images saved as compressed `.webp`
  - Profile image upload and display
- 💬 **Interaction**
  - Like & comment on posts
  - Add posts to your personal reading list
- 🔎 **Tags**
  - Browse posts by tag
- 📱 **Responsive Design**
  - Mobile-friendly with clean UI
- ✨ **Extras**
  - Drop-cap styling for the first letter of posts
  - Arabic and English support possible (future-ready)

---

## 📂 Project Structure

```bash
blogsy/
├── website/
│   ├── static/
│   │   ├── uploads/
│   │   ├── profile_images/
│   │   ├── js/
│   │   ├── css/
│   │   ├── fonts/
│   │   └── images/
│   ├── templates/
│   ├── __init__.py
│   ├── views.py
│   ├── models.py
│   └── utils.py
├── run.py
├── requirements.txt
└── README.md
```

🧰 Tech Stack

- Backend: Python, Flask, Flask-Login, SQLAlchemy

- Frontend: HTML, Jinja2, Tailwind CSS (or Bootstrap)

- Image Processing: Pillow (for WebP conversion)

- Database: SQLite (for simplicity)
