// dashbord.js
// Handles dashboard navigation, data fetching, and rendering

const API_BASE = 'https://lead-manager-production.up.railway.app';

document.addEventListener('DOMContentLoaded', function() {
  // Navbar button active state logic
  const navBtns = [
    document.getElementById('btn-dashboard'),
    document.getElementById('btn-refer'),
    document.getElementById('btn-earning')
  ];
  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      navBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.getElementById('btn-dashboard').addEventListener('click', function() {
    window.location.href = 'dashbord.html';
  });
  document.getElementById('btn-refer').addEventListener('click', function() {
    window.location.href = 'refer.index.html';
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  // Fetch dashboard data and render
  async function fetchDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/leads/dashboard', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      // Set user info
      if (data.user) {
        document.getElementById('user-name').textContent = data.user.name || '';
        document.getElementById('user-email').textContent = data.user.email || '';
        document.getElementById('user-employee-id').textContent = 'Employee ID: ' + (data.user.employee_id || '');
        document.getElementById('user-earning').textContent = '₹' + (data.user.earning || 0);
      }
      // Set qualified leads count
      document.getElementById('qualified-leads').textContent = data.count || 0;
      // Render leads
      const leads = data.leads || [];
      const list = document.getElementById('referrals-list');
      list.innerHTML = '';
      if (leads.length === 0) {
        list.innerHTML = '<div class="text-center py-4 text-muted">No referrals yet. Start by adding your first referral!</div>';
      } else {
        leads.forEach(lead => {
          const card = document.createElement('div');
          card.className = 'card mb-3';
          card.innerHTML = `
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h5 class="mb-1">${lead.name}</h5>
                <div class="text-muted small">${lead.mobile} • ${lead.email}</div>
              </div>
              <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
                <span class="badge bg-success text-capitalize">${lead.status}</span>
              </div>
            </div>
          `;
          list.appendChild(card);
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchDashboard();

  async function fetchLeaderboard() {
    try {
      const res = await fetch(API_BASE + '/api/leaderboard/');
      if (!res.ok) return;
      const data = await res.json();
      const leaderboard = data.leaderboard || [];
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '';
      if (leaderboard.length === 0) {
        list.innerHTML = '<div class="text-center py-4 text-muted">No leaderboard data available</div>';
      } else {
        leaderboard.forEach((entry, idx) => {
          const card = document.createElement('div');
          card.className = 'card mb-2';
          card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center p-2">
              <div class="d-flex align-items-center">
                <span class="badge bg-primary me-2">#${idx + 1}</span>
                <span class="fw-bold">${entry.name}</span>
              </div>
              <span class="badge bg-success">${entry.lead_count} leads</span>
            </div>
          `;
          list.appendChild(card);
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchLeaderboard();
});
