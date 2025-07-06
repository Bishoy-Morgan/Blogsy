from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Blog, Like, Comment, Tag
import os
from werkzeug.utils import secure_filename
# from flask import current_app
from flask import jsonify, request


views = Blueprint('views', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@views.route('/')
def welcome():
    return render_template('welcome.html', user=current_user)

@views.route('/home')
@login_required
def home():
    blogs = Blog.query.order_by(Blog.date_created.desc()).all()
    return render_template('home.html', user=current_user, blogs=blogs)

@views.route('/about')
def about():
    return render_template('about.html', user=current_user)

@views.route('/write', methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        tags_input = request.form.get('tags', '')
        image = request.files.get('image')

        if len(title) < 5:
            flash('Title must be at least 5 characters.', category='error')
        elif len(content) < 100:
            flash('Content must be at least 100 characters.', category='error')
        elif not image or image.filename == '':
            flash('Post image is required.', category='error')
        elif not allowed_file(image.filename):
            flash('Invalid image type. Allowed types: png, jpg, jpeg, gif.', category='error')
        else:
            filename = secure_filename(image.filename)
            image.save(os.path.join('website/static/uploads', filename))

            new_blog = Blog(
                title=title,
                content=content,
                author_id=current_user.id,
                image_filename=filename
            )

            # Process tags
            tag_names = [t.strip().lower() for t in tags_input.split(',') if t.strip()]
            for name in tag_names:
                tag = Tag.query.filter_by(name=name).first()
                if not tag:
                    tag = Tag(name=name)
                    db.session.add(tag)
                new_blog.tags.append(tag)

            db.session.add(new_blog)
            db.session.commit()
            flash('Post created successfully!', category='success')
            return redirect(url_for('views.home'))

    return render_template('write.html', user=current_user)

@views.route('/post/<int:blog_id>', methods=['GET', 'POST'])
def view_post(blog_id):
    blog = Blog.query.get_or_404(blog_id)

    reading_ids = [b.id for b in current_user.reading_list]

    return render_template('post.html', blog=blog, user=current_user, reading_ids=reading_ids)

@views.route('/like/<int:blog_id>', methods=['POST'])
@login_required
def like_post(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    new_like = Like(user_id=current_user.id, blog_id=blog_id)
    db.session.add(new_like)
    db.session.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'likes': len(blog.likes)})

    return redirect(request.referrer or url_for('views.home'))

@views.route('/comment/add/<int:blog_id>', methods=['POST'])
@login_required
def add_comment(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    content = request.form.get('content')

    if not content or content.strip() == '':
        flash('Comment cannot be empty.', 'error')
        return redirect(request.referrer or url_for('views.home'))

    new_comment = Comment(
        content=content.strip(),
        user_id=current_user.id,
        blog_id=blog_id
    )
    db.session.add(new_comment)
    db.session.commit()
    flash('Comment added!', 'success')
    return redirect(request.referrer or url_for('views.home'))

@views.route('/reading-list/toggle/<int:blog_id>', methods=['POST'])
@login_required
def toggle_reading_list(blog_id):
    blog = Blog.query.get_or_404(blog_id)

    if blog in current_user.reading_list:
        current_user.reading_list.remove(blog)
        saved = False
    else:
        current_user.reading_list.append(blog)
        saved = True

    db.session.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'saved': saved})

    return redirect(request.referrer or url_for('views.home'))

@views.route('/reading-list')
def reading_list():
    return render_template('reading-list.html', user=current_user, reading_list=current_user.reading_list)

@views.route('/terms')
def terms():
    return render_template('terms.html', user=current_user)

@views.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html', user=current_user)
