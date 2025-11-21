import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../layout/footer/footer.component";import { NavbarComponent } from '../../../layout/navbar/navbar.component';



@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css'],
})
export class PublicLayoutComponent {}
