import { Component, ViewContainerRef } from '@angular/core';
import { SecurityComponent } from './shared/security/security.component';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData} from './shared/ng2-toasty/ng2-toasty';
import { DomainService } from './domain.service';
import { XCoreServices } from './shared/service/core-services.service';
import { HubService } from './shared/hub/hub.service';
import { TimerWrapper } from '@angular/core/src/facade/async';
import { ScrollService } from './shared/scroll/scroll.service';

declare var $:any;

@Component({
    selector: 'xcore-app',
    templateUrl: 'app/app.component.html',
    styles: ['app/app.component.css'],
    directives: [SecurityComponent, Toasty, ROUTER_DIRECTIVES],
    providers: [XCoreServices, HubService, ScrollService]
})
@Routes([].concat(DomainService.getRoutes()))
export class AppComponent  {
        
    private currentlyWaitingForScroll: boolean = false;

    constructor(private scrollService: ScrollService) {
    }
    
    //Setup scroll events (allows infinite paging)
    public onScroll(event): void {
        if (!this.currentlyWaitingForScroll) {
            this.currentlyWaitingForScroll = true;
            TimerWrapper.setTimeout(this.onScrollTimerEvent.bind(this, event),1000);
        }
    }

    public onScrollTimerEvent(event): void  {
        this.scrollService.checkNearBottom();
        this.currentlyWaitingForScroll = false;
    }
}

