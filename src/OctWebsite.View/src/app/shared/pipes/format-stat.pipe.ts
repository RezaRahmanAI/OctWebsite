import { Pipe, PipeTransform } from '@angular/core';
import type { StatItem } from '../../core/models/home-content.model';

@Pipe({
  name: 'formatStat',
  standalone: true
})
export class FormatStatPipe implements PipeTransform {
  transform(stat: StatItem | null | undefined): string {
    if (!stat) {
      return '';
    }

    const decimals = stat.decimals ?? 0;
    const formatted = Number(stat.value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `${formatted}${stat.suffix ?? ''}`;
  }
}
