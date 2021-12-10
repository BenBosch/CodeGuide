import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

import { ErrorService } from '../error/error.service';
import { CommonModalService } from '../../components/common-modal/service/common-modal.service';

@Injectable()
export class HttpService {
  constructor(private httpClient: HttpClient, private errorService: ErrorService, private commonModalService: CommonModalService) {
  }

  responseTypeBlob: any = { responseType: "blob" };
  excelFileName: string = "download.xlsx";
  macroFileName: string = "download.xlsm";

  /*APIS comunes con try catch */

  get(url: string): Observable<any> {
    return this.httpClient.get(url).pipe(
      retry(this.retryTimes),
      catchError(this.errorService.handleErrors),
      shareReplay());
  }

  post(url: string, object?: any, options?: any): Observable<any> {
    return this.httpClient.post(url, object, options).pipe(      
    retry(this.retryTimes),
    catchError(this.errorService.handleErrors),
    shareReplay());
  }

  put(url: string, object?: any): Observable<any> {
    return this.httpClient.put(url, object).pipe(      
    retry(this.retryTimes),
    catchError(this.errorService.handleErrors),
    shareReplay());
  }


  delete(url: string, object?: any): Observable<any> {
    return this.httpClient.delete(url, object).pipe(      
      retry(this.retryTimes),
      catchError(this.errorService.handleErrors),
      shareReplay());
  }

  /* Se acaba los comunes */


  postDownloadFile(url: string, object?: any): Observable<any> {
    return this.httpClient.post(url, object, { observe: 'response', responseType: 'blob' })
      .pipe(catchError(this.errorService.handleErrors))
      .pipe(map(m => this.notify(m)));
  }


  download(file: Blob, fileName: string) {
    fileSaver.saveAs(file, fileName);
  }

  generateFileName(contentType: string): string {
    if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      return this.excelFileName;
    else if (contentType === "application/vnd.ms-excel.sheet.macroenabled.12")
      return this.macroFileName;
    else
      return this.excelFileName;
  }

  notify(element: any): any {
    var response = element as HttpResponse<any>;

    if (response && response.headers) {
      var message = response.headers.get('AppSuccessMessage');
      if (message) {
        this.commonModalService.success(this.commonModalService.messages.common.successTitle, [message]);
      }
      else {
        var message = response.headers.get('AppInfoMessage');
        if (message) {
          this.commonModalService.success(this.commonModalService.messages.common.infoTitle, [message]);
        }
        else {
          var message = response.headers.get('AppWarningMessage');
          if (message) {
            this.commonModalService.warning(this.commonModalService.messages.common.warningTitle, [message]);
          }
        }
      }
    }

    return element;
  }

  postTicket(url: any, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(url, data, httpOptions);
  }

}
