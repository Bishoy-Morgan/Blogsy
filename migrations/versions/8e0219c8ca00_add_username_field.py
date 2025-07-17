"""Add username field

Revision ID: 8e0219c8ca00
Revises: 5a1a5e2a7637
Create Date: 2025-07-17 13:11:31.277315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8e0219c8ca00'
down_revision = '5a1a5e2a7637'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Add the username column nullable initially
    with op.batch_alter_table('user') as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=150), nullable=True))

    # 2. Generate usernames for existing users
    # You can run SQL to update existing rows:
    op.execute(
        """
        UPDATE user
        SET username = lower(replace(coalesce(first_name, 'user'), ' ', ''))
        WHERE username IS NULL
        """
    )

    # 3. Alter the username column to NOT NULL and add unique constraint
    with op.batch_alter_table('user') as batch_op:
        batch_op.alter_column('username', nullable=False)
        batch_op.create_unique_constraint('uq_user_username', ['username'])


    # ### end Alembic commands ###
