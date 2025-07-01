from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Blog
from flask_login import current_user

views = Blueprint('views', __name__)

@views.route('/')
def welcome():
    return render_template('welcome.html', user=current_user)

@views.route('/home')
@login_required
def home():
    blogs = Blog.query.order_by(Blog.date_created.desc()).all()
    return render_template('home.html', user=current_user, blogs=blogs)

@views.route('/write', methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')

        if len(title) < 5:
            flash('Title must be greater than 5 characters.', category='error')
        elif len(content) < 100:
            flash('Content must be at least 100 characters.', category='error')
        else:
            new_blog = Blog(
                title = title,
                content = content,
                author_id=current_user.id
            )
            db.session.add(new_blog)
            db.session.commit()
            flash('Post created successfully!', category='success')
            return redirect(url_for('views.home'))
    return render_template('write.html', user=current_user)

