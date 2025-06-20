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
      if (res.ok) {
        const data = await res.json();
        submitBtnText.textContent = 'Submitted!';
        submitBtn.classList.replace('btn-primary', 'btn-success');
        form.reset();
        resumeFeedback.classList.add('d-none');
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
      submitBtnText.textContent = 'Submit Referral';
      submitBtn.disabled = false;
      submitBtnSpinner.classList.add('d-none');
      resumeFeedback.classList.remove('d-none', 'text-success');
      resumeFeedback.classList.add('text-danger');
      resumeFeedback.textContent = 'Network error. Please try again.';
    }
  });
});
