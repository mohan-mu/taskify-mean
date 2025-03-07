import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";


  export function injectHttp() {
    return inject(HttpClient)
  }
