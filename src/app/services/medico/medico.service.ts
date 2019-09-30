import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

    totalMedicos: number = 0;

  constructor( public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService) { }

    cargarMedicos(desde: number = 0) {
        const url = URL_SERVICIOS + '/medico?desde=' + desde;
        return this.http.get(url)
            .pipe(
                map( (resp: any) => {
                    console.log(resp.medicos);
                    this.totalMedicos = resp.total;
                    return resp.medicos;
                })
            );
    }

    buscarMedico(termnio: string) {
        const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termnio;
        return this.http.get(url)
        .pipe(
            map((resp: any) => resp.medicos)
        );
    }

    borrarMedico( id: string ) {
        let url = URL_SERVICIOS + '/medico/' + id;
        url += '?token=' + this._usuarioService.token;
        return this.http.delete(url)
        .pipe(
            map((resp: any) => swal('Medico Borrado', 'Medico eliminado correctamente', 'warning'))
        );
    }

    guardarMedico(medico: Medico) {
        let url = URL_SERVICIOS + '/medico';

        if ( medico._id) {
            url  +=  '/' + medico._id;
            url  +=  '?token=' + this._usuarioService.token;
            return this.http.put(url, medico)
                .pipe(
                    map((resp: any) => {
                        swal('Medico actualizado', medico.nombre, 'success');
                        return resp.medico;
                    })
                );
        } else {
            // creando
            url  +=  '?token=' + this._usuarioService.token;
            return this.http.post(url, medico)
                .pipe(
                    map((resp: any) => {
                        swal('Médico creado', medico.nombre, 'success');
                        return resp.medico;
                    })
                );
        }

    }

    cargarMedico(id: string) {
        const url = URL_SERVICIOS + '/medico/' + id;
        return this.http.get(url)
        .pipe(
            map( (resp: any) => {
                return resp.medico;
            })
        );
    }

}
