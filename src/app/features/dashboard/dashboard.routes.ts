import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "sorting-visualizer",
		pathMatch: "full"
	},
	{
		path: "sorting-visualizer",
		loadComponent: async () =>
			import("./components/sorting-visualizer/sorting-visualizer.component").then(
				(m) => m.SortingVisualizerComponent
			)
	}
];

export default routes;
