# Subscription Management System - Frontend (FE)

Modern, responsive React (Vite) interface for managing user subscriptions, calculating remaining active days, and handling complete CRUD operations via Express REST API.

## Features
- **Subscription List**: Displays user subscriptions with calculated remaining active days and visual status badges (`Active`, `Expired`, `Cancelled`).
- **Dynamic Calculation**: Derived remaining days calculation logic (`end_date` minus current date).
- **Form Modals**: Add and Edit subscription modals with client-side form validation.
- **Delete Confirmation**: Confirmation modal before deleting any subscription record.
- **Toast Notifications**: Real-time feedback for create, update, and delete actions using `react-toastify`.
- **Vercel Ready**: Configured with `vercel.json` and environment variable support (`VITE_API_BASE_URL`).

## Tech Stack
- React 19 & Vite
- CSS3 (Vanilla Design System with Glassmorphic Elements)
- React-Toastify

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`. Ensure the backend server is running on `http://localhost:5000`.

## How to Deploy on Vercel

1. Create a public repository on GitHub and push the contents of `Subscription-frontend`.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import your `Subscription-frontend` repository.
5. In the **Environment Variables** section, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-app.onrender.com` (Your deployed Render Backend API URL)
6. Click **Deploy**. Vercel will build and deploy your React app live!
