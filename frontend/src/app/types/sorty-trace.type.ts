import { SortyElement } from "./sorty-element.type";

export type SortyTrace<T = unknown> = {
	elements: SortyElement<T>[];
	selectedIndexes: number[];
	swappedIndexes: number[];
};
