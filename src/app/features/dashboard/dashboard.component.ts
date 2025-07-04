import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

@Component({
	selector: "sorty-dashboard",
	imports: [RouterOutlet, ToolbarComponent],
	templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {}
