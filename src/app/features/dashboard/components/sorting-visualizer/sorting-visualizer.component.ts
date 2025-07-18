import { Component, inject, OnInit, signal } from "@angular/core";
import { HlmButtonDirective } from "../../../../../../libs/ui/ui-button-helm/src";
import { SortingVisualizerOptions } from "../../../../types/sorting-visualizer-options.type";
import { ElementComponent } from "../element/element.component";
import { SortingVisualizerService } from "./store/sorting-visualizer.service";
import { SortingVisualizerStore } from "./store/sorting-visualizer.store";

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
	protected readonly max = this.store.max;
	protected readonly min = this.store.min;
	protected readonly selectedIndexes = this.store.selectedIndexes;

	private readonly options = signal<Partial<SortingVisualizerOptions>>({
		minAmountOfElements: 25,
		maxAmountOfElements: 35
	});

	public ngOnInit(): void {
		this.resetElements();
	}

	protected resetElements(): void {
		const options = this.options();
		this.service.randomlySetElements(options);
	}

	protected async startSorting(): Promise<void> {
		await this.service.dumbassSort();
	}
}
