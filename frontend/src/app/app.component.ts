import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { StatsComponent } from './components/stats/stats.component';
import { ServicesComponent } from './components/services/services.component';
import { ProductsComponent } from './components/products/products.component';
import { AcademyComponent } from './components/academy/academy.component';
import { ProcessComponent } from './components/process/process.component';
import { TeamComponent } from './components/team/team.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import Lenis from 'lenis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    StatsComponent,
    ServicesComponent,
    ProductsComponent,
    AcademyComponent,
    ProcessComponent,
    TeamComponent,
    TestimonialsComponent,
    BlogComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private lenis?: Lenis;

  ngAfterViewInit(): void {
    this.lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true
    });

    const loop = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
  }
}
