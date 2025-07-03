import { Routes } from '@angular/router';

export const routes: Routes = [
	{
        path: "",
        loadComponent: async () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    }
];
