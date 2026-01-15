const supabaseUrl = 'https://wloeprmsskjevlkugxjz.supabase.co';
const supabaseAnonKey = 'sb_publishable_8lHhBPeTEv4kC3zopeYuow_ywsBkDnP';

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseAnonKey
);

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.querySelector('.auth-form');
    if (!authForm) return;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value?.trim();
        const password1 = document.getElementById('password1')?.value;
        const password2Input = document.getElementById('password2');
        const password2 = password2Input ? password2Input.value : null;
        const fullName = document.getElementById('firstName')?.value?.trim();

        if (!email || !password1) {
            alert('Missing email or password');
            return;
        }

        let authResult;

        // SIGN UP
        if (password2 !== null) {
            if (password1 !== password2) {
                alert('Passwords do not match');
                return;
            }

            authResult = await supabaseClient.auth.signUp({
                email,
                password: password1,
                options: {
                    data: {
                        full_name: fullName || 'User'
                    }
                }
            });
        }

        // LOGIN
        else {
            authResult = await supabaseClient.auth.signInWithPassword({
                email,
                password: password1
            });
        }

        const { data, error } = authResult;

        if (error || !data?.user) {
            alert(error?.message || 'Authentication failed');
            return;
        }

        // SYNC WITH FLASK
        await fetch('/supabase-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.user.email,
                first_name: data.user.user_metadata?.full_name || fullName || 'User'
            })
        });

        window.location.href = '/home';
    });
});
