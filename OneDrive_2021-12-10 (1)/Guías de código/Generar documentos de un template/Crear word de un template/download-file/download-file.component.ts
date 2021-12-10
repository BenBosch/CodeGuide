import { Component, OnInit, ElementRef, ViewChildren, QueryList, ViewChild, Input} from '@angular/core';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs} from "file-saver"; //, FileSaver 
import * as moment from 'moment';
import { ConfigService } from 'src/app/shared/services/config/config.service';
// ES6 Module
//import { initIva, convertDocxToPDFFromFile } from "iva-converter";

/*Funcion de la libreria para generar el blob */
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.scss']
})
export class DownloadFileComponent implements OnInit {
  idCalculation:any=1;
  @Input() icon:any=false;
  
  constructor(public configService:ConfigService) { }

  ngOnInit(): void {
  }
  //Descarga el word
  downloadWord=async()=>{
    let wordStructure= await this.setAttributes(); //Setea los atributos
    let out:any = await this.createWord(wordStructure); //Genera el blob
    saveAs(out, `Calculation_${this.idCalculation}.docx`); //Descarga el archivo

  }

  /*Asigna los atributos del word*/
  setAttributes = () => {
    let wordAttributes= {
      date: this.createDate(),
      calculationId:"calculationId",
      type:"type",
      businessUnit:"businessUnit",
      product:"product",
    }
    return wordAttributes;
  }

   /*Inicio del script de word para crearlo segun la plantilla y descarga si viene desde el metodo ZIP*/
   createWord = function (myAttributes){ 
    let promise=new Promise( (resolve)=>{
     //url cambia de manera local
     loadFile(`${this.configService.baseUrl}assets/calculotcotcd/templateCalculation.docx`,async(error,content)=>{
       let out = await this.wordMainFunction(error,content,myAttributes);
       resolve(out);
    });
   });
     return promise;
 }

 wordMainFunction =  function (error,content,myAttributes){
  let promise = new Promise ((resolve)=>{
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater().loadZip(zip);
    doc.setData(myAttributes);
    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      //Muestra el error al usuario
      this.commonModalService.warning('Error', [`Error en el servidor, refresca la página e intenta nuevamente, si el error persiste comunicarse con el departamento de TI`]);
      console.log("Error al crear el word");

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    var out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }); 
    resolve (out); //Devuelve el array
  });
  return promise;
}

/*Fin del script de word */
//Se trae la fecha actual
createDate=()=>
{
  let meses=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto","Setiembre","Octubre", "Noviembre","Diciembre"];
  let numberMonth=parseInt(moment().format('MM'))-1;
  let stringDate= `${meses[numberMonth]} ${moment().format('DD')},${moment().format('YYYY')}`;
  return stringDate;
}

}
