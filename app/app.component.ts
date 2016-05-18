import { Component } from '@angular/core';
import { SecurityComponent } from './shared/security/security.component';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData} from './shared/ng2-toasty/ng2-toasty';

import { DomainService } from './domain.service';
import { XCoreServices } from './shared/service/core-services.service';

@Component({
    selector: 'xcore-app',
    templateUrl: 'app/app.component.html',
    directives: [SecurityComponent, Toasty, ROUTER_DIRECTIVES],
    providers: [XCoreServices]
})
@Routes([].concat(DomainService.getRoutes()))
export class AppComponent {
    
}
