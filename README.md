# 📝 Blogsy

**Blogsy** is a modern, full-featured blogging platform built with **Flask**, designed to showcase clean architecture, authentication flows, and real-world backend features.  
It supports writing rich blog posts with images and tags, user interaction (likes, comments, reading lists), and a hybrid authentication system using **Supabase Auth + Flask sessions**.

---

## 🖼️ Screenshots

<p align="center">
  <img src="website/static/images/Screenshot1.png" alt="Blogsy Screenshot" width="800">
</p>

<p align="center">
  <img src="website/static/images/Screenshot2.png" alt="Blogsy Screenshot" width="800">
</p>

---

## 🚀 Features

### 🔐 Authentication & Users
- User sign up & login via **Supabase Authentication**
- Flask session handling with **Flask-Login**
- Automatic local user creation on first Supabase login
- Logout support
- Update profile information (name, password)
- Upload profile image (validated, cropped, resized)
- User profile pages via `/your-name`

### ✍️ Blog Posts
- Create blog posts with:
  - Title, content, tags (comma-separated), and image
  - Minimum length validation
  - First-letter drop-cap styling
- Uploaded post images:
  - Automatically converted to optimized `.webp`
  - Compressed for performance

### 🏷️ Tags & Topics
- Tags are auto-created or reused during post creation
- Browse posts by tag via `/tag/<id>`
- View all tags with search support

### 💬 Interaction
- Comment on posts (with empty-content validation)
- Like posts (AJAX supported)
- Save / remove posts from personal reading list (AJAX supported)

### 📚 Reading List
- Each user has a personal reading list
- Accessible at `/reading-list`

### 🧍 Social Features
- Follow / unfollow users
- Suggested users system
- User profile pages with authored posts

### 📃 Static Pages
- Welcome page (`/`)
- Terms of use (`/terms`)
- Privacy policy (`/privacy-policy`)
- Pricing, Features, and Story pages

### ⚙️ Image Processing
- Blog images converted to `.webp`
- Profile images:
  - Center-cropped
  - Resized to square format
  - Renamed uniquely per user

### 🧠 UX & Performance
- Clean, responsive UI
- Server-side rendering with Jinja2
- Optimized images for fast loading
- Accessible, readable layout

---

## 🔐 Authentication Architecture (Important)

Blogsy uses a **hybrid authentication approach**:

1. User signs up / logs in via **Supabase Auth** (client-side)
2. Supabase validates credentials securely
3. Flask receives the authenticated email
4. Flask creates or retrieves a local user record
5. Flask session is established using **Flask-Login**

This approach allows:
- Secure auth without storing raw passwords
- Full control over backend permissions and data
- Easy future migration to production databases

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
│   ├── auth.py
│   ├── models.py
│   └── utils.py
├── main.py
├── requirements.txt
└── README.md
