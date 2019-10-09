import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';


import swal from 'sweetalert';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    usuario: Usuario;
    token: string;
    menu: any = [];

    constructor(public http: HttpClient,
                 public router: Router,
                 public _subirArchivoService: SubirArchivoService,
                 public _modalUploadService: ModalUploadService
    ) {
        this.cargarStorage();
        this._modalUploadService.notificacion
            .subscribe(resp => {
                if ( this.usuario._id === resp.usuario._id) {
                    console.log('entra en service');
                    this.guardarStorage(this.usuario._id, this.token, resp.usuario, this.menu);
                }
            });
    }

    renuevaToken() {
        let url = URL_SERVICIOS + '/login/renuevatoken';
        url += '?token=' + this.token;

        return this.http.get(url)
            .pipe(
                map( (resp: any) => {
                    this.token = resp.token;
                    localStorage.setItem('token', this.token);
                    return true;
                }),
                catchError(err => {
                    this.router.navigate(['/login']);
                    swal('Error al renovar el token', 'No fue posible renovar el token', 'warning');
                    throw err;
                })
            );
    }

    estaLogueado() {
        return ( this.token.length > 5) ? true : false;
    }

    cargarStorage() {
        if ( localStorage.getItem('token')) {
            this.token =  localStorage.getItem('token');
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            this.menu = JSON.parse(localStorage.getItem('menu'));
        } else {
            this.token = '';
            this.usuario = null;
            this.menu = [];
        }

    }

    guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
        localStorage.setItem('id', id);
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('menu', JSON.stringify(menu));

        this.usuario = usuario;
        this.token = token;
        this.menu = menu;
        // console.log(this.usuario);

    }


    loginGoogle(token: string) {
        const url = URL_SERVICIOS + '/login/google';
        return this.http.post(url, {token: token})
        .pipe(
            map((resp: any) => {

                this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                // console.log(resp);
                return true;
            })
        );
    }


    login(usuario: Usuario, recordar: boolean = false) {

        if (recordar) {
            localStorage.setItem('email', usuario.email);
        } else {
            localStorage.removeItem('email');
        }
        const url = URL_SERVICIOS + '/login';
        return this.http.post(url, usuario)
        .pipe(
            map( (resp: any) => {

                this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                return true;
            }),
            catchError(err => {
                console.error('HTTP Error', err.status);
                swal('Error al iniciar sesión', err.error.mensaje, 'warning');
                throw err;
              })
        );
    }

    logout() {
        this.usuario = null;
        this.token = '';

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('menu');

        this.router.navigate(['/login']);
    }

    crearUsuario(usuario: Usuario) {

        const url = URL_SERVICIOS + '/usuario';

        return this.http.post(url, usuario)
            .pipe(
                map( (resp: any) => {
                    swal('Usuario creado', usuario.email, 'success');
                    return resp.usuario;
                })
            );
    }

    actualizarUsuario(usuario: Usuario) {
        console.log(usuario);
        let url = URL_SERVICIOS + '/usuario/' + usuario._id;

        url += '?token=' + this.token;
        return this.http.put(url, usuario)
            .pipe(
                map( (resp: any) => {
                    console.log(resp.usuario);
                    if (usuario._id === this.usuario._id) {
                        const usuarioDB: Usuario = resp.usuario;
                        this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
                    }

                    swal('Usuario actualizado', usuario.nombre, 'success');

                    return true;
                })
            );
    }

    cambiarImagen(archivo: File, id: string) {
        this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
        .then( (resp: any) => {
            this.usuario.img = resp.usuario.img;
            swal('Imagen actualizada', this.usuario.nombre, 'success');
            this.guardarStorage(id, this.token, this.usuario, this.menu);

        })
        .catch ( resp => {
            console.log(resp);
        });
    }


    cargarUsuarios( desde: number = 0 ) {

        const url = URL_SERVICIOS + '/usuario?desde=' + desde;

        return this.http.get(url);
    }

    checkEmailNotTaken(email: string) {
        const url = URL_SERVICIOS + '/usuario';
        return this.http.get(url)
            .pipe(
                map((resp: any) => resp.usuarios),
                map(users => users.filter(user => user.email === email)),
                map(users => {
                    // console.log(!users.length);
                    return !users.length;
                })
            );
      }

    buscarUsuarios(termnio: string) {
        const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termnio;
        return this.http.get(url)
        .pipe(
            map((resp: any) => resp.usuarios)
        );
    }


    borrarUsuario( id: string) {

        const url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;

        return this.http.delete(url)
            .pipe(
                map( resp => {
                    swal('Usuario borrado', 'El usuario ha sido borrado correctamente', 'success');
                    return true;
                })
            );
    }

    buscarEmail(email: string = 'user8') {
        const url = URL_SERVICIOS + '/usuario/emailYaRegistrado/' + email;
        return this.http.get(url)
        .pipe(
            map((res: any) => res)
        );

    }



}
