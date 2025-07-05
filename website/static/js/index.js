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