# ObjectCanvas ×

Premium joint technology studio and academy experience built with Angular 18, Tailwind CSS, GSAP, and Lenis.

## Getting Started

```bash
npm install
npm start
```

The development server is available at `http://localhost:4200/`.

## Features

- Standalone Angular 18 architecture with lazy-loaded feature routes
- Tailwind CSS design system inspired by global tech leaders
- GSAP ScrollTrigger animations and Lenis smooth scrolling
- Responsive layout covering services, academy, portfolio, testimonials, and contact flows
- SEO meta tags, structured data, and semantic HTML
- Reusable section header component and scroll reveal directive

## Available Scripts

- `npm start` – run the development server
- `npm run build` – generate a production build
- `npm run test` – execute unit tests

## Configuring the API URL

The dashboard reads its API base URL at runtime so you can deploy the same build to multiple environments.

- By default, it targets the same origin as the page (unless you are running on `localhost:4200`, where it falls back to the production API).
- To override the target without rebuilding, set `window.__env.apiUrl` in `public/env.config.js` before deploying the built assets, for example:

  ```js
  window.__env = { apiUrl: 'https://eshoptest.octimsbd.com' };
  ```

During local development, the Angular dev server proxies `/api/*` requests to the production host defined in `proxy.conf.json`, so you can work without CORS errors while keeping the runtime override available for other environments.

## Folder Structure

```
src/
  app/
    core/          # Services for animation, scrolling, and SEO
    features/      # Lazy-loaded feature pages (home, services, academy, etc.)
    layout/        # Header and footer components
    shared/        # Reusable components and directives
  styles.css       # Tailwind layers and global styles
```

## License

Copyright © 2024 ObjectCanvas × .
