import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroUberPageRoutingModule } from './registro-uber-routing.module';

import { RegistroUberPage } from './registro-uber.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroUberPageRoutingModule
  ],
  declarations: [RegistroUberPage]
})
export class RegistroUberPageModule {}
