import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHomeComponent } from './card-home/card-home.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    CardHomeComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    CardHomeComponent
  ]
})
export class ComponentsItemsModule { }
