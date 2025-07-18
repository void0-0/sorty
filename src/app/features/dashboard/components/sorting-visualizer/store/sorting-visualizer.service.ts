import { inject, Injectable } from "@angular/core";
import { arePropertiesDefined } from "@recursyve/nice-ts-utils";
import { toast } from "ngx-sonner";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";
import { SortingVisualizerStore } from "./sorting-visualizer.store";

// TODO: Add Pause and Resume sorting
@Injectable()
export class SortingVisualizerService {
	private readonly store = inject(SortingVisualizerStore);

	public randomlySetElements(options?: Partial<SortingVisualizerOptions>) {
		this.setOptions(options);
		const storeOptions = this.store.options();
		const amountOfNumbers = this.generateRandomNumber(
			storeOptions.minAmountOfElements,
			storeOptions.maxAmountOfElements
		);
		const numbers = Array.from({ length: amountOfNumbers }, () =>
			this.generateRandomNumber(storeOptions.minValue, storeOptions.maxValue)
		);
		this.store.setElements(numbers);
	}

	// TODO: Find a better way to wait than awaiting a new Promise
	// TODO: Find a way to seperate the sorting algorithm from the visualizer's things
	public async dumbassSort(): Promise<number[]> {
		const { iterationDelay } = this.store.options();
		const sortedNumbers = [...this.store.elements()];
		for (let i = 0; i < sortedNumbers.length; i++) {
			for (let j = 0; j < sortedNumbers.length - 1; j++) {
				const numberI = sortedNumbers[i];
				const numberJ = sortedNumbers[j];

				this.store.setSelectedIndexes([i, j]);

				if (numberI < numberJ) {
					const temp = numberI;
					sortedNumbers[i] = numberJ;
					sortedNumbers[j] = temp;
				}
				this.store.setElements(sortedNumbers);
				await new Promise((resolve) => setTimeout(resolve, iterationDelay));
			}
		}

		this.store.setSelectedIndexes([]);

		return sortedNumbers;
	}

	private generateRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private setOptions(options?: Partial<SortingVisualizerOptions>): void {
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
		if (arePropertiesDefined(options, "iterationDelay") && options.iterationDelay < 0) {
			errors.push("Iteration delay must be greater than 0.");
		}

		return errors;
	}
}
