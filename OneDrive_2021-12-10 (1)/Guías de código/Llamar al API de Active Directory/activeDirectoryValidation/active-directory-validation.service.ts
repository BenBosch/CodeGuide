import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ActiveDirectoryValidationService {
  httpOptions: any;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type'
      })
    }
  }
  


  public login(userName: any, password: any){
    let promise = new Promise ((resolve)=>{
      this.http.get(
        `http://si0vmc3597.de.bosch.com:8002/adAuthentication?&user=${userName.toString()}&Userpassword=${encodeURIComponent(password.toString())}`)
          .subscribe(
            ()=>{resolve(true)}, //Its OK
            ()=>{resolve(false);}); //Its an invalid request, its false
    });
    return promise;
  }

  
}
