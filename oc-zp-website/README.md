# ObjectCanvas × ZeroProgrammingBD Website

A modern Angular 18 (standalone) application that blends ObjectCanvas-style software services with ZeroProgrammingBD academy experiences. The UI uses Tailwind CSS, Lenis smooth scrolling, Angular animations, and a signal-powered in-memory data layer that can later swap to a .NET Core API.

## Getting started

```bash
npm install
npm start
```

The app will be available at [http://localhost:4200](http://localhost:4200).

### Admin access

Navigate to `/auth/login` and use the following credentials:

- **Username:** `admin`
- **Password:** `Admin@123`

All dashboard CRUD actions persist to `localStorage` and are ready to be replaced by an API provider.

## Key features

- Standalone Angular 18 with strict TypeScript
- Tailwind CSS utilities and responsive layouts
- Lenis smooth scrolling and route transition animations
- Signal-based repositories with localStorage persistence
- Public pages for services, products, academy, blog, and contact
- Admin dashboard with CRUD panels for site content and leads

## Scripts

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `npm start`   | Run the development server          |
| `npm run build` | Build the production bundle         |
| `npm test`    | Execute unit tests (Karma)          |

