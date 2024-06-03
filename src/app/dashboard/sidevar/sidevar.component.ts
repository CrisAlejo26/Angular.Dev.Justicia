import { Component, computed, inject } from '@angular/core';
import { SidevarItems } from '../../../interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-sidevar',
    templateUrl: './sidevar.component.html',
    styleUrl: './sidevar.component.css'
})
export class SidevarComponent {
    public router: Router;
    public loading: boolean = true;
    private authService = inject(AuthService);
    public user = computed(() => this.authService.currentUser());

    constructor(
        router: Router,
        private spinner: NgxSpinnerService
    ) {
        this.router = router;
        this.routeActual();
    }

    ngOnInit() {
        this.hideSpinner();
    }

    hideSpinner() {
        this.loading = true; // Comienza con el spinner visible
        setTimeout(() => (this.loading = false), 2000); // Espera la duración de la animación
    }

    public sidebarItems: SidevarItems[] = [
        { label: 'Inicio', icon: 'home', url: '/dashboard' },
        { label: 'Documentos', icon: 'description', url: '/dashboard/documentos' },
        { label: 'Actuaciones', icon: 'directions_walk', url: '/dashboard/actuaciones' },
        { label: 'Expedientes', icon: 'receipt_long', url: '/dashboard/expedientes' },
        {
            label: 'Tipos de expedientes',
            icon: 'backup_table',
            url: '/dashboard/tipo-de-expedientes'
        }
    ];

    routeActual(): string {
        return this.router.url;
    }

    logout() {
        this.authService.logout();
    }
}
