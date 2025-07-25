import { SortyElement } from "../../types/sorty-element.type";

export async function dumbAssSort(
	elements: SortyElement[],
	beforeSwap: (i: number, j: number) => void,
	afterSwap: (elements: SortyElement[]) => Promise<void>
): Promise<SortyElement[]> {
	const sortedElements = [...elements];
	for (let i = 0; i < sortedElements.length; i++) {
		for (let j = 0; j < sortedElements.length - 1; j++) {
			const elementI = sortedElements[i];
			const elementJ = sortedElements[j];

			beforeSwap(i, j);

			if (elementI.value < elementJ.value) {
				const temp = elementI;
				sortedElements[i] = elementJ;
				sortedElements[j] = temp;
			}

			await afterSwap(sortedElements);
		}
	}

	return sortedElements;
}
