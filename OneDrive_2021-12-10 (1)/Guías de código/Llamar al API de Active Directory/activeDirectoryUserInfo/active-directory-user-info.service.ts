import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveDirectoryUserInfoService {

  constructor(private httpService:HttpService) { }

  getUserInfo(userName){
    let promise = new Promise(async (resolve, error) => 
    {
       await this.httpService.get(`https://ews-bcn.api.bosch.com/api/isycr-consult/Users/${userName}`).subscribe(
        (result) => {
          resolve(result);
        },
        (e) => {
          throwError(e);
          error(e);
        }
      );
    });
    return promise;
  }
}
