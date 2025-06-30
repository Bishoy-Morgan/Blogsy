# 🚀 Blogsy – A Modern Blogging Platform

Welcome to **Blogsy** – a lightweight, clean, and powerful blogging platform built with **Flask**. Whether you're a writer, reader, or developer, MediumLite gives you a beautiful space to create and explore ideas.

---

## ✨ Features

- 📝 Rich-text editor for creating and editing posts
- 🔐 User authentication (signup/login/logout)
- 🧑‍💻 User profiles with public posts
- 🧠 Tags and categories for content discovery
- 📱 Fully responsive and mobile-friendly UI
- 🔍 SEO-optimized with clean URLs
- 📊 Admin dashboard for managing content
- 💬 Comments system (optional)
- 🌐 Multilingual support (optional)

---

## 📸 Preview


---

## ⚙️ Tech Stack

- **Backend:** Flask, Python
- **Frontend:** HTML5, CSS3, Bootstrap / TailwindCSS
- **Database:** SQLite (for dev) / PostgreSQL (for production)
- **Deployment:** Render / Heroku / Vercel / Fly.io

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/MediumLite.git
cd MediumLite

# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development

# Initialize the database
flask db init
flask db migrate
flask db upgrade

# Run the server
flask run
