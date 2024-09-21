import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroUberPage } from './registro-uber.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroUberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroUberPageRoutingModule {}
