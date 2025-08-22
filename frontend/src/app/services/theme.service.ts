import { computed, Injectable, signal } from "@angular/core";
import { isDefined } from "@recursyve/nice-ts-utils";
import { isTheme, Theme } from "../types/theme.type";

@Injectable({
	providedIn: "root"
})
export class ThemeService {
	private readonly STORAGE_KEY = "sorty-theme";
	private readonly _theme = signal<Theme>(this.getInitialTheme());

	readonly theme = this._theme.asReadonly();
	readonly isDarkMode = computed(() => this._theme() === Theme.Dark);
	readonly isLightMode = computed(() => this._theme() === Theme.Light);

	private getInitialTheme(): Theme {
		if (!isDefined(window)) {
			return Theme.Light;
		}

		const storedTheme = localStorage.getItem(this.STORAGE_KEY);
		if (isDefined(storedTheme) && isTheme(storedTheme)) {
			return storedTheme;
		}

		// Fall back to system preference
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return prefersDark ? Theme.Dark : Theme.Light;
	}

	private setTheme(theme: Theme): void {
		this._theme.set(theme);
		this.updateDOM(theme);
		localStorage.setItem(this.STORAGE_KEY, theme);
	}

	public toggleTheme(): void {
		const newTheme = this._theme() === Theme.Light ? Theme.Dark : Theme.Light;
		this.setTheme(newTheme);
	}

	private updateDOM(theme: Theme): void {
		const root = document.documentElement;
		if (theme === Theme.Dark) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}

	public init(): void {
		this.updateDOM(this._theme());
	}
}
