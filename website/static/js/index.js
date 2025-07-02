document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.querySelector('.position-relative');
    const profileContainer = document.querySelector('.profile-container');

    if (profileBtn && profileContainer) {
        // Hide the profile container initially
        profileContainer.classList.add('d-none');

        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileContainer.classList.toggle('d-none');
        });

        // Hide the profile container when clicking outside
        document.addEventListener('click', function() {
            if (!profileContainer.classList.contains('d-none')) {
                profileContainer.classList.add('d-none');
            }
        });

        // Prevent closing when clicking inside the profile container
        profileContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});