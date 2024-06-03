import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Documentos, TipoExpedientes } from '../../interfaces';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private dataSource = new BehaviorSubject<any>(null);
    currentData = this.dataSource.asObservable();

    constructor() {}

    changeData(data: TipoExpedientes) {
        this.dataSource.next(data);
    }

    changeDataDocumentos(data: Documentos) {
        this.dataSource.next(data);
    }

    clearCurrentData() {
        this.dataSource.next(null);
    }
}
