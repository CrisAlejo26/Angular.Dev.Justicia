# Iniciar proyecto

## 1. Primero que todo debes iniciar el backend antes de iniciar con este paso.

## Se debe iniciar el proyecto con el comando:

```bash
docker-compose -f docker-compose.yml up
```

## 2. El proyecto lo podrás ver en http://localhost:4300/

Usuario: elex@elex.com
password: elex2024

# Proyecto 

## 1. Variables de Entorno

Las variables de entorno se encuentran en src/environments/environments.ts

## 2. Vista login

La vista login esta trabajada con sus respectivos archivos css, component y html en src/app/auth/login. La parte de la autenticacion 
esta hecha con guards y asignada en las routes de src/app-routing-module.ts 

```ts

const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard], // Para cuando no esta autenticado
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '404',
    component: Error404PageComponent
  },

    {
      path: 'dashboard',
      canActivate: [ isAuthenticatedGuard ], // Para cuando esta autenticado
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  },

];

```

Luego tenemos los guards que estan en src/app/auth/guards, estas configuraciones estan enlazadas con el servicio de autenticacion y logout que esta en 
src/app/auth/services/auth.service


## 3. Vistas modelos

Cada vista de cada modelo esta por carpeta en la ruta src/app/dashboard, 

```
src/
  app/
    dashboard/
      actuaciones/
      dashboard/
      expedientes/
      form-tipo-expedientes/
      formDocumentos/
      sidevar/
      tipo-de-expedientes/
      documentos/
```
Cada uno tiene sus funciones en sus componentes respectivos, ademas se creo un servicio para todo ese modulo o directorio, el cual se comunica
entre todos los directorios.
