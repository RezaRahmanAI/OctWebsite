import { Routes } from '@angular/router';
import { authGuard } from './core/auth';
import { PublicLayoutComponent } from './features/layout/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'services',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/services/services.component').then((m) => m.ServicesComponent),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/service-detail/service-detail.component').then(
                (m) => m.ServiceDetailComponent
              ),
          },
        ],
      },
      {
        path: 'methodology',
        loadComponent: () =>
          import('./features/methodology/methodology.component').then((m) => m.MethodologyComponent),
      },
      {
        path: 'methodology/:id',
        loadComponent: () =>
          import('./features/methodology/methodology-detail.component').then((m) => m.MethodologyDetailComponent),
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/product/product.component').then((m) => m.ProductComponent),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
              ),
          },
        ],
      },
      {
        path: 'showcase/:slug',
        loadComponent: () =>
          import('./features/product-showcase-detail/product-showcase-detail.component').then(
            (m) => m.ProductShowcaseDetailComponent,
          ),
      },
      {
        path: 'academy',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/academy/academy.component').then((m) => m.AcademyComponent),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/academy-detail/academy-detail.component').then(
                (m) => m.AcademyDetailComponent
              ),
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/blog/blog.component').then((m) => m.BlogComponent),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/blog-detail/blog-detail.component').then(
                (m) => m.BlogDetailComponent
              ),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'careers',
        loadComponent: () =>
          import('./features/careers/careers.component').then((m) => m.CareersComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  
  { path: '**', redirectTo: '' },
];
