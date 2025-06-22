// main.js

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const API_BASE = 'https://lead-manager-production.up.railway.app';
    // Login
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');
        errorMsg.style.display = 'none';
        try {
            const res = await fetch(API_BASE + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                if (data.is_admin) {
                    window.location.href = 'devdashbord.html';
                } else {
                    window.location.href = 'dashbord.html';
                }
            } else {
                errorMsg.textContent = data.error || 'Login failed';
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Network error';
            errorMsg.style.display = 'block';
        }
    });
    // Register (with OTP)
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const employee_id = document.getElementById('reg-employeeid').value;
        const password = document.getElementById('reg-password').value;
        const errorMsg = document.getElementById('reg-error-msg');
        errorMsg.style.display = 'none';
        const body = { name: username, email, employee_id, password, is_admin: false };
        try {
            const res = await fetch(API_BASE + '/api/auth/signup-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok && data.message && data.token) {
                // OTP sent, redirect to OTP page
                localStorage.setItem('otp_email', email);
                window.location.href = 'otp.html';
            } else {
                errorMsg.textContent = data.error || 'Registration failed';
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Network error';
            errorMsg.style.display = 'block';
        }
    });
});
