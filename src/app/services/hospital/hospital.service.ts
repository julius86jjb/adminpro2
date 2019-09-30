import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert';
import { Hospital } from 'src/app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

    totalHospitales: number = 0;

  constructor(
      public http: HttpClient,
      public _usuarioService: UsuarioService
  ) { }


  cargarHospitales(desde: number = 0) {
      const url = URL_SERVICIOS + '/hospital?desde=' + desde;
      return this.http.get(url)
        .pipe(
            map( (resp: any) => {
                this.totalHospitales = resp.total;
                return resp.hospitales;
            })
        );
  }

  obtenerHospital( id: string) {
      const url = URL_SERVICIOS + '/hospital/' + id;
      return this.http.get(url)
        .pipe(
            map((resp: any) => resp.hospital)
        );
  }

  borrarHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
    .pipe(
        map((resp: any) => swal('Hospital Borrado', 'Hospital eliminado correctamente', 'warning'))
    );
  }

  crearHospital( nombre: string ) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre: nombre})
    .pipe(
        map((resp: any) => {
            return resp.hospital;
        })
    );

  }


  buscarHospital(termnio: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termnio;

    return this.http.get(url)
    .pipe(
        map((resp: any) => resp.hospitales)
    );
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital)
    .pipe(
        map((resp: any) => {
            swal('Hospital actualizado', hospital.nombre, 'success');
            return resp.hospital;
        })
    );
  }

}
