import { Component, computed, signal } from "@angular/core";
import { ElementComponent } from "../element/element.component";

@Component({
	selector: "sorty-sorting-visualizer",
	imports: [ElementComponent],
	templateUrl: "./sorting-visualizer.component.html",
	host: {
		class: "flex grow items-center justify-center"
	}
})
export class SortingVisualizerComponent {
	protected readonly numbers = signal<number[]>([8, 2, 1, 4, 0, 22, 7, 12, 9, 10]);
	protected readonly max = computed<number>(() => Math.max(...this.numbers()));
	protected readonly min = computed<number>(() => Math.min(...this.numbers()));
}
