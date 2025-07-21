import { Component, inject, OnInit, signal } from "@angular/core";
import { HlmButtonDirective } from "../../../../../../libs/ui/ui-button-helm/src";
import { SortingVisualizerOptions } from "../../../../types/sorting-visualizer-options.type";
import { ElementComponent } from "../element/element.component";
import { SortingVisualizerService } from "./store/sorting-visualizer.service";
import { SortingVisualizerStore } from "./store/sorting-visualizer.store";

// TODO: Add a stats board that shows the amount of iterations, the amount of comparisons, and the amount of swaps
// TOOD: Add form to change the options
// TODO: Add Pause, Play, next, previous, restart
// TODO: Show current comparison
// TODO: Revise styling, add custom colors and use them
@Component({
	selector: "sorty-sorting-visualizer",
	imports: [ElementComponent, HlmButtonDirective],
	templateUrl: "./sorting-visualizer.component.html",
	host: {
		class: "flex flex-col grow gap-4"
	},
	providers: [SortingVisualizerStore, SortingVisualizerService]
})
export class SortingVisualizerComponent implements OnInit {
	private readonly service = inject(SortingVisualizerService);
	private readonly store = inject(SortingVisualizerStore);

	protected readonly elements = this.store.elements;
	protected readonly selectedIndexes = this.store.selectedIndexes;

	private readonly options = signal<Partial<SortingVisualizerOptions>>({
		minAmountOfElements: 25,
		maxAmountOfElements: 35,
		iterationPauseMs: 1
	});

	public ngOnInit(): void {
		this.resetElements();
	}

	protected resetElements(): void {
		const options = this.options();
		this.service.setOptions(options);
		this.service.randomlySetElements();
	}

	protected async startSorting(): Promise<void> {
		await this.service.dumbassSort();
	}

	protected getElements(): { name: string; age: number }[] {
		return [
			{ name: "John", age: 1 },
			{ name: "Alice", age: 23 },
			{ name: "Bob", age: 34 },
			{ name: "Carol", age: 19 },
			{ name: "David", age: 42 },
			{ name: "Eve", age: 28 },
			{ name: "Frank", age: 31 },
			{ name: "Grace", age: 25 },
			{ name: "Hannah", age: 37 },
			{ name: "Ian", age: 22 },
			{ name: "Judy", age: 29 },
			{ name: "Kevin", age: 40 },
			{ name: "Laura", age: 27 },
			{ name: "Mike", age: 33 },
			{ name: "Nina", age: 21 },
			{ name: "Oscar", age: 36 },
			{ name: "Pam", age: 24 },
			{ name: "Quinn", age: 38 },
			{ name: "Rachel", age: 30 },
			{ name: "Steve", age: 26 }
		];
	}
}
