import { SortyElement } from "../../types/sorty-element.type";
import { SortyTrace } from "../../types/sorty-trace.type";

export function dumbAssSort<T>(
	elements: SortyElement<T>[],
	beforeSwap: (trace: SortyTrace<T>) => void,
	afterSwap: (trace: SortyTrace<T>) => void
): SortyElement<T>[] {
	const elementsCopy = [...elements];
	for (let i = 0; i < elementsCopy.length; i++) {
		for (let j = 0; j < elementsCopy.length - 1; j++) {
			const elementI = elementsCopy[i];
			const elementJ = elementsCopy[j];

			beforeSwap({
				elements: [...elementsCopy],
				selectedIndexes: [i, j],
				swappedIndexes: []
			});
			const shouldSwap = elementI.value < elementJ.value;
			if (shouldSwap) {
				const temp = elementI;
				elementsCopy[i] = elementJ;
				elementsCopy[j] = temp;
			}
			afterSwap({
				elements: [...elementsCopy],
				selectedIndexes: [],
				swappedIndexes: shouldSwap ? [i, j] : []
			});
		}
	}

	return elementsCopy;
}
