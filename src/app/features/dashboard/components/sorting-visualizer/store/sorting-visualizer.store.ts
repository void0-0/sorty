import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";
import { SortyElement } from "../../../../../types/sorty-element.type";

type SortingVisualizerState<T> = {
	elements: SortyElement<T>[];
	selectedIndexes: number[];
	options: SortingVisualizerOptions;
};

const initialState: SortingVisualizerState<unknown> = {
	elements: [],
	selectedIndexes: [],
	options: {
		minAmountOfElements: 10,
		maxAmountOfElements: 25,
		minValue: 0,
		maxValue: 100,
		iterationDelayMs: 100
	}
};

export const SortingVisualizerStore = signalStore(
	withState(initialState),
	withMethods((store) => ({
		setElements<T>(elements: SortyElement<T>[]): void {
			patchState(store, { elements });
		},
		setSelectedIndexes(selectedIndexes: number[]): void {
			patchState(store, { selectedIndexes });
		},
		setOptions(options: SortingVisualizerOptions): void {
			patchState(store, { options });
		},
		setDefaultOptions(): void {
			patchState(store, { options: initialState.options });
		}
	}))
);
