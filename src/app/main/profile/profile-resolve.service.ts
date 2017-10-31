import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

@Injectable()
export class ProfileResolveService implements Resolve<any>{

  constructor() { }
  resolve( route:ActivatedRouteSnapshot ){
      return userData;
  }
}
