// devindex.js
// Handles admin registration for devindex.html

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    registerForm.onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const employee_id = document.getElementById('reg-employeeid').value;
        const password = document.getElementById('reg-password').value;
        const errorMsg = document.getElementById('reg-error-msg');
        errorMsg.style.display = 'none';
        const body = {
            name: name,
            email: email,
            password: password,
            is_admin: true,
            employee_id: employee_id
        };
        try {
            const res = await fetch('https://lead-manager-production.up.railway.app/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            console.log('Registration response:', data);
            if (data.message === 'Admin registered successfully') {
                // Show success popup
                const popup = document.createElement('div');
                popup.style.position = 'fixed';
                popup.style.top = 0;
                popup.style.left = 0;
                popup.style.width = '100vw';
                popup.style.height = '100vh';
                popup.style.background = 'rgba(0,0,0,0.5)';
                popup.style.display = 'flex';
                popup.style.alignItems = 'center';
                popup.style.justifyContent = 'center';
                popup.style.zIndex = 9999;
                popup.innerHTML = `
                  <div style="background:#fff;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 2px 16px #0002;text-align:center;max-width:90vw;">
                    <h4 class="mb-3 text-success">Registration Successful</h4>
                    <button id="popup-ok-btn" class="btn btn-primary">OK</button>
                  </div>
                `;
                document.body.appendChild(popup);
                document.getElementById('popup-ok-btn').onclick = function() {
                  popup.remove();
                  window.location.href = 'devdashbord.html';
                };
                return;
            }
            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'devdashbord.html';
            } else {
                errorMsg.textContent = data.error || 'Registration failed';
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Network error';
            errorMsg.style.display = 'block';
        }
    };
});
