export function isIndexOutOfBounds(index: number, length: number): boolean {
	return index < 0 || index > length - 1;
}
