import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

    imagenSubir: File;
    imagenTemp: string;


    constructor( public _subirArchivoService: SubirArchivoService,
        public _modalUploadService: ModalUploadService ) {}

    ngOnInit() {
    }

    cerrarModal() {
        this.imagenSubir = null;
        this.imagenTemp = null;
        this._modalUploadService.ocultarModal();
    }

    seleccionImagen(archivo: File) {

        if (!archivo ) {
            this.imagenSubir = null;
            return;
        }
        if (archivo.type.indexOf('image') < 0 ) {
            swal('Solo imágenes', 'el archivo seleccionado no es una imagen', 'error');
            this.imagenSubir = null;
            return;
        }

        this.imagenSubir = archivo;

        const reader = new FileReader();
        const urlImagenTemp = reader.readAsDataURL(archivo);
        console.log(urlImagenTemp);

        reader.onloadend = () => {
            this.imagenTemp = reader.result.toString();
        };

    }

    subirImagen() {
        this._subirArchivoService.subirArchivo (this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
            .then(resp => {
                console.log(resp);
                this._modalUploadService.notificacion.emit(resp);
                this.cerrarModal();
            })
            .catch(err => {
                console.log('error al subir');
            });
    }



}
