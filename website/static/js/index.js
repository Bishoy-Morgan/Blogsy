// UTILITY FUNCTIONS

function getElement(id) {
    return document.getElementById(id);
}


// Make API request with error handling

async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// UI COMPONENTS

// Mobile Menu Toggle
const MobileMenu = {
    init() {
        const hamburger = getElement('hamburger');
        const mobileMenu = getElement('mobileMenu');
        const menuOverlay = getElement('menuOverlay');

        if (!hamburger || !mobileMenu || !menuOverlay) {
            console.warn('Mobile menu elements not found:', {
                hamburger: !!hamburger,
                mobileMenu: !!mobileMenu,
                menuOverlay: !!menuOverlay
            });
            return;
        }

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });

        console.log('Mobile menu initialized successfully');
    }
};

// Profile Dropdown Handler

const ProfileDropdown = {
    init() {
        const profileBtn = getElement('profileBtn');
        const profileContainer = getElement('profileContainer');

        if (!profileBtn || !profileContainer) return;

        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('d-none');
        });

        document.addEventListener('click', () => {
            if (!profileContainer.classList.contains('d-none')) {
                profileContainer.classList.add('d-none');
            }
        });

        profileContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
};

// Password Visibility Toggle

const PasswordToggle = {
    init() {
        const eyeIcon = "/static/icons/eye.svg";
        const eyeSlashIcon = "/static/icons/eye-slash.svg";

        const toggleConfigs = [
            { inputId: "password", buttonId: "toggle-password", iconId: "toggle-icon" },
            { inputId: "password1", buttonId: "toggle-password1", iconId: "toggle-icon1" }
        ];

        toggleConfigs.forEach(config => {
            const passwordInput = getElement(config.inputId);
            const toggleBtn = getElement(config.buttonId);
            const toggleIcon = getElement(config.iconId);

            if (!passwordInput || !toggleBtn || !toggleIcon) return;

            toggleBtn.addEventListener("click", () => {
                const isHidden = passwordInput.type === "password";
                passwordInput.type = isHidden ? "text" : "password";
                toggleIcon.src = isHidden ? eyeSlashIcon : eyeIcon;
                toggleIcon.alt = isHidden ? "Hide Password" : "Show Password";
            });
        });
    }
};


// Alert Messages Handler

const AlertHandler = {
    init() {
        const alertBoxes = document.querySelectorAll(".alert-style");

        alertBoxes.forEach(alertBox => {
            setTimeout(() => alertBox.remove(), 3000);

            alertBox.addEventListener("click", () => alertBox.remove());
        });
    }
};


// Profile Tabs Handler

const ProfileTabs = {
    init() {
        const tabButtons = document.querySelectorAll('#profileTab .nav-link');
        const tabSections = document.querySelectorAll('.tab-section');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabSections.forEach(tab => tab.classList.add('d-none'));

                // Activate current tab
                button.classList.add('active');
                const section = getElement(button.dataset.tab);
                if (section) {
                    section.classList.remove('d-none');
                    section.classList.add('active');
                }
            });
        });
    }
};


// BLOG INTERACTIONS

const LikeSystem = {
    init() {
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', this.handleLike.bind(this));
        });
    },

    async handleLike(e) {
        e.preventDefault();

        const button = e.currentTarget;
        const blogId = button.dataset.blogId;
        const countSpan = button.querySelector('.like-count');
        const clapIcon = button.querySelector('img');

        try {
            const response = await makeRequest(`/like/${blogId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
                clapIcon.classList.add('clapped');
            }
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    }
};


// Comment System Handler

const CommentSystem = {
    init() {
        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        });
    },

    async handleSubmit(e) {
        e.preventDefault();

        const form = e.currentTarget;
        const blogId = form.dataset.blogId;
        const input = form.querySelector('input[name="content"]');
        const content = input.value.trim();

        if (!content) return;

        try {
            const response = await makeRequest(`/comment/add/${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ content })
            });

            const data = await response.json();
            this.updateCommentsList(form, blogId, data);
            input.value = '';

        } catch (error) {
            alert('Error submitting comment.');
            console.error('Comment submission failed:', error);
        }
    },

    updateCommentsList(form, blogId, data) {
        const commentsList = form.nextElementSibling;
        const commentCountSpan = document.querySelector(`button.comment-btn[data-blog-id="${blogId}"] .comment-count`);

        const newComment = document.createElement('p');
        newComment.innerHTML = `<strong>${data.user}:</strong> ${data.content}`;
        commentsList.appendChild(newComment);

        if (commentCountSpan) {
            commentCountSpan.textContent = data.comment_count;
        }
    }
};


