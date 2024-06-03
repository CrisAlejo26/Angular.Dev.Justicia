import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { SidevarComponent } from './sidevar/sidevar.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { TipoDeExpedientesComponent } from './tipo-de-expedientes/tipo-de-expedientes.component';
import { ActuacionesComponent } from './actuaciones/actuaciones.component';
import { ComponentsItemsModule } from '../components/components.module';
import { FormDocumentosComponent } from './formDocumentos/formDocumentos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormTipoExpedientesComponent } from './form-tipo-expedientes/form-tipo-expedientes.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        DashboardComponent,
        SidevarComponent,
        ExpedientesComponent,
        DocumentosComponent,
        TipoDeExpedientesComponent,
        ActuacionesComponent,
        FormDocumentosComponent,
        FormTipoExpedientesComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        MaterialModule,
        ComponentsItemsModule,
        ReactiveFormsModule,
        HttpClientModule
    ]
})
export class DashboardModule {}
