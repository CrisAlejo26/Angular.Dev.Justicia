import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-home',
  templateUrl: './card-home.component.html',
  styleUrl: './card-home.component.css'
})
export class CardHomeComponent {
  @Input() titulo: string = 'ejemplo';
  @Input() route: string = '/login';
  @Input() icon: string = '/login';
}
