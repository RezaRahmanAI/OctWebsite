import { animate, query, style, transition, trigger } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter, :leave', [style({ position: 'absolute', width: '100%' })], { optional: true }),
    query(':enter', [style({ opacity: 0, transform: 'translateY(16px)' })], { optional: true }),
    query(':leave', [style({ opacity: 1, transform: 'translateY(0)' }), animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-16px)' }))], { optional: true }),
    query(':enter', [style({ opacity: 0 }), animate('320ms 80ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true }),
  ]),
]);
