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
      // const summaryDiv = document.getElementById('admin-earning-summary');
      const breakdownDiv = document.getElementById('admin-earning-breakdown');
      // console.log('Employee earnings data:', employees);

      if (employees.length > 0) {
  breakdownDiv.innerHTML = employees.map((emp, idx) => `
    <div class="col-md-6">
      <div class="card h-100 shadow-sm border-0 hover-shadow transition">
        <div class="card-body">
          <h5 class="card-title">${emp.user_name}</h5>
          <p class="card-subtitle text-muted mb-2">${emp.employee_id}</p>
          <p class="mb-1"><strong>Email:</strong> ${emp.submitted_by}</p>
          <p class="mb-1"><strong>Total Earning:</strong> <span class="badge bg-primary">₹${emp.totalEarning}</span></p>
          <p class="mb-1"><strong>Bonus:</strong> <span class="badge bg-success">₹${emp.bonus}</span></p>
          <p class="mb-3"><strong>Final Earning:</strong> <span class="badge bg-dark">₹${emp.finalEarning}</span></p>
          <button class="btn btn-sm btn-outline-info w-100 view-emp-details" data-emp='${JSON.stringify(emp)}'>
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
  const total = employees.reduce((acc, e) => acc + e.finalEarning, 0);
const totalBadge = document.getElementById("total-earned");
if (totalBadge) {
  totalBadge.textContent = `₹${total.toLocaleString()}`;
}
} else {
  breakdownDiv.innerHTML = `
    <div class="text-muted text-center p-4">No employee earnings available.</div>
  `;
}

      // Add event listeners for view buttons
      document.querySelectorAll('.view-emp-details').forEach(btn => {
        btn.addEventListener('click', function() {
          const emp = JSON.parse(this.getAttribute('data-emp'));
          showEmployeeDetailsModal(emp);
        });
      });
    } catch (err) {
      document.getElementById('admin-earning-breakdown').innerHTML = '<div class="text-danger">Failed to load employee earnings.</div>';
    }
  }
  
  fetchAllEmployeeEarnings();
});

// Modal function
function showEmployeeDetailsModal(emp) {
  let modal = document.getElementById('employeeDetailsModal');

  // If modal doesn't exist, create and append it
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'employeeDetailsModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content shadow-sm">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Employee Details</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4" id="employee-details-body"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Fill modal content
  const body = modal.querySelector('#employee-details-body');
  body.innerHTML = `
    <div class="mb-4">
      <h5 class="mb-2">${emp.user_name}</h5>
      <p class="mb-1"><strong>Email:</strong> ${emp.submitted_by}</p>
      <p class="mb-1"><strong>Employee ID:</strong> ${emp.employee_id}</p>
      <p class="mb-1"><strong>Total Earning:</strong> <span class="badge bg-primary">₹${emp.totalEarning}</span></p>
      <p class="mb-1"><strong>Bonus:</strong> <span class="badge bg-success">₹${emp.bonus}</span></p>
      <p class="mb-1"><strong>Final Earning:</strong> <span class="badge bg-dark">₹${emp.finalEarning}</span></p>
    </div>

    <h6 class="text-muted mb-2">Leads Breakdown</h6>
    ${
      (emp.leads && emp.leads.length > 0) ? `
      <div class="table-responsive">
        <table class="table table-sm table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Earning (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${emp.leads.map((lead, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${lead.name}</td>
                <td><span class="badge bg-${lead.status === 'Qualified' ? 'success' : 'secondary'}">${lead.status}</span></td>
                <td>₹${lead.earning}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : `<div class="text-muted">No lead data available.</div>`
    }
  `;

  // Show modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}
