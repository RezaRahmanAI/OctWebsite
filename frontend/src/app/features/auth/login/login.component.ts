import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password, remember } = this.form.value;
    this.auth.login(username!, password!, remember ?? false).subscribe(success => {
      if (success) {
        this.toast.show('Welcome back!', 'success');
        this.router.navigate(['/dashboard']);
      } else {
        this.toast.show('Invalid credentials', 'error');
      }
    });
  }
}
