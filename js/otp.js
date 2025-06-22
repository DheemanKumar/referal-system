// otp.js
// Handles OTP verification for registration

document.addEventListener('DOMContentLoaded', function() {
    const otpForm = document.getElementById('otp-form');
    const otpErrorMsg = document.getElementById('otp-error-msg');
    const API_BASE = 'https://lead-manager-production.up.railway.app';

    otpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let email = document.getElementById('otp-email').value;
        const otp = document.getElementById('otp-code').value;
        otpErrorMsg.style.display = 'none';
        // Autofill email from localStorage if present
        if (!email && localStorage.getItem('otp_email')) {
            email = localStorage.getItem('otp_email');
            document.getElementById('otp-email').value = email;
        }
        try {
            const res = await fetch(API_BASE + '/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (res.ok && data.message) {
                alert('Registration complete. You can now log in.');
                localStorage.removeItem('otp_email');
                window.location.href = 'index.html';
            } else {
                otpErrorMsg.textContent = data.error || 'OTP verification failed';
                otpErrorMsg.style.display = 'block';
            }
        } catch (err) {
            otpErrorMsg.textContent = 'Network error';
            otpErrorMsg.style.display = 'block';
        }
    });
    // Autofill email on page load
    const emailInput = document.getElementById('otp-email');
    if (localStorage.getItem('otp_email')) {
        emailInput.value = localStorage.getItem('otp_email');
    }
});
