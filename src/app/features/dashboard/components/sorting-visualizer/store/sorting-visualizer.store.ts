import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";

type SortingVisualizerState = {
	options: SortingVisualizerOptions;
	selectedIndexes: number[];
	elements: number[];
	max: number;
	min: number;
};

const initialState: SortingVisualizerState = {
	options: {
		minAmountOfElements: 10,
		maxAmountOfElements: 25,
		minValue: 0,
		maxValue: 100,
		iterationDelay: 100
	},
	selectedIndexes: [],
	elements: [],
	max: 0,
	min: 0
};

export const SortingVisualizerStore = signalStore(
	withState(initialState),
	withMethods((store) => ({
		setElements(elements: number[]): void {
			patchState(store, { elements });
			patchState(store, { max: Math.max(...elements) });
			patchState(store, { min: Math.min(...elements) });
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
