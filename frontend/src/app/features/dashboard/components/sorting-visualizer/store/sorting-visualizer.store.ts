import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { isIndexOutOfBounds } from "../../../../../functions/is-index-out-of-bounds.function";
import { DirectionalState } from "../../../../../types/directional-state.type";
import { SortingVisualizerOptions } from "../../../../../types/sorting-visualizer-options.type";
import { SortyElement } from "../../../../../types/sorty-element.type";
import { SortyTrace } from "../../../../../types/sorty-trace.type";

type SortingVisualizerState<T> = {
	elements: SortyElement<T>[];
	traces: SortyTrace<T>[];
	traceIndex: number;
	directionalState: DirectionalState;
	options: SortingVisualizerOptions;
};

const initialState: SortingVisualizerState<unknown> = {
	elements: [],
	traces: [],
	traceIndex: 0,
	directionalState: DirectionalState.Paused,
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
		setSortingTrace<T>(sortingTrace: SortyTrace<T>[]): void {
			patchState(store, { traces: sortingTrace });
		},
		pushToTraces<T>(trace: SortyTrace<T>): void {
			patchState(store, { traces: [...store.traces(), trace] });
		},
		incrementTraceIndex(): void {
			const nextIndex = store.traceIndex() + 1;
			if (isIndexOutOfBounds(nextIndex, store.traces().length)) {
				return;
			}
			patchState(store, { traceIndex: nextIndex });
		},
		decrementTraceIndex(): void {
			const nextIndex = store.traceIndex() - 1;
			if (isIndexOutOfBounds(nextIndex, store.traces().length)) {
				return;
			}
			patchState(store, { traceIndex: nextIndex });
		},
		setDirectionalState(directionalState: DirectionalState): void {
			patchState(store, { directionalState });
		},
		setOptions(options: SortingVisualizerOptions): void {
			patchState(store, { options });
		},
		setDefaultOptions(): void {
			patchState(store, { options: initialState.options });
		},
		reset(): void {
			patchState(store, { ...initialState });
		}
	}))
);
