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
import { BusyService } from './shared/service/busy.service';
import { HubService } from './shared/hub/hub.service';
import {MODAL_BROWSER_PROVIDERS} from 'angular2-modal/platform-browser/index';

// Our main component
import { AppComponent } from './app.component';

@Injectable()
export class RootExceptionHandler  {
  
  constructor(private logService: LoggingService) {}
  
  call(error, stackTrace = null, reason = null) {
    this.logService.error(error);
  }
  
}

  
bootstrap(AppComponent, [
   ...MODAL_BROWSER_PROVIDERS, ToastyService, ToastyConfig, HTTP_PROVIDERS, AppSettings, XCoreToastService, 
   LoggingService, SecurityService, CookieService, BusyService, HubService,
   ROUTER_PROVIDERS, provide(ExceptionHandler, { useClass: RootExceptionHandler}), provide(Window, { useValue: window })
]);


