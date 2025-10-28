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
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'services',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent),
          },
          {
            path: ':slug',
            loadComponent: () => import('./features/service-detail/service-detail.component').then(m => m.ServiceDetailComponent),
          },
        ],
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/product/product.component').then(m => m.ProductComponent),
          },
          {
            path: ':slug',
            loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
          },
        ],
      },
      {
        path: 'academy',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/academy/academy.component').then(m => m.AcademyComponent),
          },
          {
            path: ':slug',
            loadComponent: () => import('./features/academy-detail/academy-detail.component').then(m => m.AcademyDetailComponent),
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/blog/blog.component').then(m => m.BlogComponent),
          },
          {
            path: ':slug',
            loadComponent: () => import('./features/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/shell/dashboard-shell.component').then(m => m.DashboardShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/overview/dashboard-overview.component').then(m => m.DashboardOverviewComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/dashboard/about/dashboard-about.component').then(m => m.DashboardAboutComponent),
      },
      {
        path: 'team',
        loadComponent: () => import('./features/dashboard/team/dashboard-team.component').then(m => m.DashboardTeamComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./features/dashboard/services/dashboard-services.component').then(m => m.DashboardServicesComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/dashboard/products/dashboard-products.component').then(m => m.DashboardProductsComponent),
      },
      {
        path: 'academy',
        loadComponent: () => import('./features/dashboard/academy/dashboard-academy.component').then(m => m.DashboardAcademyComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/dashboard/blog/dashboard-blog.component').then(m => m.DashboardBlogComponent),
      },
      {
        path: 'media',
        loadComponent: () => import('./features/dashboard/media/dashboard-media.component').then(m => m.DashboardMediaComponent),
      },
      {
        path: 'leads',
        loadComponent: () => import('./features/dashboard/leads/dashboard-leads.component').then(m => m.DashboardLeadsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/settings/dashboard-settings.component').then(m => m.DashboardSettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
