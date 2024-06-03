import { Component, computed, inject } from '@angular/core';
import { SidevarItems } from '../../../interfaces';
import { AuthService } from '../../auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {


  public routes: SidevarItems[] = [
    { label: "Inicio", icon: "home", url: "/dashboard" },
    { label: "Documentos", icon: "description", url: "/dashboard/documentos" },
    { label: "Actuaciones", icon: "directions_walk", url: "/dashboard/actuaciones" },
    { label: "Expedientes", icon: "receipt_long", url: "/dashboard/expedientes" },
    { label: "Tipos de expedientes", icon: "backup_table", url: "/dashboard/tipo-de-expedientes" },
  ]
}
