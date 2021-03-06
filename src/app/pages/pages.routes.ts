import { Routes, RouterModule, CanActivate } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

import { LoginGuardGuard } from '../services/service.index';
import { AdminGuard } from '../services/service.index';
import { VerficaTokenGuard } from '../services/guards/verfica-token.guard';



const PagesRoutes: Routes = [

            {
                path: 'dashboard',
                component: DashboardComponent,
                data : {titulo: 'Dashboard'},
                canActivate: [VerficaTokenGuard]
            },
            { path: 'progress', component: ProgressComponent,  data : {titulo: 'Progress'} },
            { path: 'graficas1', component: Graficas1Component,  data : {titulo: 'Gráficas'} },
            { path: 'promesas', component: PromesasComponent,  data : {titulo: 'Promesas'} },
            { path: 'rxjs', component: RxjsComponent,  data : {titulo: 'RxJs'} },
            { path: 'account-settings', component: AccountSettingsComponent,  data : {titulo: 'Ajustes del Tema'} },
            { path: 'perfil', component: ProfileComponent,  data : {titulo: 'Perfil de usuario'} },
            { path: 'busqueda/:termino', component: BusquedaComponent,  data : {titulo: 'Buscador'} },
            // mantenimiento
            {
                path: 'usuarios',
                component: UsuariosComponent,
                data : {titulo: 'Usuarios'},
                canActivate: [AdminGuard]
            },
            { path: 'hospitales', component: HospitalesComponent,  data : {titulo: 'Hospitales'} },
            { path: 'medicos', component: MedicosComponent,  data : {titulo: 'Medicos'} },
            // sirve tanto para crear medicos como para actualizar
            { path: 'medico/:id', component: MedicoComponent,  data : {titulo: 'Actualizar Medico'} },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

];


export const PAGES_ROUTES = RouterModule.forChild( PagesRoutes );
