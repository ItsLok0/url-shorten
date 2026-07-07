import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

/**
 ** loadCOmponent permet de charger un composant de manière asynchrone
 ** ce qui peut améliorer les performances de l'application en ne chargeant que les composants nécessaires à un moment donné.
 */

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
    { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [authGuard] },
    { path: 'stats/:id', loadComponent: () => import('./pages/stats/stats').then(m => m.StatsComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];