// Reading List Handler

const ReadingList = {
    init() {
        document.querySelectorAll('.reading-list-form').forEach(form => {
            form.addEventListener('submit', this.handleToggle.bind(this));
        });
    },

    async handleToggle(e) {
        e.preventDefault();

        const form = e.currentTarget;
        const blogId = form.action.split('/').pop();
        const img = form.querySelector('.reading-list-icon');

        try {
            const response = await makeRequest(`/reading-list/toggle/${blogId}`, {
                method: 'POST'
            });

            const data = await response.json();
            
            if (data.saved !== undefined) {
                const saveIcon = img.dataset.save;
                const removeSaveIcon = img.dataset.removeSave;
                img.src = data.saved ? removeSaveIcon : saveIcon;
            }
        } catch (error) {
            console.error('Failed to toggle reading list:', error);
        }
    }
};


// USER INTERACTIONS

const FollowSystem = {
    init() {
        this.attachListeners();
    },

    attachListeners() {
        document.querySelectorAll('.follow-form, .unfollow-form').forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        });
    },

    async handleSubmit(e) {
        e.preventDefault();

        const form = e.currentTarget;
        const button = form.querySelector('button');
        const userId = form.closest('[data-user-id]').dataset.userId;

        button.disabled = true;

        try {
            const response = await makeRequest(form.action, {
                method: form.method
            });

            const result = await response.json();

            if (result.success) {
                this.updateFollowButtons(userId, result.following);
                this.removeSuggestionIfFollowed(userId, result.following);
                this.attachListeners(); // Rebind listeners
            } else {
                alert(result.message || 'Failed to update follow status.');
            }

        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            button.disabled = false;
        }
    },

    updateFollowButtons(userId, isFollowing) {
        const newFormHTML = isFollowing
            ? `<form method="POST" action="/unfollow/${userId}" class="unfollow-form"><button type="submit" class="unfollow-btn py-1">Unfollow</button></form>`
            : `<form method="POST" action="/follow/${userId}" class="follow-form"><button type="submit" class="follow-btn py-1">Follow</button></form>`;

        document.querySelectorAll(`[data-user-id="${userId}"]`).forEach(container => {
            const form = container.querySelector('form');
            if (form) form.outerHTML = newFormHTML;
        });
    },

    removeSuggestionIfFollowed(userId, isFollowing) {
        if (isFollowing) {
            const suggestion = document.querySelector(`.follow-content [data-user-id="${userId}"]`);
            if (suggestion) suggestion.remove();
        }
    }
};


// Profile Image Upload Handler

const ProfileImageUpload = {
    init() {
        this.initEditButton();
        this.initFileUpload();
        this.initProfileModal();
    },

    initEditButton() {
        const editBtn = getElement('edit-btn');
        const uploadForm = getElement('upload-form');
        const closeFormBtn = getElement('close-form-btn');

        if (editBtn && uploadForm) {
            editBtn.addEventListener('click', () => {
                uploadForm.style.display = uploadForm.style.display === 'none' ? 'flex' : 'none';
            });
        }

        if (closeFormBtn && uploadForm) {
            closeFormBtn.addEventListener('click', () => {
                uploadForm.style.display = 'none';
            });
        }
    },

    initFileUpload() {
        const realFileInput = getElement('real-file');
        const chooseFileBtn = getElement('choose-file-btn');
        const fileName = getElement('file-name');

        if (chooseFileBtn && realFileInput) {
            chooseFileBtn.addEventListener('click', () => {
                realFileInput.click();
            });
        }

        if (realFileInput && fileName) {
            realFileInput.addEventListener('change', () => {
                fileName.textContent = realFileInput.files.length > 0 
                    ? realFileInput.files[0].name 
                    : 'No file chosen';
            });
        }
    },

    initProfileModal() {
        const editProfileBtn = getElement('edit-profile-btn');
        const profileModal = getElement('edit-profile-modal');
        const closeProfileModal = getElement('close-edit-modal');

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
    }
};


