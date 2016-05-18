import { Component, OnInit } from '@angular/core';
import { SecurityComponent } from './shared/security/security.component';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData} from './shared/ng2-toasty/ng2-toasty';

import { DomainService } from './domain.service';
import { XCoreServices } from './shared/service/core-services.service';
import { BusyService } from './shared/service/busy.service';

@Component({
    selector: 'xcore-app',
    templateUrl: 'app/app.component.html',
    styles: ['app/app.component.css'],
    directives: [SecurityComponent, Toasty, ROUTER_DIRECTIVES],
    providers: [XCoreServices]
})
@Routes([].concat(DomainService.getRoutes()))
export class AppComponent implements OnInit {
    
    isBusy: boolean;
    
    constructor(private xCoreServices: XCoreServices) {
        this.isBusy = true;
    }
    
    ngOnInit() {
        AppComponent.subscribeToIsApplicationBusy(this.xCoreServices.BusyService, this);
    }
    
    private static subscribeToIsApplicationBusy(busyService: BusyService, appComponent: AppComponent) {
        busyService.notifyBusy$.subscribe(busyCount => {    
            console.log(busyCount);        
            appComponent.isBusy = (busyCount > 0);
        });

    }
}

