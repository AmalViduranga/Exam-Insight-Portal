# Exam Details Filter Project

A full-stack React + TypeScript + Node.js application for analyzing confidential ministry exam result Excel sheets.

## Architecture
- **Frontend**: React, TypeScript, Vite, Tailwind CSS. Deployed on **Vercel**.
- **Backend**: Node.js, Express, Prisma. Deployed on **Render** (Free Tier).
- **Database**: Neon PostgreSQL.

## Features
- In-memory processing of Excel files (no raw student data saved permanently to the DB).
- Role-based Access Control (Admin / User).
- JWT Authentication.
- Subject-wise and All Schools ranking reports.
- Export to Excel / CSV.

## Deployment Instructions

### 1. Database Setup (Neon PostgreSQL)
1. Create a free account on [Neon](https://neon.tech).
2. Create a new PostgreSQL database.
3. Obtain the connection string. Ensure you add `?sslmode=require` if necessary.

### 2. Backend Deployment (Render)
1. Create a free account on [Render](https://render.com).
2. Create a new "Web Service".
3. Connect your GitHub repository.
4. Set the Root Directory to `server`.
5. Set Build Command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
6. Set Start Command: `npm start`
7. Set Environment Variables:
   - `DATABASE_URL` = (Your Neon connection string)
   - `JWT_SECRET` = (A secure random string)
   - `PORT` = `10000`
   - `CLIENT_URL` = (Your Vercel frontend URL, e.g. `https://your-frontend.vercel.app`)
8. Deploy.

### 3. Frontend Deployment (Vercel)
1. Create a free account on [Vercel](https://vercel.com).
2. Create a new Project and import your repository.
3. The framework preset should automatically detect Vite.
4. Set Environment Variables:
   - `VITE_API_URL` = (Your Render backend URL + `/api`, e.g. `https://your-backend.onrender.com/api`)
5. Deploy.

*Note: The frontend includes a `vercel.json` for proper SPA routing.*

## Installation

Ensure you have Node.js installed.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests to ensure calculation integrity:
   ```bash
   npm run test
   ```

## How to Run

To run the development server locally:
```bash
npm run dev
```

The application will typically run at `http://localhost:5173`.

## How Formulas are Calculated

For a selected school and subject, the statistics are derived as follows:

1. **Total Did / Applied**: The total number of students in the selected school who have an entry (valid grade) for the selected subject. Rows without valid grades are flagged and excluded.
2. **Absent Count**: The number of students whose grade normalizes to exactly `AB`.
3. **Sat Count**: `Sat Count = Total Did - Absent Count`
4. **Pass Count**: The sum of students whose grade is `A`, `B`, `C`, or `S`.
5. **Fail Count**: The number of students whose grade is `W`.
6. **Pass Percentage**: `(Pass Count / Sat Count) * 100` (Displays `N/A` if Sat Count is 0)
7. **Grade Percentages**: `(Grade Count / Sat Count) * 100` for A, B, C, S, and W (Displays `N/A` if Sat Count is 0)
8. **Absent Percentage**: `(Absent Count / Total Did) * 100` (Displays `N/A` if Total Did is 0)

All calculations handle zero-denominators safely to prevent NaN/Infinity display issues.

## Privacy Note

This application is designed specifically for handling confidential data. 
**No data is uploaded**. The React application uses `SheetJS` to read the Excel file buffer directly within your browser's local sandbox. No API calls or analytics requests are made containing your exam data.

## How to Verify Accuracy

1. Navigate to the **Validation Panel** in the UI after uploading a sheet. Ensure there are no warnings. If warnings exist, the skipped rows or malformed values are documented there.
2. Run the provided Vitest suite (`npm run test`), which asserts that the core formulas strictly follow the defined mathematical requirements.
3. Compare the generated "All Schools Report" (exported to Excel/CSV) against a manually calculated control sample for a specific school.
