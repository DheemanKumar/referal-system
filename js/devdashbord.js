// devdashbord.js
// Handles fetching and rendering admin info and leaderboard for devdashbord.html

document.addEventListener("DOMContentLoaded", function () {
  const API_BASE = "https://lead-manager-production.up.railway.app";

  // Navigation
  const btnDashboard = document.getElementById("btn-dashboard");
  if (btnDashboard)
    btnDashboard.addEventListener("click", function () {
      window.location.href = "devdashbord.html";
    });
  const btnRefer = document.getElementById("btn-refer");
  if (btnRefer)
    btnRefer.addEventListener("click", function () {
      window.location.href = "refer.index.html";
    });
  const btnEarning = document.getElementById("btn-earning");
  if (btnEarning)
    btnEarning.addEventListener("click", function () {
      window.location.href = "devearning.html";
    });
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout)
    btnLogout.addEventListener("click", async function () {
      const token = localStorage.getItem("token");
      try {
        await fetch(API_BASE + "/api/auth/logout", {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
        });
      } catch (err) {}
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });

  // Fetch admin info
  async function fetchAdminInfo() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(API_BASE + "/api/dashboard/admin", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.admin) {
        document.getElementById("user-name").textContent =
          data.admin.name || "";
        document.getElementById("user-email").textContent =
          data.admin.email || "";
        document.getElementById("user-admin-id").textContent =
          "Admin ID: " + (data.admin.id || "");
        document.getElementById("is-admin").style.display = data.admin.is_admin
          ? "inline-block"
          : "none";
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchAdminInfo();

  // Fetch leaderboard (same as dashboard)
  async function fetchLeaderboard() {
    try {
      const res = await fetch(API_BASE + "/api/leaderboard/");
      if (!res.ok) return;
      const data = await res.json();
      const leaderboard = data.leaderboard || [];
      const list = document.getElementById("leaderboard-list");
      list.innerHTML = "";
      if (leaderboard.length === 0) {
        list.innerHTML =
          `<div class="text-center py-4 text-muted small d-flex flex-column align-items-center">
            <i data-lucide="trophy" class="mb-2 text-warning" style="width:2rem;height:2rem;"></i>
            <div>No leaderboard data available</div>
          </div>`;
      } else {
        list.innerHTML = ""; // Clear old
        leaderboard.forEach((entry, idx) => {
          const card = document.createElement("div");
          card.className =
            "leaderboard-entry-card card mb-2 border-0 shadow-sm rounded-3 bg-white position-relative overflow-hidden";

          const rankColor =
            [
              "linear-gradient(90deg,#ffd700 0%,#fffbe6 100%)", // gold
              "linear-gradient(90deg,#c0c0c0 0%,#f0f0f0 100%)", // silver
              "linear-gradient(90deg,#cd7f32 0%,#fbeee6 100%)" // bronze
            ][idx] || "linear-gradient(90deg,#4e54c8 0%,#8f94fb 100%)";

          card.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center p-3" style="background: ${rankColor}; border-radius: 1rem;">
        <div class="d-flex align-items-center gap-2">
          <span class="badge text-dark fw-semibold me-2 rounded-pill px-3 py-2" style="background: rgba(255,255,255,0.7); font-size:1.1rem;">
            <i data-lucide="award" class="me-1 text-warning"></i> #${idx + 1}
          </span>
          <div class="fw-semibold text-dark d-flex align-items-center gap-2">
            <i data-lucide="user" class="text-primary"></i> ${entry.name}
          </div>
        </div>
        <span class="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2 d-flex align-items-center gap-1">
          <i data-lucide="users" class="text-success"></i> ${entry.lead_count} Leads
        </span>
      </div>
    `;
          list.appendChild(card);
          lucide.createIcons();
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  }
  fetchLeaderboard();

  // Fetch all leads for admin
  async function fetchAdminLeads() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const list = document.getElementById("referrals-list");
    list.innerHTML =
      '<div class="text-center py-4 text-muted">Loading leads...</div>';
    try {
      const res = await fetch(API_BASE + "/api/leads/admin/leads", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        list.innerHTML =
          '<div class="text-center py-4 text-danger">Failed to load leads.</div>';
        return;
      }
      const data = await res.json();
      const leads = data.leads || [];
      list.innerHTML = "";
      if (leads.length === 0) {
        list.innerHTML =
          '<div class="text-center py-4 text-muted">No leads available</div>';
      } else {
        leads.forEach((lead) => {
          console.log("Lead data:", lead);
          const card = document.createElement("div");
          card.className = "card mb-3";
          // Status options for dropdown (API: 0 = rejected, 1 = review stage, 2 = shortlisted, 3 = joined)
          const realStatusOptions = [
            { label: "Rejected", value: 0 },
            { label: "Review Stage", value: 1 },
            { label: "Shortlisted", value: 2 },
            { label: "Joined", value: 3 },
          ];
          // Map status text to value
          const statusMap = {
            rejected: 0,
            "review stage": 1,
            shortlisted: 2,
            joined: 3,
          };
          // Find current value
          let currentValue = null;
          if (
            lead.status &&
            statusMap.hasOwnProperty(lead.status.toLowerCase())
          ) {
            currentValue = statusMap[lead.status.toLowerCase()];
          }
          // If no status, show placeholder based on eligibility
          let dropdownHtml = "";
          if (currentValue === null) {
            if (lead.eligibility === true) {
              dropdownHtml =
                `<option selected disabled>Qualified</option>` +
                realStatusOptions
                  .map(
                    (opt) => `<option value="${opt.value}">${opt.label}</option>`
                  )
                  .join("");
            } else {
              dropdownHtml =
                `<option selected disabled>Unqualified</option>` +
                realStatusOptions
                  .map(
                    (opt) => `<option value="${opt.value}">${opt.label}</option>`
                  )
                  .join("");
            }
          } else {
            dropdownHtml = realStatusOptions
              .map(
                (opt) =>
                  `<option value="${opt.value}" ${
                    opt.value === currentValue ? "selected" : ""
                  }>${opt.label}</option>`
              )
              .join("");
          }
          // If copy is true, disable dropdown and show 'Copied'
          let dropdownDisabled = lead.copy === true ? 'disabled' : '';
          let dropdownExtra = lead.copy === true ? '<span class="badge bg-secondary ms-2">Copied</span>' : '';
          card.innerHTML = `
  <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center px-3 py-3">
    <div>
      <h5 class="fw-semibold mb-1 text-dark">${lead.name}</h5>
      <div class="text-muted small mb-1">
        <i class="bi bi-telephone me-1"></i>${lead.mobile} &nbsp; • &nbsp;
        <i class="bi bi-envelope me-1"></i>${lead.email}
      </div>
      <div class="text-muted small">
        <i class="bi bi-person-circle me-1"></i>Submitted by: <span class="fw-medium">${lead.submitted_by}</span>
      </div>
    </div>
    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 mt-3 mt-md-0">
        ${
          lead.resume_path
            ? `<a href="#" class="btn btn-sm ${lead.downloded ? 'btn-gradient-gray downloaded-resume' : 'btn-gradient-blue'} px-3 download-resume" data-lead-id="${lead.id}" data-email="${lead.email}"><i class="bi bi-file-earmark-arrow-down me-1"></i>Resume</a>`
            : ''
        }
        ${
          lead.copy === true
            ? '<span class="badge bg-secondary ms-2">Copied</span>'
            : `<div class="d-flex align-items-center">
                <select class="form-select form-select-sm lead-status-dropdown shadow-sm" data-lead-id="${lead.id}" style="min-width: 150px;" ${dropdownDisabled}>
                  ${dropdownHtml}
                </select>
                ${dropdownExtra}
              </div>`
        }
      </div>
  </div>
`;

          list.appendChild(card);
        });
        // Add download handler for all resume links
        list.querySelectorAll(".download-resume").forEach((link) => {
          link.addEventListener("click", async function (e) {
            e.preventDefault();
            const leadId = this.getAttribute("data-lead-id");
            const email = this.getAttribute("data-email");
            const token = localStorage.getItem("token");
            try {
              const res = await fetch(
                `${API_BASE}/api/leads/admin/download/${leadId}`,
                {
                  headers: { Authorization: "Bearer " + token },
                }
              );
              if (!res.ok) return;
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `resume_${email || leadId}.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
              // Change button color/state after download
              this.classList.add("downloaded-resume");
              this.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Downloaded';
            } catch (err) {
              // Optionally handle error
            }
          });
        });
        // Add status update handler
        list.querySelectorAll(".lead-status-dropdown").forEach((dropdown) => {
          dropdown.addEventListener("change", async function () {
            const leadId = this.getAttribute("data-lead-id");
            const newState = this.value;
            const token = localStorage.getItem("token");
            try {
              const res = await fetch(
                `${API_BASE}/api/leads/admin/updatestatus/${leadId}/${newState}`,
                {
                  method: "POST",
                  headers: { Authorization: "Bearer " + token },
                }
              );
              const data = await res.json();
              if (res.ok) {
                // Remove green tick feedback
                this.classList.remove("is-invalid");
                this.classList.remove("is-valid");
                this.title = data.message;
              } else {
                this.classList.remove("is-valid");
                this.classList.add("is-invalid");
                this.title = data.error || "Update failed";
              }
            } catch (err) {
              this.classList.remove("is-valid");
              this.classList.add("is-invalid");
              this.title = "Network error";
            }
          });
        });
      }
    } catch (err) {
      list.innerHTML =
        '<div class="text-center py-4 text-danger">Network error loading leads.</div>';
    }
  }
  fetchAdminLeads();

  // Download all resumes (ZIP)
  const btnDownloadAll = document.getElementById("download-all-resumes");
  if (btnDownloadAll)
    btnDownloadAll.addEventListener("click", async function () {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(API_BASE + "/api/leads/admin/downloadall", {
          headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "all_resumes.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        // Change button color/state after download
        this.classList.add("downloaded-resume");
        this.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Downloaded';
        this.disabled = true;
      } catch (err) {
        // Optionally handle error
      }
    });

  // Download only new resumes (ZIP)
  const btnDownloadNew = document.getElementById("download-new-resumes");
  if (btnDownloadNew)
    btnDownloadNew.addEventListener("click", async function () {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(API_BASE + "/api/leads/admin/downloadnew", {
          headers: { Authorization: "Bearer " + token },
        });
        if (
          res.status === 404 ||
          res.headers.get("content-type")?.includes("application/json")
        ) {
          // Try to parse error JSON
          try {
            const errorData = await res.json();
            if (
              errorData &&
              errorData.error &&
              errorData.error.includes("No new resumes")
            ) {
              alert("There are no new resumes to download.");
              return;
            }
          } catch (e) {
            // fallback: generic error
            alert("No new resumes to download.");
            return;
          }
        }
        if (!res.ok) return;
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "new_resumes.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        // Change button color/state after download
        this.classList.add("downloaded-resume");
        this.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Downloaded';
        this.disabled = true;
      } catch (err) {
        alert("No new resumes to download.");
      }
    });
});
