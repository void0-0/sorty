import { GlobalSortingVisualizerOptions } from "./global-sorting-visualizer-options.type";

export type SortingVisualizerOptions = {
	minAmountOfElements: number;
	maxAmountOfElements: number;
	minValue: number;
	maxValue: number;
} & GlobalSortingVisualizerOptions;
