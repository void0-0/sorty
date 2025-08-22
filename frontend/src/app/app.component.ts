import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./services/theme.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
	private readonly themeService = inject(ThemeService);

	public ngOnInit(): void {
		this.themeService.init();
	}
}
