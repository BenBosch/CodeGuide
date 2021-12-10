import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class OtrsService {

  constructor(private notificationService:NotificationService,private httpService:HttpService) { }

  /*--Get ticket--*/
  async getTicketInOTRS(url,appCode, ticketID) {
    let promise = new Promise((resolve, error) => {
      this.httpService.post(url, JSON.stringify({ AppCode: appCode, TicketID: ticketID }), { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
        .subscribe(
          (result: any) => {
            if (!result) {
              error("Error al obtener información del ticket");
            } else {
              resolve(result);
            }
          },
          (err) => {
            console.log(err);
            error(err);
          }
        );
    });
    return promise;
  }
  /*--Set ticket-- */
  //Prepara el ticket y lo crea, devuelve el ticketID  el ticketNumber
  newTicket(requesterEmail,appCode,ticketTitle,dinamycFields,queue,priority,subjectArticle,bodyArticle,files?){
    let promise = new Promise(async (resolve)=>{
      let data = await this.prepareTicket("new",requesterEmail,appCode,ticketTitle,dinamycFields,queue,priority,subjectArticle,bodyArticle,files);
      let result: any = await this.sendTicket(data);
      resolve({ticketId:result.ticketID,ticketNumber:result.ticketNumber})
    });
    return promise;
  }

    //Prepara el ticket y lo crea, devuelve el ticketID  el ticketNumber
    udpateTicket(ticketState,requesterEmail,appCode,ticketTitle,dinamycFields,queue,priority,subjectArticle,bodyArticle,files?){
      let promise = new Promise(async (resolve)=>{
        await this.prepareTicket(ticketState,requesterEmail,appCode,ticketTitle,dinamycFields,queue,priority,subjectArticle,bodyArticle,files);
        let result: any = await this.sendTicket(dinamycFields);
        resolve({ticketId:result.ticketID,ticketNumber:result.ticketNumber})
      });
      return promise;
    }

  private prepareTicket(ticketState,requesterEmail,appCode,ticketTitle,dinamycFields,queue,priority, subjectArticle,bodyArticle,files?): any {
    let promise = new Promise(async (resolve) => {      
      const parameters = {
        Ticket: {
          Title: ticketTitle,
          CustomerUser: requesterEmail,//Rev
          CustomerID: requesterEmail,   //Rev       
          Queue: queue,
          State: ticketState,
          Type: 'Web',
          Priority: priority,
        },
        Article: {
          Subject: subjectArticle,
          From: requesterEmail,//Rev
          Body: bodyArticle,
          ContentType: 'text/plain; charset=utf8',
        },
        DynamicField: dinamycFields
      };
      //Si existe files lo añade
      if (files!=null && files.length!=0)
      {
        parameters['Attachment']= await this.convertFilesToOTRS(files);
        console.log(parameters['Attachment']);
      }

      const dataJSON = {
        Appcode: appCode,
        Json: JSON.stringify(parameters)
      }
      const data = JSON.stringify(dataJSON);
      resolve(data);
    });
    return promise;
  }

  private convertFilesToOTRS(files){
    let promise = new Promise (async (resolve)=>{
      let filesConverted=[];
      for (let i = 0; i < files.length; i++) {
        let fileAsBinaryString= await this.readFileAsBinaryString(files[i]);
        filesConverted.push({ 'ContentType': files[i].type, 'Filename':files[i].name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'Content': fileAsBinaryString });
      }	
      resolve(filesConverted);
    });
    return promise;
  }

  //Lee los archivos de manera binaria
  private async readFileAsBinaryString(file){
    let promise = new Promise ((resolve)=>{
      const reader = new FileReader();
      let fileAsBinaryString:any;
      //Asigna la variable al proximo resultado
      reader.onload = () => {
        fileAsBinaryString= btoa(reader.result.toString());
        //Devuelve la lectura
        resolve(fileAsBinaryString)
      };
      //Carga el resultando dentro de fileAsBinaryString
      reader.readAsBinaryString(file);


    });
    return promise;
  }


  private sendTicket(data) {
    const url = `https://hdasrv005.br.bosch.com/helper/api/USM/TicketsUSM`;
    let promise = new Promise((resolve, error) => {
      this.httpService.postTicket(url, data).subscribe(
        (result: any) => {
          if (!result || result.ticketID==undefined) {
            this.notificationService.showError("Error","Error al crear la solicitud en OTRS")
            error(`Error al crear la solicitud en OTRS, esto llego del servidor ${result}`);
          }
          else {
            resolve(result);
          }
        },
        (err) => {
          this.notificationService.showError("Error","Error al crear la solicitud")
          console.log(err);
          error(err);
        }
      );
    });
    return promise;
  }
}
