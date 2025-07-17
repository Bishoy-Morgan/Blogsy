from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from datetime import datetime, timezone
from sqlalchemy.orm import object_session
from sqlalchemy import event

# Association table for many-to-many Blog <-> Tag
blog_tags = db.Table('blog_tags',
    db.Column('blog_id', db.Integer, db.ForeignKey('blog.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

# Association table for many-to-many User <-> User (followers)
followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

# Association table for many-to-many User <-> Blog (reading list)
reading_list = db.Table('reading_list',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('blog_id', db.Integer, db.ForeignKey('blog.id'), primary_key=True)
)

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250))
    content = db.Column(db.Text)
    image_filename = db.Column(db.String(255), nullable=False, default='default.jpg')
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='blogs')
    
    tags = db.relationship('Tag', secondary=blog_tags, back_populates='blogs')
    likes = db.relationship('Like', back_populates='blog', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='blog', cascade='all, delete-orphan')


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    blogs = db.relationship('Blog', secondary=blog_tags, back_populates='tags')
from sqlalchemy.orm import object_session
from sqlalchemy import event
from datetime import datetime, timezone

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    profile_image = db.Column(db.String(200), nullable=True)
    date_created = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    blogs = db.relationship('Blog', back_populates='author')

    # Followers system
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    reading_list = db.relationship('Blog', secondary=reading_list, backref='saved_by')

    likes = db.relationship('Like', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    
    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).count() > 0

    def is_followed_by(self, user):
        return self.followers.filter(followers.c.follower_id == user.id).count() > 0

# Event listener to generate username before insert/update
def generate_username(target, value, oldvalue, initiator):
    if not target.username or target.username == "user":
        base = (target.first_name or "user").strip().lower().replace(" ", "_")
        session = object_session(target)
        if not session:
            target.username = base
            return

        username = base
        counter = 1
        while session.query(User).filter(User.username == username).first():
            username = f"{base}{counter}"
            counter += 1
        
        target.username = username

# Listen for first_name changes or username initially unset
event.listen(User.first_name, 'set', generate_username, retval=False)
event.listen(User, 'before_insert', lambda mapper, connection, target: generate_username(target, None, None, None))

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'))
    timestamp = db.Column(db.DateTime(timezone=True), default=func.now())

    user = db.relationship('User', back_populates='likes')
    blog = db.relationship('Blog', back_populates='likes')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'))

    user = db.relationship('User', back_populates='comments')
    blog = db.relationship('Blog', back_populates='comments')
