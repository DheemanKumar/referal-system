// earning.js
// Handles fetching and rendering earning breakdown for the employee

const API_BASE = 'https://lead-manager-production.up.railway.app';

document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const btnDashboard = document.getElementById('btn-dashboard');
  if (btnDashboard) btnDashboard.addEventListener('click', function() {
    window.location.href = 'dashbord.html';
  });
  const btnRefer = document.getElementById('btn-refer');
  if (btnRefer) btnRefer.addEventListener('click', function() {
    window.location.href = 'refer.index.html';
  });
  const btnEarning = document.getElementById('btn-earning');
  if (btnEarning) btnEarning.addEventListener('click', function() {
    window.location.href = 'earning.html';
  });
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    try {
      await fetch(API_BASE + '/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
    } catch (err) {}
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  async function fetchEarningBreakdown() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/earning/breakdown', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      console.log(data);
      // Set earning summary
      document.getElementById('total-earning').textContent = '₹' + (data.totalEarning || 0);
      document.getElementById('bonus').textContent = '₹' + (data.bonus || 0);
      document.getElementById('final-earning').textContent = '₹' + (data.finalEarning || 0);
      // Also update the summary card's final earning
      var finalEarningSummary = document.getElementById('final-earning-summary');
      if(finalEarningSummary) {
        finalEarningSummary.textContent = '₹' + (data.finalEarning || 0);
      }
      // Update user info
      
        document.getElementById('user-name').textContent = data.user_name || '';
        document.getElementById('user-email').textContent = data.email || '';
        document.getElementById('user-employee-id').textContent = 'Employee ID: ' + (data.employee_id || '');
      
      // Render earning breakdown
      const list = document.getElementById('earning-list');
list.innerHTML = '';

if (!data.leads || data.leads.length === 0) {
  list.innerHTML = `
    <div class="text-center py-5 text-muted bg-white shadow-sm rounded-4">
      <i class="bi bi-graph-up-arrow fs-1 mb-3 text-secondary"></i>
      <div class="fw-semibold">No earning breakdown available</div>
    </div>
  `;
} else {
  data.leads.forEach(lead => {
    const card = document.createElement('div');
    card.className = 'card mb-3 shadow-sm border-0 rounded-4';

    let badgeClass = 'bg-success-subtle text-success-emphasis';
    let earningText = `₹${lead.earning}`;
    if (lead.copy === true || lead.eligibility === false) {
      badgeClass = 'bg-secondary-subtle text-secondary-emphasis';
      earningText = 'Ineligible';
    }

    card.innerHTML = `
      <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div>
          <h6 class="mb-1 fw-semibold text-dark">${lead.name}</h6>
          <div class="text-muted small text-capitalize">${lead.status}</div>
        </div>
        <div class="mt-3 mt-md-0">
          <span class="badge ${badgeClass} px-3 py-2 rounded-pill">${earningText}</span>
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
  fetchEarningBreakdown();
});
