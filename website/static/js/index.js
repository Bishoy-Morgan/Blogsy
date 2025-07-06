document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    const profileContainer = document.getElementById('profileContainer');

    if (profileBtn && profileContainer) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileContainer.classList.toggle('d-none');
        });

        document.addEventListener('click', function() {
            if (!profileContainer.classList.contains('d-none')) {
                profileContainer.classList.add('d-none');
            }
        });

        profileContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// Alert Button function
document.addEventListener("DOMContentLoaded", function () {
    const closeButtons = document.querySelectorAll(".alert-style");
    closeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const alertBox = btn.closest(".alert-style");
            if (alertBox) {
                alertBox.remove();
            }
        });
    });
});

// Like button 
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
                const blogId = this.dataset.blogId;
                const countSpan = this.querySelector('.like-count');

                fetch(`/like/${blogId}`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                }).then(res => {
                    if (res.ok) {
                        countSpan.textContent = parseInt(countSpan.textContent) + 1;
                    }
            });
        });
});

document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const blogId = form.dataset.blogId;
        const input = form.querySelector('input[name="content"]');
        const content = input.value.trim();

        if (!content) return;

        try {
        const response = await fetch(`/comment/add/${blogId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            // Include CSRF token header here if applicable
            },
            body: new URLSearchParams({ content })
        });

        if (!response.ok) {
            const error = await response.json();
                alert(error.error || 'Failed to add comment.');
            return;
        }

        const data = await response.json();

        // Update the comments list
        const commentsList = form.nextElementSibling; // The div.comments-list
        const commentCountSpan = document.querySelector(`button.comment-btn[data-blog-id="${blogId}"] .comment-count`);

        const newComment = document.createElement('p');
        newComment.innerHTML = `<strong>${data.user}:</strong> ${data.content}`;
        commentsList.appendChild(newComment);

        commentCountSpan.textContent = data.comment_count;

        input.value = '';
        } catch (err) {
            alert('Error submitting comment.');
            console.error(err);
        }
    });
});

// Reading List 
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reading-list-form').forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const blogId = this.action.split('/').pop();
            const img = this.querySelector('.reading-list-icon');

            const response = await fetch(`/reading-list/toggle/${blogId}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            if (data.saved !== undefined) {
                const saveIcon = img.dataset.save;
                const removeSaveIcon = img.dataset.removeSave;
                img.src = data.saved ? removeSaveIcon : saveIcon;
            }
        });
    });
});




