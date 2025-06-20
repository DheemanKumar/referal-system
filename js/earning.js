// earning.js
// Handles fetching and rendering earning breakdown for the employee

const API_BASE = 'https://lead-manager-production.up.railway.app';

document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  document.getElementById('btn-dashboard').addEventListener('click', function() {
    window.location.href = 'dashbord.html';
  });
  document.getElementById('btn-refer').addEventListener('click', function() {
    window.location.href = 'refer.index.html';
  });
  document.getElementById('btn-earning').addEventListener('click', function() {
    window.location.href = 'earning.html';
  });
  document.getElementById('btn-logout').addEventListener('click', function() {
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
    //   console.log(data);
      // Set earning summary
      document.getElementById('total-earning').textContent = '₹' + (data.totalEarning || 0);
      document.getElementById('bonus').textContent = '₹' + (data.bonus || 0);
      document.getElementById('final-earning').textContent = '₹' + (data.finalEarning || 0);
      // Also update the summary card's final earning
      var finalEarningSummary = document.getElementById('final-earning-summary');
      if(finalEarningSummary) {
        finalEarningSummary.textContent = '₹' + (data.finalEarning || 0);
      }
      // Render earning breakdown
      const list = document.getElementById('earning-list');
      list.innerHTML = '';
      if (!data.leads || data.leads.length === 0) {
        list.innerHTML = '<div class="text-center py-4 text-muted">No earning breakdown available</div>';
      } else {
        data.leads.forEach(lead => {
          const card = document.createElement('div');
          card.className = 'card mb-3';
          card.innerHTML = `
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h5 class="mb-1">${lead.name}</h5>
                <div class="text-muted small">${lead.status}</div>
              </div>
              <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
                <span class="badge bg-success">₹${lead.earning}</span>
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
