import { inject, Injectable } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { arePropertiesDefined } from "@recursyve/nice-ts-utils";
import { toast } from "ngx-sonner";
import { combineLatest, interval, map, Observable, takeWhile } from "rxjs";
import { v4 } from "uuid";
import { generateRandomNumber } from "../../../../../functions/generate-random-number";
import { dumbAssSort } from "../../../../../functions/sorting-functions/dumb-ass-sort";
import { DirectionalState } from "../../../../../types/directional-state.type";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";
import { SortyElement } from "../../../../../types/sorty-element.type";
import { SortingVisualizerStore } from "./sorting-visualizer.store";

// TODO: Add Pause and Resume sorting
@Injectable()
export class SortingVisualizerService {
	private readonly store = inject(SortingVisualizerStore);

	private readonly directionalState = toObservable(this.store.directionalState);

	public reset(): void {
		this.store.reset();
	}

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

	public setDirectionalState(directionalState: DirectionalState): void {
		this.store.setDirectionalState(directionalState);
	}

	// TODO: Find a way to seperate the sorting algorithm from the visualizer's things
	public sort<T>(): SortyElement<T>[] {
		const elements = this.store.elements();
		const beforeSwap = this.store.pushToTraces.bind(this);
		const afterSwap = this.store.pushToTraces.bind(this);
		const sortedElements = dumbAssSort(elements, beforeSwap, afterSwap);

		return sortedElements as SortyElement<T>[];
	}

	public resumeSorting(): Observable<void> {
		const { iterationDelayMs } = this.store.options();
		return combineLatest([interval(iterationDelayMs), this.directionalState]).pipe(
			takeWhile(
				([_, directionalState]) =>
					directionalState !== DirectionalState.Paused &&
					this.store.traceIndex() !== 0 &&
					this.store.traceIndex() !== this.store.traces().length - 1
			),
			map(([_, directionalState]) => {
				switch (directionalState) {
					case DirectionalState.Forward:
						this.incrementTraceIndex();
						break;
					case DirectionalState.Backward:
						this.decrementTraceIndex();
						break;
				}
			})
		);
	}

	public incrementTraceIndex(): void {
		this.store.incrementTraceIndex();
	}

	public decrementTraceIndex(): void {
		this.store.decrementTraceIndex();
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
