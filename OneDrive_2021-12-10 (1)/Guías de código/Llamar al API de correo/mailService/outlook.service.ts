import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { encabezadoCorreo } from './encabezadoHML';

@Injectable({
  providedIn: 'root'
})
export class OutlookService {

  private url = "https://ews-bcn.api.bosch.com/home/phoenixmailer/v1/mailer";

  constructor(private http: HttpClient) {

  }

  //Envia el mensaje pudiendo recibir archivos adjuntos
  enviar(from, to, subject, text, files?, cc?, bcc?) {

    let promise = new Promise((resolve) => {
      let formDatamail = new FormData();
      formDatamail.append("from", from);
      formDatamail.append("to", to);
      formDatamail.append("cc", cc);
      formDatamail.append("bcc", bcc);
      formDatamail.append("subject", subject);
      formDatamail.append("text", text);

      /*Añade los archivos*/
      if (files != null && files.length != 0) {
        for (let i = 0; i < files.length; ++i) {
          formDatamail.append("attachments", files[i], files[i].name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }
      }

      this.http.post(this.url, formDatamail, { responseType: 'text' }).subscribe(
        result => {
          console.log("Email sent");
          resolve(result);

        },
        error => {
          throwError("Error sending email");
        });
    }); return promise;
  }
}
