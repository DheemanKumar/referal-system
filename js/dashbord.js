// dashbord.js
// Handles dashboard navigation, data fetching, and rendering

const API_BASE = "https://lead-manager-production.up.railway.app";

document.addEventListener("DOMContentLoaded", function () {
  // Navbar button active state logic
  const navBtns = [
    document.getElementById("btn-dashboard"),
    document.getElementById("btn-refer"),
    document.getElementById("btn-earning"),
  ];
  navBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", function () {
        navBtns.forEach((b) => b && b.classList.remove("active"));
        this.classList.add("active");
      });
    }
  });

  const btnDashboard = document.getElementById("btn-dashboard");
  if (btnDashboard)
    btnDashboard.addEventListener("click", function () {
      window.location.href = "dashbord.html";
    });
  const btnRefer = document.getElementById("btn-refer");
  if (btnRefer)
    btnRefer.addEventListener("click", function () {
      window.location.href = "refer.index.html";
    });
  const btnEarning = document.getElementById("btn-earning");
  if (btnEarning)
    btnEarning.addEventListener("click", function () {
      window.location.href = "earning.html";
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

  // Fetch dashboard data and render
  async function fetchDashboard() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(API_BASE + "/api/leads/dashboard", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) return;
      const data = await res.json();
      // Set user info
      if (data.user) {
        document.getElementById("user-name").textContent = data.user.name || "";
        document.getElementById("user-email").textContent =
          data.user.email || "";
        document.getElementById("user-employee-id").textContent =
          "Employee ID: " + (data.user.employee_id || "");
        document.getElementById("user-earning").textContent =
          "₹" + (data.user.earning || 0);
      }
      // Set qualified leads count
      console.log("Dashboard data:", data);
      document.getElementById("total-leads").textContent =
        data.total_leads || 0;
      document.getElementById("valid-leads").textContent =
        data.valid_leads || 0;
      document.getElementById("review-leads").textContent =
        data.review_stage || 0;
      document.getElementById("shortlisted-leads").textContent =
        data.shortlisted || 0;
      document.getElementById("joined-leads").textContent = data.joined || 0;
      // Render leads
      const leads = data.leads || [];
      const list = document.getElementById("referrals-list");
      list.innerHTML = "";
      if (leads.length === 0) {
        list.innerHTML =
          '<div class="text-center py-4 text-muted">No referrals yet. Start by adding your first referral!</div>';
      } else {
        leads.forEach((lead) => {
          console.log("Lead data:", lead);
          const card = document.createElement("div");
          card.className = "card mb-3";
          let badgeClass = "bg-success"; // Default for valid leads
          let statusText = lead.status;

          if (lead.copy === true || lead.eligibility === false) {
            badgeClass = "bg-secondary"; // Ineligible leads
            statusText = "Ineligible";
          }

          // Optional: map more statuses if needed
          if (lead.status === "shortlisted") badgeClass = "bg-info";
          if (lead.status === "joined") badgeClass = "bg-primary";

          card.innerHTML = `
  <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
    <div>
      <h5 class="mb-1 fw-semibold text-dark">${lead.name}</h5>
      <div class="text-muted small">${lead.mobile} &bull; ${lead.email}</div>
    </div>
    <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
      <span class="badge rounded-pill px-3 py-2 ${badgeClass} text-capitalize">${statusText}</span>
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
      const res = await fetch(API_BASE + "/api/leaderboard/");
      if (!res.ok) return;
      const data = await res.json();
      console.log("Leaderboard data:", data);
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
});

const educationData = {
  "B.Tech": ["Computer Science Engineering", "Information Technology", "Mechanical Engineering"],
  "M.Tech": ["Data Science", "Thermal Engineering"],
  "BCA": ["General", "Cybersecurity"],
  "MCA": ["AI & ML", "Software Engineering"],
  "B.Com": ["Accounting & Finance", "Taxation"],
  "M.Com": ["Finance", "Economics"],
  "MBA": ["Finance", "HR", "Marketing"],
  "Other": [] // Special key to detect "Other"
};

const degreeSelect = document.getElementById("degree");
const courseSelect = document.getElementById("course");
const otherDegreeGroup = document.getElementById("other-degree-group");
const otherCourseGroup = document.getElementById("other-course-group");

// Populate Degree dropdown
Object.keys(educationData).forEach(degree => {
  const option = document.createElement("option");
  option.value = degree;
  option.textContent = degree;
  degreeSelect.appendChild(option);
});

// On Degree Change
degreeSelect.addEventListener("change", function () {
  const selectedDegree = this.value;
  const courses = educationData[selectedDegree] || [];

  // Show/hide 'Other' degree input
  if (selectedDegree === "Other") {
    otherDegreeGroup.classList.remove("d-none");
  } else {
    otherDegreeGroup.classList.add("d-none");
  }

  // Reset and populate courses
  courseSelect.innerHTML = '<option value="" disabled selected>Select a course</option>';
  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    courseSelect.appendChild(option);
  });

  // Always add "Other" option to course list
  const otherOption = document.createElement("option");
  otherOption.value = "Other";
  otherOption.textContent = "Other";
  courseSelect.appendChild(otherOption);
});

// On Course Change
courseSelect.addEventListener("change", function () {
  const selectedCourse = this.value;

  if (selectedCourse === "Other") {
    otherCourseGroup.classList.remove("d-none");
  } else {
    otherCourseGroup.classList.add("d-none");
  }
});

