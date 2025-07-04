export const Theme = {
	Light: "light",
	Dark: "dark"
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export function isTheme(value: string): value is Theme {
	return Object.values(Theme).includes(value as Theme);
}
