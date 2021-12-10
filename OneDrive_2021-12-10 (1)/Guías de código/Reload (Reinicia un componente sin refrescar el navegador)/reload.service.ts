import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor(private router:Router) { }

  /*Para que el metodo sirve es necesario 
    imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload' })],
    ver la documentación en https://stackoverflow.com/questions/65908135/this-router-routereusestrategy-shouldreuseroute-false
 */
  reloadCurrentRoute(){

    const prev = this.router.routeReuseStrategy.shouldReuseRoute;
    const prevOSN = this.router.onSameUrlNavigation;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  
    this.router.navigate([this.router.url]);
    setTimeout(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = prev;
      this.router.onSameUrlNavigation = prevOSN;
    }, 0);
  }

}
