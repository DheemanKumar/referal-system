// devearning.js
// Handles fetching and rendering admin earning info for devearning.html

const API_BASE = 'https://lead-manager-production.up.railway.app';

document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const btnDashboard = document.getElementById('btn-dashboard');
  if (btnDashboard) btnDashboard.addEventListener('click', function() {
    window.location.href = 'devdashbord.html';
  });
  const btnEarning = document.getElementById('btn-earning');
  if (btnEarning) btnEarning.addEventListener('click', function() {
    window.location.href = 'devearning.html';
  });
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'devindex.html';
  });

  // Fetch admin earning summary and breakdown
  async function fetchAdminEarnings() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/earning/admin', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      // Render summary
      const summaryDiv = document.getElementById('admin-earning-summary');
      summaryDiv.innerHTML = `<div class='mb-2'><strong>Total Earnings:</strong> ₹${data.total_earning || 0}</div>`;
      // Render breakdown
      const breakdownDiv = document.getElementById('admin-earning-breakdown');
      if (data.breakdown && data.breakdown.length > 0) {
        breakdownDiv.innerHTML = `<ul class='list-group'>` +
          data.breakdown.map(item => `<li class='list-group-item d-flex justify-content-between align-items-center'>${item.label}<span>₹${item.amount}</span></li>`).join('') +
          `</ul>`;
      } else {
        breakdownDiv.innerHTML = '<div class="text-muted">No earning breakdown available.</div>';
      }
    } catch (err) {
      document.getElementById('admin-earning-summary').innerHTML = '<div class="text-danger">Failed to load earnings.</div>';
    }
  }
  fetchAdminEarnings();

  // Fetch all employees' earnings
  async function fetchAllEmployeeEarnings() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/earning/admin', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      const employees = data.employees || [];
      // Calculate total earning
      const totalEarning = employees.reduce((sum, emp) => sum + (emp.earning || 0), 0);
      const summaryDiv = document.getElementById('admin-earning-summary');
      summaryDiv.innerHTML = `<div class='mb-2'><strong>Total Earnings:</strong> ₹${totalEarning}</div>`;
      const breakdownDiv = document.getElementById('admin-earning-breakdown');
      if (employees.length > 0) {
        breakdownDiv.innerHTML = `
          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Earning (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${employees.map((emp, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.employee_id}</td>
                    <td>₹${emp.earning}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else {
        breakdownDiv.innerHTML = '<div class="text-muted">No employee earnings available.</div>';
      }
    } catch (err) {
      document.getElementById('admin-earning-breakdown').innerHTML = '<div class="text-danger">Failed to load employee earnings.</div>';
    }
  }
  fetchAllEmployeeEarnings();
});
