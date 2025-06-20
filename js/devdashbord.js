// devdashbord.js
// Handles fetching and rendering admin info and leaderboard for devdashbord.html

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://lead-manager-production.up.railway.app';

  // Navigation
  const btnDashboard = document.getElementById('btn-dashboard');
  if (btnDashboard) btnDashboard.addEventListener('click', function() {
    window.location.href = 'devdashbord.html';
  });
  const btnRefer = document.getElementById('btn-refer');
  if (btnRefer) btnRefer.addEventListener('click', function() {
    window.location.href = 'refer.index.html';
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

  // Fetch admin info
  async function fetchAdminInfo() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/dashboard/admin', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.admin) {
        document.getElementById('user-name').textContent = data.admin.name || '';
        document.getElementById('user-email').textContent = data.admin.email || '';
        document.getElementById('user-admin-id').textContent = 'Admin ID: ' + (data.admin.id || '');
        document.getElementById('is-admin').style.display = data.admin.is_admin ? 'inline-block' : 'none';
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchAdminInfo();

  // Fetch leaderboard (same as dashboard)
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

  // Fetch all leads for admin
  async function fetchAdminLeads() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(API_BASE + '/api/leads/admin/leads', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      const leads = data.leads || [];
      const list = document.getElementById('referrals-list');
      list.innerHTML = '';
      if (leads.length === 0) {
        list.innerHTML = '<div class="text-center py-4 text-muted">No leads available</div>';
      } else {
        leads.forEach(lead => {
          const card = document.createElement('div');
          card.className = 'card mb-3';
          // Status options for dropdown (API: 0 = rejected, 1 = review stage, 2 = shortlisted, 3 = joined)
          const realStatusOptions = [
            { label: 'Rejected', value: 0 },
            { label: 'Review Stage', value: 1 },
            { label: 'Shortlisted', value: 2 },
            { label: 'Joined', value: 3 }
          ];
          // Map status text to value
          const statusMap = {
            'rejected': 0,
            'review stage': 1,
            'shortlisted': 2,
            'joined': 3
          };
          // Find current value
          let currentValue = null;
          if (lead.status && statusMap.hasOwnProperty(lead.status.toLowerCase())) {
            currentValue = statusMap[lead.status.toLowerCase()];
          }
          // If no status, show placeholder 'Qualified Lead' as selected and disabled
          let dropdownHtml = '';
          if (currentValue === null) {
            dropdownHtml = `<option selected disabled>Qualified Lead</option>` +
              realStatusOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
          } else {
            dropdownHtml = realStatusOptions.map(opt => `<option value="${opt.value}" ${opt.value === currentValue ? 'selected' : ''}>${opt.label}</option>`).join('');
          }
          card.innerHTML = `
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h5 class="mb-1">${lead.name}</h5>
                <div class="text-muted small">${lead.mobile} • ${lead.email}</div>
                <div class="text-muted small">Submitted by: ${lead.submitted_by}</div>
              </div>
              <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
                ${lead.resume_path ? `<a href="#" class="btn btn-link p-0 ms-2 download-resume" data-lead-id="${lead.id}" data-email="${lead.email}">Resume</a>` : ''}
                <select class="form-select form-select-sm ms-2 lead-status-dropdown" data-lead-id="${lead.id}">
                  ${dropdownHtml}
                </select>
              </div>
            </div>
          `;
          list.appendChild(card);
        });
        // Add download handler for all resume links
        list.querySelectorAll('.download-resume').forEach(link => {
          link.addEventListener('click', async function(e) {
            e.preventDefault();
            const leadId = this.getAttribute('data-lead-id');
            const email = this.getAttribute('data-email');
            const token = localStorage.getItem('token');
            try {
              const res = await fetch(`${API_BASE}/api/leads/admin/download/${leadId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
              });
              if (!res.ok) return;
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `resume_${email || leadId}.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              // Optionally handle error
            }
          });
        });
        // Add status update handler
        list.querySelectorAll('.lead-status-dropdown').forEach(dropdown => {
          dropdown.addEventListener('change', async function() {
            const leadId = this.getAttribute('data-lead-id');
            const newState = this.value;
            const token = localStorage.getItem('token');
            try {
              const res = await fetch(`${API_BASE}/api/leads/admin/updatestatus/${leadId}/${newState}`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
              });
              const data = await res.json();
              if (res.ok) {
                // Remove green tick feedback
                this.classList.remove('is-invalid');
                this.classList.remove('is-valid');
                this.title = data.message;
              } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                this.title = data.error || 'Update failed';
              }
            } catch (err) {
              this.classList.remove('is-valid');
              this.classList.add('is-invalid');
              this.title = 'Network error';
            }
          });
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchAdminLeads();

  // Download all resumes as ZIP
  document.getElementById('download-all-resumes').addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_BASE + '/api/leads/admin/downloadall', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_resumes.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Optionally handle error
    }
  });
});
