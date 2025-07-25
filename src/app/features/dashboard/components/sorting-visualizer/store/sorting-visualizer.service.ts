import { inject, Injectable } from "@angular/core";
import { arePropertiesDefined } from "@recursyve/nice-ts-utils";
import { toast } from "ngx-sonner";
import { v4 } from "uuid";
import { generateRandomNumber } from "../../../../../functions/generate-random-number";
import { dumbAssSort } from "../../../../../functions/sorting-functions/dumb-ass-sort";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";
import { SortyElement } from "../../../../../types/sorty-element.type";
import { SortingVisualizerStore } from "./sorting-visualizer.store";

// TODO: Add Pause and Resume sorting
@Injectable()
export class SortingVisualizerService {
	private readonly store = inject(SortingVisualizerStore);

	public setOptions(options?: Partial<SortingVisualizerOptions>): void {
		const mergedOptions = { ...this.store.options(), ...options };
		const errors = this.assertOptionsAreValid(mergedOptions);
		if (errors.length === 0) {
			this.store.setOptions(mergedOptions);
			return;
		}

		const seperator = "\n\t- ";
		toast.info(
			`Default options will be applied because the following option rules were violated: ${seperator}${errors.join(seperator)}`
		);
		this.store.setDefaultOptions();
	}

	public randomlySetElements(): void {
		const { minAmountOfElements, maxAmountOfElements, minValue, maxValue } = this.store.options();
		const length = generateRandomNumber(minAmountOfElements, maxAmountOfElements);
		const numbers = Array.from({ length }, () => generateRandomNumber(minValue, maxValue));

		this.setElements(numbers, (number) => number);
	}

	public setElements<T>(elements: T[], valueAccessor: (element: T) => number): void {
		const max = Math.max(...elements.map(valueAccessor));

		const sortyElements: SortyElement<T>[] = elements.map((element) => {
			const value = valueAccessor(element);
			const heightPercentage = (value / max) * 100;
			return {
				id: v4(),
				originalValue: element,
				value,
				heightPercentage
			};
		});

		this.store.setElements(sortyElements);
	}

	// TODO: Find a better way to wait than awaiting a new Promise
	// TODO: Find a way to seperate the sorting algorithm from the visualizer's things
	public async sort<T>(): Promise<SortyElement<T>[]> {
		const sortedElements = await dumbAssSort(
			this.store.elements(),
			this.beforeSwap.bind(this),
			this.afterSwap.bind(this)
		);
		this.store.setSelectedIndexes([]);

		return sortedElements as SortyElement<T>[];
	}

	private beforeSwap(i: number, j: number): void {
		this.store.setSelectedIndexes([i, j]);
	}

	private async afterSwap(elements: SortyElement[]): Promise<void> {
		const { iterationDelayMs } = this.store.options();
		this.store.setElements(elements);
		await new Promise((resolve) => setTimeout(resolve, iterationDelayMs));
	}

	// TODO: Get rid of this system and use a formgroup that validates the options
	private assertOptionsAreValid(options: Partial<SortingVisualizerOptions>): string[] {
		const errors: string[] = [];
		if (
			arePropertiesDefined(options, "minAmountOfElements", "maxAmountOfElements") &&
			options.minAmountOfElements > options.maxAmountOfElements
		) {
			errors.push("Min amount of elements must be less than max amount of elements.");
		}
		if (arePropertiesDefined(options, "minValue", "maxValue") && options.minValue > options.maxValue) {
			errors.push("Min value must be less than max value.");
		}
		if (arePropertiesDefined(options, "iterationDelayMs") && options.iterationDelayMs < 0) {
			errors.push("Iteration delay must be greater than 0.");
		}

		return errors;
	}
}
