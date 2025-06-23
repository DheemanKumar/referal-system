const API_BASE = 'https://lead-manager-production.up.railway.app';

document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
  const otp = document.getElementById('otpInput').value.trim();
  const msg = document.getElementById('otpMsg');
  msg.textContent = '';
  const email = localStorage.getItem('forgotEmail');
  if (!otp || !email) {
    msg.textContent = 'Please enter the OTP.';
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-forgot-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (data.resetToken) {
      localStorage.setItem('resetToken', data.resetToken);
      window.location.href = 'reset-password.html';
    } else {
      msg.textContent = data.error || 'Invalid OTP';
    }
  } catch {
    msg.textContent = 'Network error. Please try again.';
  }
});
