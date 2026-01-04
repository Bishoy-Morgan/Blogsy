from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app, jsonify
from flask_login import login_required, current_user
from . import db
from .models import Blog, Like, Comment, Tag, User
import os
from werkzeug.utils import secure_filename
from .utils import save_compressed_image
from PIL import Image

views = Blueprint('views', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@views.route('/')
def welcome():
    return render_template('welcome.html', current_user=current_user,  GA_MEASUREMENT_ID=current_app.config['GA_MEASUREMENT_ID'])

#Explore Page
@views.route('/explore')
def explore():
    blogs = Blog.query.order_by(Blog.date_created.desc()).limit(10).all()
    tags = Tag.query.all()
    suggested_users = User.query.limit(3).all()

    return render_template(
        "explore.html",
        blogs=blogs,
        tags=tags,
        suggested_users=suggested_users
    )

@views.route('/home')
@login_required
def home():
    offset = 0
    limit = 10
    
    blogs = Blog.query.order_by(Blog.date_created.desc()).offset(offset).limit(limit).all()
    tags = Tag.query.all()
    
    suggested_users = (
        User.query
        .filter(User.id != current_user.id)
        .filter(~User.followers.any(id=current_user.id))
        .limit(3)
        .all()
    )

    return render_template(
        "home.html",
        blogs=blogs,
        tags=tags,
        suggested_users=suggested_users
    )

#Pricing Page
@views.route('/pricing')
def pricing():
    # You can later pass plan data or user status here
    return render_template('pricing.html', current_user=current_user)

# load more blogs via AJAX
@views.route('/load_blogs')
@login_required
def load_blogs():
    offset = request.args.get('offset', 0, type=int)
    limit = request.args.get('limit', 10, type=int)

    blogs = Blog.query.order_by(Blog.date_created.desc()).offset(offset).limit(limit).all()
    if not blogs:
        return '', 204  # No more blogs

    return render_template('partials/blogs.html', blogs=blogs)

@views.route('/about')
def about():
    return render_template('about.html')

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

    return render_template('write.html')

@views.route('/post/<int:blog_id>', methods=['GET', 'POST'])
@login_required
def view_post(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    reading_ids = [b.id for b in current_user.reading_list]

    return render_template('post.html', blog=blog, current_user=current_user, reading_ids=reading_ids)

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


# Upload user profile image
@views.route('/upload_profile_image', methods=['POST'])
@login_required
def upload_profile_image():
    file = request.files.get('profile_image')

    if not file or file.filename == '':
        flash('No image selected.', category='error')
        return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))

    if not allowed_file(file.filename):
        flash('Allowed image types are png, jpg, jpeg, gif.', category='error')
        return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))

    try:
        # Prepare the secure filename and path
        _, ext = os.path.splitext(secure_filename(file.filename))
        filename = f"user_{current_user.id}{ext.lower()}"
        upload_folder = os.path.join('website', 'static', 'profile_images')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)

        # Open and convert the image
        image = Image.open(file)
        image = image.convert("RGB")  # Ensure consistent format
        
        # Crop to square (center crop)
        width, height = image.size
        size = min(width, height)
        
        # Calculate crop box for center crop
        left = (width - size) // 2
        top = (height - size) // 2
        right = left + size
        bottom = top + size
        
        # Crop to square
        image = image.crop((left, top, right, bottom))
        
        # Now resize the square image
        image = image.resize((240, 240), Image.LANCZOS)  # High-quality resize
        image.save(file_path, optimize=True, quality=90)

        # Save to database
        current_user.profile_image = filename
        db.session.commit()

        flash('Profile image updated successfully!', category='success')
    except Exception as e:
        print("Image processing error:", e)
        flash('There was an error processing the image.', category='error')

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

    # Safely redirect using updated name or fallback to current
    first_name = new_name if new_name else current_user.first_name
    return redirect(url_for('views.profile', first_name=first_name.replace(' ', '-')))

@views.route('/tag/<int:tag_id>')
@login_required
def posts_by_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    blogs = Blog.query\
        .join(Blog.tags)\
        .filter(Tag.id == tag_id)\
        .order_by(Blog.date_created.desc())\
        .all()
    tags = Tag.query.all()

    suggested_users = (
        User.query
        .filter(User.id != current_user.id)
        .filter(~User.followers.any(id=current_user.id))
        .limit(3)
        .all()
    )

    return render_template(
        'posts_by_tag.html',
        blogs=blogs,
        tag=tag,
        tags=tags,
        suggested_users=suggested_users
    )

# all tags page 
@views.route('/all-tags')
@login_required
def all_tags():
    q = request.args.get('q', '').strip()
    if q:
        tags = Tag.query.filter(Tag.name.ilike(f'%{q}%')).all()
    else:
        tags = Tag.query.all()
    # If AJAX, return JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify([
            {'id': tag.id, 'name': tag.name}
            for tag in tags
        ])
    return render_template('all_tags.html', tags=tags)

# Edit Post 
@views.route('/post/edit/<int:blog_id>', methods=['GET', 'POST'])
@login_required
def edit_post(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    if blog.author_id != current_user.id:
        flash("You don't have permission to edit this post.", 'error')
        return redirect(url_for('views.home'))

    if request.method == 'POST':
        blog.title = request.form.get('title')
        blog.content = request.form.get('content')

        # Handle image update
        if 'image' in request.files:
            image = request.files['image']
            if image and image.filename != '':
                filename = secure_filename(image.filename)
                image_path = os.path.join('website/static/uploads', filename)
                image.save(image_path)
                blog.image_filename = filename 

        db.session.commit()
        flash('Post updated successfully!', 'success')
        return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))

    return render_template('edit-post.html', blog=blog, user=current_user)


# Delete Post 
@views.route('/post/delete/<int:blog_id>', methods=['POST'])
@login_required
def delete_post(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    if blog.author_id != current_user.id:
        flash("You don't have permission to delete this post.", 'error')
        return redirect(url_for('views.home'))

    db.session.delete(blog)
    db.session.commit()
    flash('Post deleted successfully!', 'success')
    return redirect(url_for('views.profile', first_name=current_user.first_name.replace(' ', '-')))


# Following system 
@views.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id):
    user_to_follow = User.query.get_or_404(user_id)
    if user_to_follow == current_user:
        return jsonify({'success': False, 'message': "You can't follow yourself!"}), 400

    current_user.follow(user_to_follow)
    db.session.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'following': True})
    else:
        flash(f'You are now following {user_to_follow.first_name}!', 'success')
        return redirect(url_for('views.profile', first_name=user_to_follow.first_name.replace(' ', '-')))

@views.route('/unfollow/<int:user_id>', methods=['POST'])
@login_required
def unfollow(user_id):
    user_to_unfollow = User.query.get_or_404(user_id)
    current_user.unfollow(user_to_unfollow)
    db.session.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'following': False})
    else:
        flash(f'You have unfollowed {user_to_unfollow.first_name}.', 'info')
        return redirect(url_for('views.profile', first_name=user_to_unfollow.first_name.replace(' ', '-')))

# User Profile 
@views.route('/user/<username>')
@login_required
def user_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        flash("User not found", category='error')
        return redirect(url_for('views.home'))

    blogs = Blog.query.filter_by(author_id=user.id).order_by(Blog.date_created.desc()).all()

    return render_template("user-profile.html", user=user, profile_user=user, blogs=blogs, current_user=current_user)

# Terms 
@views.route('/terms')
def terms():
    return render_template('terms.html', user=current_user)

# Privacy Policy
@views.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html', user=current_user)

