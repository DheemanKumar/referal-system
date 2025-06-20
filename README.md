# Referral System Web App

A simple referral management system with user and admin dashboards, earning tracking, and referral submission. Built using HTML, CSS (Bootstrap + custom), and vanilla JavaScript.

## Features

- **User Dashboard**: View personal stats, earnings, and manage referrals.
- **Admin Dashboard**: Manage all referrals, download resumes, and view leaderboard.
- **Earning Tracking**: Both users and admins can view detailed earning breakdowns.
- **Referral Submission**: Users can submit candidate referrals with resume upload (PDF only).
- **Authentication**: Login and registration for users and admins.
- **Responsive UI**: Built with Bootstrap 5 and custom CSS for modern look.

## File Structure

```
/ (root)
├── index.html           # User login/register page
├── dashbord.html        # User dashboard
├── earning.html         # User earning page
├── refer.index.html     # Referral submission page
├── devindex.html        # Admin login/register (deprecated)
├── devdashbord.html     # Admin dashboard
├── devearning.html      # Admin earning page
├── css/
│   └── style.css        # Custom styles
└── js/
    ├── main.js          # Auth logic (login/register)
    ├── dashbord.js      # User dashboard logic
    ├── earning.js       # User earning logic
    ├── refer.js         # Referral form logic
    ├── devdashbord.js   # Admin dashboard logic
    ├── devearning.js    # Admin earning logic
    └── devindex.js      # Deprecated admin login/register
```

## How It Works

- **index.html**: Main entry for users. Handles login and registration. Redirects to dashboard based on user type.
- **dashbord.html**: Shows user info, stats, and earnings. Navigation to referral and earning pages.
- **earning.html**: Displays user's earning summary and breakdown.
- **refer.index.html**: Referral form for submitting candidate details and uploading resume.
- **devdashbord.html**: Admin dashboard with referral management and resume download.
- **devearning.html**: Admin earning summary and breakdown.
- **js/**: All business logic and API calls. Uses `fetch` to communicate with backend API (see `API_BASE` in JS files).
- **css/style.css**: Custom styles for forms, buttons, and layout.

## API

- The frontend expects a backend API at `https://lead-manager-production.up.railway.app`.
- Endpoints for authentication, dashboard data, earnings, and referrals are used (see JS files for details).

## Setup & Usage

1. **Clone or download this repo.**
2. **Open `index.html` in your browser.**
3. **Ensure backend API is running and accessible at the expected URL.**
4. **Register as a user or admin, then login to access dashboards.**

## Notes

- Admin login/register is now handled in `index.html` and `main.js`. `devindex.html` and `devindex.js` are deprecated.
- All navigation and state is handled client-side using localStorage and JS.
- Resume upload is PDF-only.

## License

MIT
