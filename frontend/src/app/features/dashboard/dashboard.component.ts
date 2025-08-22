import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HlmToasterComponent } from "@spartan-ng/helm/sonner";
import { ThemeService } from "../../services/theme.service";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

@Component({
	selector: "sorty-dashboard",
	imports: [RouterOutlet, ToolbarComponent, HlmToasterComponent],
	templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {
	protected readonly themeService = inject(ThemeService);

	protected readonly theme = this.themeService.theme;
}
