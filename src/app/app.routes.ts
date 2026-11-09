import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'resumen-general', pathMatch: 'full' },
      {
        path: 'resumen-general',
        loadComponent: () =>
          import('./features/resumen-general/resumen-general').then(m => m.ResumenGeneral)
      },
      {
        path: 'monitoreo-grietas',
        loadComponent: () =>
          import('./features/monitoreo-grietas/monitoreo-grietas').then(m => m.MonitoreoGrietas)
      },
      {
        path: 'vista-aerea',
        loadComponent: () =>
          import('./features/vista-aerea/vista-aerea').then(m => m.VistaAerea)
      },
      {
        path: 'variables-operativas',
        children: [
          { path: '', redirectTo: 'variable-operativa', pathMatch: 'full' },
          {
            path: 'variable-operativa',
            loadComponent: () =>
              import('./features/variables-operativas/variables-operativas').then(m => m.VariablesOperativas)
          },
          {
            path: 'humedad',
            loadComponent: () =>
              import('./features/variables-operativas/humedad/humedad').then(m => m.Humedad)
          },
          {
            path: 'ultima-depositacion',
            loadComponent: () =>
              import('./features/variables-operativas/ultima-depositacion/ultima-depositacion').then(m => m.UltimaDepositacion)
          }
        ]
      },
      {
        path: 'herramientas',
        children: [
          { path: '', redirectTo: 'secciones', pathMatch: 'full' },
          {
            path: 'secciones',
            loadComponent: () =>
              import('./features/herramientas/secciones/secciones').then(m => m.Secciones)
          },
          {
            path: 'equilibrio-limite',
            loadComponent: () =>
              import('./features/herramientas/equilibrio-limite/equilibrio-limite').then(m => m.EquilibrioLimite)
          }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'resumen-general' }
];
