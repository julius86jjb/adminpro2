import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

// import swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {


    usuarios: Usuario;
    desde: number = 0;
    totalUsuarios: number = 0;
    cargando: boolean = true;

    constructor(
        public _usuarioService: UsuarioService,
        public _modalUploadService: ModalUploadService
    ) { }

    ngOnInit() {
        this.cargarUsuarios();

        this._modalUploadService.notificacion
            .subscribe( resp => this.cargarUsuarios());
    }

    cargarUsuarios() {
        this.cargando = true;
        this._usuarioService.cargarUsuarios(this.desde)
            .subscribe( (resp: any) => {
                this.totalUsuarios = resp.total;
                this.usuarios = resp.usuarios;
                this.cargando = false;
            });
    }

    cambiarDesde(valor: number) {
        const desde = this.desde + valor;

        if (desde >= this.totalUsuarios) {
            return;
        }

        if (desde < 0) {
            return;
        }

        this.desde += valor;
        this.cargarUsuarios();
    }

    buscarUsuario(termino: string) {
        if (termino.length <= 0) {
            this.cargarUsuarios();
            return;
        }

        this.cargando = true;
        this._usuarioService.buscarUsuarios(termino)
            .subscribe((usuarios: any) => {
                // console.log(usuarios);
                this.usuarios = usuarios;
                this.cargando = false;
            });
    }

    guardarUsuario(usuario: Usuario) {

        this._usuarioService.actualizarUsuario(usuario)
            .subscribe();
    }



    borrarUsuario(usuario: Usuario) {
        if (usuario._id === this._usuarioService.usuario._id) {
            swal('No se puede borrar el usuario', 'No puede borrarse a sí mismo', 'error');
            return;
        }

        swal({
            title: 'Estás seguro?',
            text: 'Esta a punto de borrar a ' + usuario.nombre,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          })
          .then((borrar) => {
            if (borrar) {
                this._usuarioService.borrarUsuario(usuario._id)
                    .subscribe( resp => {
                        this.totalUsuarios--;
                         if (this.desde === this.totalUsuarios) {
                             this.desde -= 10;
                         }
                        this.cargarUsuarios();
                    });
            } else {
              swal('Error al borrar el usuario', {icon: 'danger'});
            }
          });


    }

    mostrarModal(id: string) {
        this._modalUploadService.mostrarModal('usuarios', id);
    }

}
