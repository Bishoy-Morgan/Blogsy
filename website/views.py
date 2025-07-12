from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Blog, Like, Comment, Tag, User
import os
from werkzeug.utils import secure_filename
from .utils import save_compressed_image
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
    tags = Tag.query.all()
    return render_template('home.html', user=current_user, blogs=blogs, tags=tags)

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
            # filename = secure_filename(image.filename)
            # image.save(os.path.join('website/static/uploads', filename))
            try:
                filename_base = secure_filename(os.path.splitext(image.filename)[0])
                webp_filename = save_compressed_image(image, filename_base)
            except Exception as e:
                flash('Error processing image: ' + str(e), category='error')
                return redirect(request.url)


            new_blog = Blog(
                title=title,
                content=content,
                author_id=current_user.id,
                image_filename=webp_filename
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
@login_required
def reading_list():
    return render_template('reading-list.html', user=current_user, reading_list=current_user.reading_list)

@views.route('/<first_name>')
@login_required
def profile(first_name):
    first_name_cleaned = first_name.replace('-', ' ')
    user = User.query.filter_by(first_name=first_name_cleaned).first()
    if not user:
        return render_template('not-found.html'), 404
    return render_template('profile.html', user=current_user, profile_user=user)

@views.route('/terms')
def terms():
    return render_template('terms.html', user=current_user)

@views.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html', user=current_user)


@views.route('/upload_profile_image', methods=['POST'])
@login_required
def upload_profile_image():
    if 'profile_image' not in request.files:
        flash('No file part', category='error')
        return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))
    
    file = request.files['profile_image']
    if file.filename == '':
        flash('No selected file', category='error')
        return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Rename to ensure uniqueness, e.g., userID + extension
        _, ext = os.path.splitext(filename)
        filename = f"user_{current_user.id}{ext}"
        
        upload_folder = os.path.join('website', 'static', 'profile_images')
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Update user profile_image field
        current_user.profile_image = filename
        db.session.commit()
        
        flash('Profile image updated successfully!', category='success')
    else:
        flash('Allowed image types are png, jpg, jpeg, gif.', category='error')
    
    return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))


@views.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    new_name = request.form.get('first_name')
    new_password = request.form.get('password')

    if new_name:
        current_user.first_name = new_name

    if new_password:
        from werkzeug.security import generate_password_hash
        current_user.password = generate_password_hash(new_password, method='sha256')

    db.session.commit()
    flash('Profile updated!', 'success')
    return redirect(url_for('views.profile', first_name=new_name.replace(' ', '-')))


@views.route('/tag/<int:tag_id>')
def posts_by_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    blogs = Blog.query\
        .join(Blog.tags)\
        .filter(Tag.id == tag_id)\
        .order_by(Blog.date_created.desc())\
        .all()
    tags = Tag.query.all()

    return render_template(
        'posts_by_tag.html',
        blogs=blogs,
        tag=tag,
        tags=tags,
        user=current_user
    )

