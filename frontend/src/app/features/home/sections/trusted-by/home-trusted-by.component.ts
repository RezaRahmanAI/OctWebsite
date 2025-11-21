import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-trusted-by',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-trusted-by.component.html',
  styleUrl: './home-trusted-by.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTrustedByComponent {
  @Input({ required: true }) companies: string[] = [];
  @Input() tagline = 'Trusted by teams we have partnered with';

  protected readonly marqueeDuration = '38s';

  protected trackByName(_index: number, name: string): string {
    return name;
  }
}
