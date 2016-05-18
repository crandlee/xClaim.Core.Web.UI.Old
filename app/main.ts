import { bootstrap } from '@angular/platform-browser-dynamic';
import {ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData} from './shared/ng2-toasty/ng2-toasty';
import { AppSettings } from './appsettings';
import { XCoreToastService } from './shared/xcore-toasty/xcore-toasty.service';
import { LoggingService } from './shared/logging/logging.service';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';
import { Injectable, provide, ExceptionHandler } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { SecurityService } from './shared/security/security.service';

// Our main component
import { AppComponent } from './app.component';

@Injectable()
export class RootExceptionHandler  {
  
  constructor(private logService: LoggingService) {}
  
  call(error, stackTrace = null, reason = null) {
    //NOTE: The toast doesn't work here because we are outside of the UI context.
    //Hoping angular provides a solution for this later.
    this.logService.error(error);      
  }
  
}

  
bootstrap(AppComponent, [
   ToastyService, ToastyConfig, HTTP_PROVIDERS, AppSettings, XCoreToastService, LoggingService, SecurityService, CookieService,
   ROUTER_PROVIDERS, provide(ExceptionHandler, { useClass: RootExceptionHandler})
]);


