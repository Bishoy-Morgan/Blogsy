# Blogsy — Full-Stack Blogging Platform

**Live site:** [blogsy-ceod.onrender.com](https://blogsy-ceod.onrender.com)

> A full-featured, multi-user blogging platform built with Flask — covering authentication, content creation, social interaction, and image processing end-to-end.

---

## Screenshots

<img width="1902" height="913" alt="Screenshot 2026-03-28 183720" src="https://github.com/user-attachments/assets/9e9d733c-dc07-49eb-8af1-1f2e05dd6044" />

<img width="1898" height="916" alt="Screenshot 2026-03-28 184029" src="https://github.com/user-attachments/assets/d50babb7-7a6d-4e69-8e89-5baa531844c1" />

<img width="1897" height="914" alt="Screenshot 2026-03-28 184252" src="https://github.com/user-attachments/assets/e1e42baa-363c-44ac-aa04-18912137c50a" />

<img width="1898" height="913" alt="Screenshot 2026-03-28 184600" src="https://github.com/user-attachments/assets/3aa5fbe5-9e3f-4f4b-b3a7-7926168d98b5" />

---

## Overview

Blogsy is a production-grade blogging platform built to explore real-world Flask architecture — authentication flows, relational data modeling, file handling, and social features. It goes beyond CRUD: users can write and publish posts with rich content and tags, interact through likes and comments, follow other writers, and manage a personal reading list.

The goal was to build something that behaves like a real product — not a tutorial clone.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| Auth | Supabase Auth + Flask-Login |
| Database | SQLite (dev) via Flask-SQLAlchemy |
| Migrations | Flask-Migrate |
| Image Processing | Pillow |
| Templating | Jinja2 |
| Frontend | HTML, CSS, JavaScript (AJAX) |
| Deployment | Render |

---

## Key Engineering Decisions

### 1. Hybrid Authentication — Supabase + Flask-Login
Rather than storing raw passwords locally, Blogsy delegates credential handling to Supabase Auth. On login, Supabase validates the user and returns the authenticated email. Flask then creates or retrieves a local user record and establishes a session via Flask-Login.

This approach keeps password management out of the application layer entirely, while preserving full backend control over permissions, session handling, and data relationships. It also mirrors how production systems often split identity providers from application logic.

### 2. Image Processing Pipeline
Every uploaded image — whether a post cover or profile photo — goes through a processing pipeline before storage. Post images are converted to `.webp` for compression and performance. Profile images are center-cropped, resized to a square, and renamed uniquely per user.

This was a deliberate design choice: unprocessed user uploads create inconsistent UIs and slow pages. Handling it server-side means the frontend never has to compensate.

### 3. AJAX-Powered Interactions
Likes and reading list saves are handled via AJAX — no full page reloads. This keeps the interaction feel smooth and puts the state management responsibility on the server, where it belongs for a Flask app without a dedicated frontend framework.

### 4. Social Graph Features
Users can follow and unfollow each other, view personalized feeds based on who they follow, and browse a suggested users list. The data model uses a many-to-many self-referential relationship on the User table — a non-trivial relational modeling problem that required careful thought about query design.

---

## Features

**Authentication & Users**
- Sign up and login via Supabase Auth
- Session management with Flask-Login
- Profile pages at `/<username>`
- Update name, password, and profile image

**Content**
- Create posts with title, body, tags, and cover image
- Tags auto-created and reused across posts
- Browse posts by tag
- Drop-cap styling on post content

**Social Interaction**
- Like and unlike posts (AJAX)
- Comment on posts
- Follow / unfollow users
- Suggested users system
- Personal reading list (save / remove via AJAX)

**Image Handling**
- Post images → converted to `.webp`, compressed
- Profile images → center-cropped, resized, uniquely named

---

## Project Structure

```
blogsy/
├── website/
│   ├── static/
│   │   ├── uploads/          # Post images
│   │   ├── profile_images/   # Processed profile photos
│   │   ├── js/               # AJAX interaction scripts
│   │   ├── css/
│   │   └── fonts/
│   ├── templates/            # Jinja2 HTML templates
│   ├── __init__.py           # App factory
│   ├── views.py              # Main routes
│   ├── auth.py               # Auth routes
│   ├── models.py             # SQLAlchemy models
│   └── utils.py              # Image processing helpers
├── migrations/               # Flask-Migrate history
├── main.py
└── requirements.txt
```

---

## Running Locally

```bash
git clone https://github.com/Bishoy-Morgan/Blogsy.git
cd Blogsy

pip install -r requirements.txt

# Create .env with:
# SUPABASE_URL=your-supabase-url
# SUPABASE_KEY=your-supabase-anon-key
# SECRET_KEY=your-flask-secret

flask db upgrade
python main.py
```

Open [http://localhost:5000](http://localhost:5000)

---

## What I Built

- Full backend architecture — models, routes, auth, utilities
- Supabase + Flask-Login hybrid auth system
- Server-side image processing pipeline
- AJAX interaction layer for likes and reading list
- Self-referential social graph (follow/unfollow, personalized feed)
- Responsive Jinja2 templates across all pages
- Production deployment on Render

---

→ **[blogsy-ceod.onrender.com](https://blogsy-ceod.onrender.com)**
