# Study Group Finder

Study Group Finder is now a React single-page application backed by a PHP JSON API.

## Requirements

- PHP 8+
- MySQL/MariaDB
- Node.js 18+

## Database setup

1. Import the schema and sample data in `database/study_group_finder.sql`.
2. Copy `config/db.php.example` to `config/db.php` and update the credentials as needed.

## Backend configuration

- `FRONTEND_ORIGIN` (optional): Set this if your React app runs on a different origin and you need CORS enabled.

## Frontend development

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

If the API is hosted elsewhere, set `VITE_API_BASE` (for example, `http://localhost/api`).

## Production build

```bash
npm --prefix frontend run build
```

Serve the repository root as the PHP document root. `index.php` serves the React build from
`frontend/dist` and `.htaccess` enables SPA route fallback.
