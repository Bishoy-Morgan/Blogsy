# Blogsy

**Blogsy** is a backend-focused blogging platform built to demonstrate how a real-world content application is designed, structured, and evolved — beyond basic CRUD functionality.

The goal of this project is to showcase **backend engineering fundamentals**: authentication, relational data modeling, user interactions, media handling, and maintainable application structure.

---

## 🎯 What This Project Is For

This project was built to demonstrate:

- How to design a multi-user content platform
- How social features (likes, comments, saves) affect data modeling
- How to structure a Flask application for long-term maintainability
- How to safely handle user-generated content and file uploads
- How to think about scalability and production concerns early

Blogsy is intentionally **feature-complete**, not experimental, and focuses on *real product behavior* rather than isolated examples.

---

## 🧠 Why Blogsy Exists

Many demo projects stop at “users can create posts.”

Blogsy goes further by addressing:
- **User interaction** (likes, comments, reading lists)
- **Content discovery** (tags)
- **Media handling** (image uploads and optimization)
- **Account ownership** (profiles, saved content)

The goal was to build something that behaves like a real blogging product, even at a small scale.

---

## 🏗 Engineering Focus

Key engineering areas this project emphasizes:

- Authentication and session management
- Relational database modeling with SQLAlchemy
- Many-to-many relationships (posts ↔ tags, users ↔ saved posts)
- Server-side image processing and validation
- Modular Flask architecture with clear separation of concerns

---

## 🚀 Core Capabilities

- User authentication and profiles
- Blog post creation with tags and images
- Likes, comments, and reading lists
- Tag-based post discovery
- Responsive UI using server-side rendering

(Features are implemented to support the engineering goals above.)

---

## 🖼️ Screenshots

<p align="center">
  <img src="website/static/images/Screenshot1.png" alt="Blogsy Screenshot" width="800">
</p>

<p align="center">
  <img src="website/static/images/Screenshot2.png" alt="Blogsy Screenshot" width="800">
</p>

---

## 🧱 Application Structure

The application follows a modular Flask structure:

- `views.py` — request handling and routing
- `models.py` — database schema and relationships
- `utils.py` — shared utilities and helpers
- `templates/` — server-rendered UI with reusable components
- `static/` — styles, scripts, and uploaded media

This structure was chosen to keep the codebase readable and scalable as features grow.

---

## 🔐 Security & Data Handling

- Passwords are hashed using Werkzeug
- Authentication handled via Flask-Login
- Uploaded images are validated and processed server-side
- Media is optimized by converting images to WebP format
- Sensitive configuration is intended to be managed via environment variables

---

## 📈 Future Direction

If extended further, the project could include:
- Pagination and performance optimizations
- Automated tests for core flows
- REST API layer for frontend separation
- Production database (PostgreSQL)
- Advanced authorization rules

---

## 👤 Author

**Bishoy Morgan**  
Full-Stack Developer

GitHub: https://github.com/Bishoy-Morgan

---

## 📄 License

MIT License
