import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateFormService {
  constructor() { }
    
  //Muestra los errores, devuelve true si todo estaba bien
    validateForm(form) {
      let promise = new Promise ((resolve, error)=>
      {
        try {
          let controls=form.form.controls;
          let flagValid=true;
          Object.keys(controls).forEach((key) => {
            if (controls[key].status=="INVALID"){
              controls[key].markAsDirty();
              controls[key].markAsTouched();
              controls[key].updateValueAndValidity() 
              flagValid= false;
            }
          });
          resolve (flagValid);
        }
        catch(e)
        {
          throwError(e);
          error(e);
        }
      });
      return promise;
    }
}
