import { Component, ViewContainerRef } from '@angular/core';
import { SecurityComponent } from './shared/security/security.component';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData} from './shared/ng2-toasty/ng2-toasty';
import { DomainService } from './domain.service';
import { XCoreServices } from './shared/service/core-services.service';
import { HubService } from './shared/hub/hub.service';

@Component({
    selector: 'xcore-app',
    templateUrl: 'app/app.component.html',
    styles: ['app/app.component.css'],
    directives: [SecurityComponent, Toasty, ROUTER_DIRECTIVES],
    providers: [XCoreServices, HubService]
})
@Routes([].concat(DomainService.getRoutes()))
export class AppComponent  {
        
    constructor() {
    }
    
        
}

