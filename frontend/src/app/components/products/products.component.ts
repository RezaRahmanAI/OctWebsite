import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { ProductItem } from '../../models/product-item.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  private readonly api = inject(ApiService);

  readonly products = toSignal(this.api.getProducts(), { initialValue: [] as ProductItem[] });
}
