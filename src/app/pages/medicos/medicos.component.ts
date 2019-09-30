import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {


    medicos: Medico[] = [];
    desde: number = 0;
    totalMedicos: number = 0;
    cargando: boolean = true;

    constructor( public _medicosService: MedicoService,
        public _modalUploadService: ModalUploadService) { }

    ngOnInit() {
        this.cargarMedicos();
        this._modalUploadService.notificacion
            .subscribe(() => this.cargarMedicos());
    }


    cargarMedicos() {
        this.cargando = true;
        this._medicosService.cargarMedicos(this.desde)
            .subscribe( (medicos: any) => {
                console.log(medicos);
                this.totalMedicos = this._medicosService.totalMedicos;
                this.medicos = medicos;
                this.cargando = false;
            });
    }

    cambiarDesde(valor: number) {
        const desde = this.desde + valor;

        if (desde >= this.totalMedicos) {
            return;
        }

        if (desde < 0) {
            return;
        }

        this.desde += valor;
        this.cargarMedicos();
    }

    crearMedico() {

    }

    buscarMedico( termino: string ) {
        if (termino.length <= 0) {
            this.cargarMedicos();
            return;
        }

        this.cargando = true;
        this._medicosService.buscarMedico(termino)
            .subscribe((medicos: any) => {
                this.medicos = medicos;
                this.cargando = false;
            });
    }

    actualizarImagen(medico: Medico) {
        this._modalUploadService.mostrarModal('medicos', medico._id);
    }

    borrarMedico(medico: Medico) {
        swal({
            title: 'Estás seguro?',
            text: 'Esta a punto de borrar a ' + medico.nombre,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          })
          .then((borrar) => {
            if (borrar) {
                this._medicosService.borrarMedico(medico._id)
                    .subscribe( resp => {
                        this.totalMedicos--;
                         if (this.desde === this.totalMedicos) {
                             this.desde -= 10;
                         }
                        this.cargarMedicos();
                    });
            } else {
              swal('Error al borrar el medico', {icon: 'danger'});
            }
          });
    }

}
