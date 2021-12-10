import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NombreDelServicio } from 'RUTA DONDE SE CREO EL SERVICIO';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.scss'],
})
export class FormRequestComponent implements OnInit {

  //Instancia el servicio
  constructor(public nombreDelServicio: NombreDelServicio) { }

  ngOnInit(): void {

  }
  //Metodo que se ejecuta al darle submit al formulario
  triggerSave = async function (form) {
    // Valida el formulario y devuelve un booleano, true si es válido, false si no y enseña todos los mensajes del formulario en rojo
    let valid = await this.nombreDelServicio.validateForm(form);
    if (valid) { //Si el formulario es valido
      console.log("OK");
    }
    else {
      console.log("No es válido");
    }
  };
}
