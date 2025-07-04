import { Component, inject } from "@angular/core";
import { ThemeService } from "../../services/theme.service";

@Component({
	selector: "sorty-theme-toggle",
	imports: [],
	templateUrl: "./theme-toggle.component.html",
	host: {
		class: "inline-block"
	}
})
export class ThemeToggleComponent {
	private readonly themeService = inject(ThemeService);

	readonly isDarkMode = this.themeService.isDarkMode;

	protected toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
