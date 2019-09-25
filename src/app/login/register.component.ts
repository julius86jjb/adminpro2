import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {


    forma: FormGroup;
    usuariosAValidar: any[];


    constructor(public _usuarioService: UsuarioService,
                public router: Router) {}

    sonIguales(campo1: string, campo2: string) {

        return (group: FormGroup) => {

            const pass1 = group.controls[campo1].value;
            const pass2 = group.controls[campo2].value;

            if ( pass1 === pass2) {
                return null;
            }
            return {
                sonIguales: true,
            };
        };
    }

    validateEmailNotTaken(control: AbstractControl) {
        return this._usuarioService.checkEmailNotTaken(control.value)
            .pipe(
                map(res => {
                    console.log(res);
                    return res ? null : { emailTaken: true };
                  })
            );
        }

    

    ngOnInit() {
        init_plugins();

        this.forma = new FormGroup({
            nombre: new FormControl(null, Validators.required ), // par1:valor por defecto, par2: validaciones
            email: new FormControl(null, [
                Validators.required, 
                Validators.email,  
                Validators.minLength(6), 
                Validators.maxLength(30),
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
            ], this.validateEmailNotTaken.bind(this) ),
            password: new FormControl(null, Validators.required),
            password2: new FormControl(null, Validators.required),
            condiciones: new FormControl(false)
        }, { validators: [ this.sonIguales('password', 'password2')]}
        );
    }



    registarUsuario() {

        console.log(this.forma);
        if (this.forma.invalid) {
            swal('Error', 'Corrija los errores del formulario', 'warning');
            return;
        }

        if (!this.forma.value.condiciones) {
            swal('Importante', 'Debe aceptar las condiciones', 'warning');
            return;
        }

        const usuario = new Usuario(
            this.forma.value.nombre,
            this.forma.value.email,
            this.forma.value.password
        );

        this._usuarioService.crearUsuario(usuario)
            .subscribe(resp => this.router.navigate(['/login']));
    }





}
