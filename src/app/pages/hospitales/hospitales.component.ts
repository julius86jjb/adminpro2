import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

    hospitales: Hospital[] = [];
    desde: number = 0;
    totalHospitales: number = 0;
    cargando: boolean = true;

    constructor( public _hospitalesService: HospitalService,
        public _modalUploadService: ModalUploadService) { }

    ngOnInit() {
        this.cargarHospitales();
        this._modalUploadService.notificacion
            .subscribe(() => this.cargarHospitales());
    }


    cargarHospitales() {
        this.cargando = true;
        this._hospitalesService.cargarHospitales(this.desde)
            .subscribe( (hospitales: any) => {
                this.totalHospitales = this._hospitalesService.totalHospitales;
                this.hospitales = hospitales;
                this.cargando = false;
            });
    }

    cambiarDesde(valor: number) {
        const desde = this.desde + valor;

        if (desde >= this.totalHospitales) {
            return;
        }

        if (desde < 0) {
            return;
        }

        this.desde += valor;
        this.cargarHospitales();
    }

    buscarHospital( termino: string ) {
        if (termino.length <= 0) {
            this.cargarHospitales();
            return;
        }

        this.cargando = true;
        this._hospitalesService.buscarHospital(termino)
            .subscribe((hospitales: any) => {
                console.log(hospitales);
                this.hospitales = hospitales;
                this.cargando = false;
            });
    }

    guardarHospital(hospital: Hospital) {
        this._hospitalesService.actualizarHospital(hospital)
            .subscribe();
    }

    borrarHospital(hospital: Hospital) {
        swal({
            title: 'Estás seguro?',
            text: 'Esta a punto de borrar a ' + hospital.nombre,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          })
          .then((borrar) => {
            if (borrar) {
                this._hospitalesService.borrarHospital(hospital._id)
                    .subscribe( resp => {
                        this.totalHospitales--;
                         if (this.desde === this.totalHospitales) {
                             this.desde -= 10;
                         }
                        this.cargarHospitales();
                    });
            } else {
              swal('Error al borrar el hospital', {icon: 'danger'});
            }
          });
    }

    crearHospital() {
        swal({
            title: 'Crear Hospital',
            text: 'Ingrese el nombre del hospital',
            content: 'input',
            icon: 'info',
            buttons: true,
            dangerMode: true,
        }).then ((valor: string) => {
            if (!valor || valor.length === 0) {
                return;
            }

            this._hospitalesService.crearHospital(valor)
                .subscribe((hospital: Hospital) => {
                    swal('Hospital creado', hospital.nombre, 'success');
                    this.cargarHospitales();
                });
        });
    }

    actualizarImagen(hospital: Hospital) {
        this._modalUploadService.mostrarModal('hospitales', hospital._id);
    }

}
