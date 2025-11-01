# OctWebsite

This repository hosts the ObjectCanvas × ZeroProgramming website along with a production-ready ASP.NET Core 9 Web API that exposes dynamic data for the Angular frontend.

## Frontend
- Location: `oc-zp-website`
- Framework: Angular with Tailwind CSS
- Development server: `npm install` then `npm run start`

## Backend API
- Location: `backend`
- Architecture: Clean Architecture with Domain, Application, Infrastructure, and WebApi projects that communicate through repository abstractions.
- Framework: ASP.NET Core 9 (preview SDK)

### Run the API locally
```bash
cd backend
dotnet build
dotnet run --project src/OctWebsite.WebApi/OctWebsite.WebApi.csproj
```

The API listens on the default ASP.NET HTTP port and exposes Swagger UI at `/swagger` with endpoints for team members, services, products, academy tracks, blog posts, site settings, and lead management.
