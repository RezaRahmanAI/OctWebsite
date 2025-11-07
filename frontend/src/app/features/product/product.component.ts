import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ProductSuite = {
  title: string;
  headline: string;
  description: string;
  highlights: string[];
};

type Accelerator = {
  name: string;
  detail: string;
};

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  readonly overview = {
    eyebrow: 'Product',
    title: 'ZeroProgramming accelerators',
    subtitle:
      'Reusable automation, integration, and analytics components designed with ObjectCanvas to shorten time-to-value.'
  };

  readonly suites: ProductSuite[] = [
    {
      title: 'Platform Launchpad',
      headline: 'From concept to production-ready in weeks',
      description:
        'Composable foundations for customer portals, partner ecosystems, and internal tooling built on secure micro frontends.',
      highlights: ['Design system + accessible UI kit', 'Authentication, billing, and entitlement modules', 'Operational dashboards & audit-ready logging']
    },
    {
      title: 'Intelligent Automation',
      headline: 'Orchestrate workflows with governance baked in',
      description:
        'Prebuilt RPA, document processing, and decision automation assets ready to connect with your core platforms.',
      highlights: ['Process mining accelerators', 'Low-code orchestration with guardrails', 'Integration connectors for ERP, CRM, and data warehouses']
    },
    {
      title: 'Insight Fabric',
      headline: 'Unified data, analytics, and experimentation',
      description:
        'Data mesh blueprints, semantic layers, and experimentation frameworks tuned for product and growth teams.',
      highlights: ['Data product templates and governance', 'Real-time telemetry pipelines', 'Experimentation toolkit with automated reporting']
    }
  ];

  readonly accelerators: Accelerator[] = [
    {
      name: 'ZeroConfig Ops',
      detail: 'Infrastructure-as-code, monitoring, and incident playbooks ready for enterprise rollout.'
    },
    {
      name: 'Launch Analytics',
      detail: 'Comprehensive instrumentation, dashboards, and cohort analysis from day zero.'
    },
    {
      name: 'Experience Mesh',
      detail: 'Headless CMS integration and content governance with multilingual support.'
    }
  ];
}
