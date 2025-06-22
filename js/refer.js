// refer.js
// Handles referral form submission and validation

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('referral-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtnSpinner = document.getElementById('submit-btn-spinner');
  const resumeInput = document.getElementById('resume');
  const resumeFeedback = document.getElementById('resume-feedback');

  const API_BASE = 'https://lead-manager-production.up.railway.app';

  // Navigation
  const btnDashboard = document.getElementById('btn-dashboard');
  if (btnDashboard) btnDashboard.addEventListener('click', function() {
    window.location.href = 'dashbord.html';
  });
  const btnRefer = document.getElementById('btn-refer');
  if (btnRefer) btnRefer.addEventListener('click', function() {
    window.location.href = 'refer.index.html';
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

  // File validation
  resumeInput.addEventListener('change', function(e) {
    const file = resumeInput.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        resumeInput.value = '';
        resumeFeedback.classList.remove('d-none', 'text-success');
        resumeFeedback.classList.add('text-danger');
        resumeFeedback.textContent = 'Please upload a PDF file only.';
      } else {
        resumeFeedback.classList.remove('d-none', 'text-danger');
        resumeFeedback.classList.add('text-success');
        resumeFeedback.textContent = `✓ ${file.name} selected`;
      }
    } else {
      resumeFeedback.classList.add('d-none');
      resumeFeedback.textContent = '';
    }
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    if (!resumeInput.files[0] || resumeInput.files[0].type !== 'application/pdf') {
      resumeFeedback.classList.remove('d-none', 'text-success');
      resumeFeedback.classList.add('text-danger');
      resumeFeedback.textContent = 'Please upload a PDF file only.';
      return;
    }
    submitBtn.disabled = true;
    submitBtnSpinner.classList.remove('d-none');
    submitBtnText.textContent = 'Submitting...';
    // Prepare form data
    const formData = new FormData();
    // Removed candidate_id
    formData.append('name', document.getElementById('name').value);
    formData.append('mobile', document.getElementById('mobile').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('resume', resumeInput.files[0]);
    formData.append('degree', document.getElementById('degree').value);
    formData.append('course', document.getElementById('course').value);
    formData.append('college', document.getElementById('college').value);
    formData.append('year_of_passing', document.getElementById('year_of_passing').value);
    // Get token
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_BASE + '/api/leads/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });
      // Log the full response for debugging
      console.log('Fetch response:', res);
      if (res.ok) {
        const data = await res.json();
        console.log('Response JSON:', data);
        submitBtnText.textContent = 'Submitted!';
        submitBtn.classList.replace('btn-primary', 'btn-success');
        form.reset();
        resumeFeedback.classList.add('d-none');
        // Custom message logic for modal
        let modalMsg = 'Referral Submitted';
        if (data.email_copy === true) {
          modalMsg = 'Referral Submitted <br>email already in database, credits will not be transferred';
        } else if (data.contact_copy === true) {
          modalMsg = 'Referral Submitted <br>contact number already in database, credits will not be transferred';
        } else if (data.course === false || data.degree === false) {
          modalMsg = 'Referral Submitted <br>eligibility criteria not met, credits will not be transferred';
        }
        // Set modal message
        const modalBody = document.querySelector('#referralSuccessModal .modal-body');
        if (modalBody) {
          modalBody.innerHTML = `
            <div class="mb-3">
              <i data-lucide="user-plus" class="text-success" style="width: 2.5rem; height: 2.5rem;"></i>
            </div>
            <h5 class="mb-3">${modalMsg}</h5>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          `;
          lucide.createIcons();
        }
        // Show success modal
        const modal = new bootstrap.Modal(document.getElementById('referralSuccessModal'));
        modal.show();
        setTimeout(() => {
          submitBtnText.textContent = 'Submit Referral';
          submitBtn.classList.replace('btn-success', 'btn-primary');
          submitBtn.disabled = false;
          submitBtnSpinner.classList.add('d-none');
        }, 1500);
      } else {
        const errorData = await res.json();
        console.log('Error JSON:', errorData);
        submitBtnText.textContent = 'Submit Referral';
        submitBtn.disabled = false;
        submitBtnSpinner.classList.add('d-none');
        let errorMsg = errorData.error || errorData.message || 'Submission failed. Please try again.';
        if (errorMsg && errorMsg.startsWith('Candidate not eligible')) {
          errorMsg = 'Candidate not eligible';
        }
        resumeFeedback.classList.remove('d-none', 'text-success');
        resumeFeedback.classList.add('text-danger');
        resumeFeedback.textContent = errorMsg;
      }
    } catch (err) {
      console.error('Network or fetch error:', err);
      submitBtnText.textContent = 'Submit Referral';
      submitBtn.disabled = false;
      submitBtnSpinner.classList.add('d-none');
      resumeFeedback.classList.remove('d-none', 'text-success');
      resumeFeedback.classList.add('text-danger');
      resumeFeedback.textContent = 'Network error. Please try again.';
    }
  });
});