// Profile Followers/Following Sidebar

const ProfileSidebar = {
    init() {
        const followersBtn = document.querySelector('.followers-btn');
        const followingBtn = document.querySelector('.following-btn');
        const closeBtn = document.querySelector('.close-profile-container');
        const sideContainer = getElement('profile-side-container');
        const followersList = getElement('followers-list');
        const followingList = getElement('following-list');

        if (followersBtn && sideContainer && followersList && followingList) {
            followersBtn.addEventListener('click', () => {
                sideContainer.style.display = 'block';
                followersList.style.display = 'block';
                followingList.style.display = 'none';
            });
        }

        if (followingBtn && sideContainer && followingList && followersList) {
            followingBtn.addEventListener('click', () => {
                sideContainer.style.display = 'block';
                followingList.style.display = 'block';
                followersList.style.display = 'none';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const container = document.querySelector('.profile-side-container');
                if (container) container.style.display = 'none';
            });
        }
    }
};


// SEARCH AND PAGINATION

// Tag Search Handler

const TagSearch = {
    init() {
        const tagSearchInput = getElement('tag-search');
        if (!tagSearchInput) return;

        tagSearchInput.addEventListener('input', this.handleSearch.bind(this));
    },

    async handleSearch(e) {
        const query = e.target.value;
        
        try {
            const response = await makeRequest(`/all-tags?q=${encodeURIComponent(query)}`);
            const tags = await response.json();
            this.renderTags(tags);
        } catch (error) {
            console.error('Tag search failed:', error);
        }
    },

    renderTags(tags) {
        const tagList = getElement('tag-list');
        if (!tagList) return;

        tagList.innerHTML = '';

        if (tags.length === 0) {
            tagList.innerHTML = '<p>No topics found.</p>';
            return;
        }

        tags.forEach(tag => {
            const link = document.createElement('a');
            link.href = `/tag/${tag.id}`;
            link.className = 'topic text-decoration-none';
            link.textContent = tag.name;
            tagList.appendChild(link);
        });
    }
};


// Infinite Scroll Blog Loader

const BlogLoader = {
    offset: 10,
    limit: 10,
    loading: false,
    finished: false,

    init() {
        this.blogsContainer = getElement('blogs-container');
        this.loader = getElement('loading');
        
        if (!this.blogsContainer || !this.loader) return;

        window.addEventListener('scroll', this.handleScroll.bind(this));
    },

    handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.body.offsetHeight - 100;

        if (scrollPosition > threshold) {
            this.loadMoreBlogs();
        }
    },

    async loadMoreBlogs() {
        if (this.loading || this.finished) return;

        this.loading = true;
        this.loader.style.display = 'block';

        try {
            const response = await fetch(`/load_blogs?offset=${this.offset}&limit=${this.limit}`);
            
            if (response.status === 204) {
                this.finished = true;
                this.loader.innerHTML = "<p class='text-muted'>No more blogs.</p>";
                return;
            }

            const html = await response.text();
            if (html) {
                this.blogsContainer.insertAdjacentHTML('beforeend', html);
                this.offset += this.limit;
            }

        } catch (error) {
            console.error("Error loading blogs:", error);
        } finally {
            this.loading = false;
            this.loader.style.display = this.finished ? 'block' : 'none';
        }
    }
};


// APPLICATION INITIALIZATION

// Initialize all components when DOM is ready

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing components...');
    
    // UI Components
    MobileMenu.init();
    ProfileDropdown.init();
    PasswordToggle.init();
    AlertHandler.init();
    ProfileTabs.init();
    
    // Blog Interactions
    LikeSystem.init();
    CommentSystem.init();
    ReadingList.init();
    
    // User Interactions
    FollowSystem.init();
    ProfileImageUpload.init();
    ProfileSidebar.init();
    
    // Search and Pagination
    TagSearch.init();
    BlogLoader.init();
    
    console.log('All components initialized successfully');
});