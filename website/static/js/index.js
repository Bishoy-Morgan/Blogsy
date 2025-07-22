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

// Password visibility
document.addEventListener("DOMContentLoaded", function () {
    const eye = "/static/images/eye.svg";
    const eyeSlash = "/static/images/eye-slash.svg";

    const toggleConfigs = [
        {
            inputId: "password",
            buttonId: "toggle-password",
            iconId: "toggle-icon"
        },
        {
            inputId: "password1",
            buttonId: "toggle-password1",
            iconId: "toggle-icon1"
        }
    ];

    toggleConfigs.forEach(config => {
        const passwordInput = document.getElementById(config.inputId);
        const toggleBtn = document.getElementById(config.buttonId);
        const toggleIcon = document.getElementById(config.iconId);

        if (passwordInput && toggleBtn && toggleIcon) {
            toggleBtn.addEventListener("click", function () {
                const isHidden = passwordInput.type === "password";
                passwordInput.type = isHidden ? "text" : "password";
                toggleIcon.src = isHidden ? eyeSlash : eye;
                toggleIcon.alt = isHidden ? "Hide Password" : "Show Password";
            });
        }
    });
});


// Alert Button function
document.addEventListener("DOMContentLoaded", function () {
    const alertBoxes = document.querySelectorAll(".alert-style");

    alertBoxes.forEach(function (alertBox) {
        setTimeout(() => {
            alertBox.remove();
        }, 3000);

        alertBox.addEventListener("click", function () {
            alertBox.remove();
        });
    });
});

// Clap button 
document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        const blogId = this.dataset.blogId;
        const countSpan = this.querySelector('.like-count');
        const clapIcon = this.querySelector('img');

        fetch(`/like/${blogId}`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        }).then(res => {
            if (res.ok) {
                // Increase count visually
                countSpan.textContent = parseInt(countSpan.textContent) + 1;

                // Toggle orange effect
                clapIcon.classList.add('clapped');  // Add orange color
            }
        });
    });
});

// Comment 
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

// Profile Image 
document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const uploadForm = document.getElementById('upload-form');
    const closeFormBtn = document.getElementById('close-form-btn');
    const realFileInput = document.getElementById('real-file');
    const chooseFileBtn = document.getElementById('choose-file-btn');
    const fileName = document.getElementById('file-name');

    if (editBtn && uploadForm) {
        editBtn.addEventListener('click', () => {
            if (uploadForm.style.display === 'none' || uploadForm.style.display === '') {
                uploadForm.style.display = 'flex'; // since form uses flexbox
            } else {
                uploadForm.style.display = 'none';
            }
        });
    }

    if (closeFormBtn && uploadForm) {
        closeFormBtn.addEventListener('click', () => {
            uploadForm.style.display = 'none';
        });
    }

    if (chooseFileBtn && realFileInput) {
        chooseFileBtn.addEventListener('click', () => {
            realFileInput.click();
        });
    }

    if (realFileInput && fileName) {
        realFileInput.addEventListener('change', () => {
            if (realFileInput.files.length > 0) {
                fileName.textContent = realFileInput.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const uploadForm = document.getElementById('upload-form');
    const closeBtn = document.getElementById('close-form-btn');

    if (editBtn && uploadForm) {
        editBtn.addEventListener('click', () => {
            uploadForm.style.display = 'block';
        });
    }

    if (closeBtn && uploadForm) {
        closeBtn.addEventListener('click', () => {
            uploadForm.style.display = 'none';
        });
    }

    // Handle profile modal
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileModal = document.getElementById('edit-profile-modal');
    const closeProfileModal = document.getElementById('close-edit-modal');

    if (editProfileBtn && profileModal) {
        editProfileBtn.addEventListener('click', () => {
            profileModal.style.display = 'block';
        });
    }

    if (closeProfileModal && profileModal) {
        closeProfileModal.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }
});


// Follow system
document.addEventListener('DOMContentLoaded', () => {
    attachFollowListeners();
});

function attachFollowListeners() {
    document.querySelectorAll('.follow-form, .unfollow-form').forEach(form => {
        form.addEventListener('submit', handleFollowSubmit);
    });
}

async function handleFollowSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const url = form.action;
    const method = form.method;
    const userId = form.closest('[data-user-id]').dataset.userId;
    const button = form.querySelector('button');
    button.disabled = true;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        if (result.success) {
            // New form HTML
            const newFormHTML = result.following
                ? `<form method="POST" action="/unfollow/${userId}" class="unfollow-form"><button type="submit" class="unfollow-btn py-1">Unfollow</button></form>`
                : `<form method="POST" action="/follow/${userId}" class="follow-form"><button type="submit" class="follow-btn py-1">Follow</button></form>`;

            // Update ALL follow/unfollow forms on page for this user
            document.querySelectorAll(`[data-user-id="${userId}"]`).forEach(container => {
                const form = container.querySelector('form');
                if (form) form.outerHTML = newFormHTML;
            });

            // Remove user from suggestion sidebar if just followed
            if (result.following) {
                const suggestion = document.querySelector(`.follow-content [data-user-id="${userId}"]`);
                if (suggestion) suggestion.remove();
            }

            attachFollowListeners(); // Rebind listeners
        } else {
            alert(result.message || 'Failed to update follow status.');
        }

    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        button.disabled = false;
    }
}

// user-profile page tabs 
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('#profileTab .nav-link');
    const tabSections = document.querySelectorAll('.tab-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabSections.forEach(tab => tab.classList.add('d-none'));

            // Activate current
            button.classList.add('active');
            const section = document.getElementById(button.dataset.tab);
            section.classList.remove('d-none');
            section.classList.add('active');
        });
    });
});

// search tags 
document.addEventListener('DOMContentLoaded', () => {
    const tagSearchInput = document.getElementById('tag-search');
    if (tagSearchInput) {
        tagSearchInput.addEventListener('input', function() {
            const q = this.value;
                fetch(`/all-tags?q=${encodeURIComponent(q)}`, {
                headers: {'X-Requested-With': 'XMLHttpRequest'}
            })
            .then(response => response.json())
            .then(tags => {
                const tagList = document.getElementById('tag-list');
                tagList.innerHTML = '';
                if (tags.length === 0) {
                    tagList.innerHTML = '<p>No topics found.</p>';
                } else {
                    tags.forEach(tag => {
                    const a = document.createElement('a');
                    a.href = `/tag/${tag.id}`;
                    a.className = 'topic text-decoration-none';
                    a.textContent = tag.name;
                    tagList.appendChild(a);
                    });
                }
            });
        });
    }
});

let offset = 10;
const limit = 10;
let loading = false;
let finished = false;

const blogsContainer = document.getElementById('blogs-container');
const loader = document.getElementById('loading');

function loadMoreBlogs() {
    if (loading || finished) return;

    loading = true;
    loader.style.display = 'block';

    fetch(`/load_blogs?offset=${offset}&limit=${limit}`)
        .then(response => {
        if (response.status === 204) {
            finished = true;
                loader.innerText = "No more blogs.";
            return '';
        }
        return response.text();
        })
        .then(html => {
        if (html) {
            blogsContainer.insertAdjacentHTML('beforeend', html);
            offset += limit;
        }
        })
    .catch(err => console.error("Error loading blogs:", err))
    .finally(() => {
        loading = false;
        loader.style.display = finished ? 'block' : 'none';
    });
}

// Detect scroll near bottom
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = document.body.offsetHeight - 100;

    if (scrollPosition > threshold) {
        loadMoreBlogs();
    }
});