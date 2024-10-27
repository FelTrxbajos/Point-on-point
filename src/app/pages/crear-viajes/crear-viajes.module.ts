import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearViajesPageRoutingModule } from './crear-viajes-routing.module';

import { CrearViajesPage } from './crear-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearViajesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearViajesPage]
})
export class CrearViajesPageModule {}
