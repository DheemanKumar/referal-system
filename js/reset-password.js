const API_BASE = 'https://lead-manager-production.up.railway.app';

document.getElementById('resetBtn').addEventListener('click', async () => {
  const password = document.getElementById('newPassword').value.trim();
  const msg = document.getElementById('resetMsg');
  msg.textContent = '';
  const email = localStorage.getItem('forgotEmail');
  if (!password || !email) {
    msg.textContent = 'Please enter the new password.';
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password })
    });
    const data = await res.json();
    if (data.message) {
      localStorage.removeItem('forgotEmail');
      localStorage.removeItem('forgotToken');
      localStorage.removeItem('resetToken');
      window.location.href = 'index.html';
    } else {
      msg.textContent = data.error || 'Something went wrong';
    }
  } catch {
    msg.textContent = 'Network error. Please try again.';
  }
});
