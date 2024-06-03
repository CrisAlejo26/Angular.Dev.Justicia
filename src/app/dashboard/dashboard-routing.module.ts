import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidevarComponent } from './sidevar/sidevar.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { ActuacionesComponent } from './actuaciones/actuaciones.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { TipoDeExpedientesComponent } from './tipo-de-expedientes/tipo-de-expedientes.component';
import { FormDocumentosComponent } from './formDocumentos/formDocumentos.component';
import { FormTipoExpedientesComponent } from './form-tipo-expedientes/form-tipo-expedientes.component';

// localhost:4200/dashboard/
const routes: Routes = [
    {
        path: '',
        component: SidevarComponent,
        children: [
            {
                path: 'expedientes',
                component: ExpedientesComponent
            },
            {
                path: 'actuaciones',
                component: ActuacionesComponent
            },
            {
                path: 'documentos',
                component: DocumentosComponent
            },
            {
                path: 'tipo-de-expedientes',
                component: TipoDeExpedientesComponent
            },
            {
                path: 'formulario-documentos',
                component: FormDocumentosComponent
            },
            {
                path: 'formulario-tipoExpedientes',
                component: FormTipoExpedientesComponent
            },
            {
                path: 'formulario-tipoExpedientes/:id',
                component: FormTipoExpedientesComponent
            },
            {
                path: 'formulario-documentos/:id',
                component: FormDocumentosComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
