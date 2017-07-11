import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddShopPage } from './add-shop';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddShopPage,
  ],
  imports: [
    IonicPageModule.forChild(AddShopPage),
    ComponentsModule
  ],
  exports: [
    AddShopPage
  ]
})
export class AddShopPageModule {}
