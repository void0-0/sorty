import { Component, signal } from "@angular/core";
import { HlmButtonDirective } from "@spartan-ng/helm/button";

@Component({
	selector: "app-root",
	imports: [HlmButtonDirective],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css"
})
export class AppComponent {
	protected readonly numbers = signal<number[]>([8, 2, -1, 4, 0, 22, 7, 12, 9, 10]);
}
