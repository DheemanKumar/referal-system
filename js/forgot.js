const API_BASE = 'https://lead-manager-production.up.railway.app';

document.getElementById('forgotBtn').addEventListener('click', async () => {
  const email = document.getElementById('forgotEmail').value.trim();
  const msg = document.getElementById('forgotMsg');
  const btn = document.getElementById('forgotBtn');
  msg.textContent = '';
  if (!email) {
    msg.textContent = 'Please enter the mail id';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('forgotToken', data.token);
      localStorage.setItem('forgotEmail', email);
      window.location.href = 'forgot-otp.html';
    } else {
      msg.textContent = data.error || 'Something went wrong';
      btn.disabled = false;
      btn.textContent = 'Send OTP';
    }
  } catch {
    msg.textContent = 'Network error. Please try again.';
    btn.disabled = false;
    btn.textContent = 'Send OTP';
  }
});
