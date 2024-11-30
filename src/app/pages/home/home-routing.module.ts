import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'reservas',
        loadChildren: () => import('../reservas/reservas.module').then( m => m.ReservasPageModule)
      },
      {
        path: 'administrar',
        loadChildren: () => import('../administrar/administrar.module').then( m => m.AdministrarPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'viaje',
        loadChildren: () => import('../viaje/viaje.module').then( m => m.ViajePageModule)
      },
      {
        path: 'crear-viajes',
        loadChildren: () => import('../crear-viajes/crear-viajes.module').then( m => m.CrearViajesPageModule)
      },
      {
        path: 'detalle-viaje',
        loadChildren: () => import('../detalle-viaje/detalle-viaje.module').then( m => m.DetalleViajePageModule)
      },
      {
        path: 'administrar-fire',
        loadChildren: () => import('../administrar-fire/administrar-fire.module').then( m => m.AdministrarFirePageModule)
      },
      

    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
