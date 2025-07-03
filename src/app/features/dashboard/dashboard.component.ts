import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sorty-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
	protected readonly numbers = signal<number[]>([8, 2, -1, 4, 0, 22, 7, 12, 9, 10]);
}
