
import { Component, OnInit } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../service/core-services.service';
import { XCoreBaseComponent } from '../component/base.component';

import { DROPDOWN_DIRECTIVES, CollapseDirective } from 'ng2-bootstrap';
import { CORE_DIRECTIVES } from '@angular/common';
import { HubService, IHubServiceData } from '../hub/hub.service';
import _ from 'lodash';

@Component({
    selector: 'xcore-security',
    templateUrl: 'app/shared/security/security.component.html',
    styleUrls: ['app/shared/security/security.component.css'],
    directives: [CollapseDirective, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES],
    providers: []
})
export class SecurityComponent extends XCoreBaseComponent implements OnInit  {

    public loggedIn: boolean;
    public userName: string;
    public isBusy: boolean = false;
    public isCollapsed:boolean = true;
    public hubData: IHubServiceData =  { ApiEndpoints: [], MenuItems: [], Scopes:"", UserId: null };
    
    constructor( 
        protected xCoreServices: XCoreServices, private hubService: HubService) {
            super(xCoreServices);
            
            this.initializeTrace("SecurityComponent");               

    }
                  
    private performPostLoginProcedure() {

        var trace = this.classTrace("performPostLoginProcedure");        
        trace(TraceMethodPosition.Entry);
        
        this.subscribeToIsApplicationBusy();
        this.retrieveHubData();
        trace(TraceMethodPosition.Exit);
    }
    
    private retrieveHubData() {
        
        var trace = this.classTrace("retrieveHubData");        
        trace(TraceMethodPosition.Entry);
        
        //Set up event subscriptions   
        this.hubService.HubDataRetrievedEvent.subscribe(hubData => {
            trace(TraceMethodPosition.CallbackStart, "HubDataRetrievedEvent");
            this.receiveHubDataAndReAuthorize();
            trace(TraceMethodPosition.CallbackEnd, "HubDataRetrievedEvent");
        });                    
        this.xCoreServices.LoggingService.debug(`Retrieving data from hub at ${this.xCoreServices.AppSettings.HubApiEndpoint}`, { noToast: true });
        this.hubService.retrieveHubData();        
        
        trace(TraceMethodPosition.Exit);
    }
        

    private receiveHubDataAndReAuthorize() {
        
        var trace = this.classTrace("receiveHubDataAndReAuthorize");        
        trace(TraceMethodPosition.Entry);
        
        this.xCoreServices.LoggingService.debug(`Retrieved ${this.hubService.HubData.ApiEndpoints.length} api endpoints and ${this.hubService.HubData.MenuItems.length} menu items from the hub`);                
        this.hubData = this.hubService.HubData;
        if (this.hubData.Scopes !== this.xCoreServices.AppSettings.HubScopes 
            && this.xCoreServices.SecurityService.getCurrentScopes() == this.xCoreServices.AppSettings.HubScopes) {                
            //Now that hub has returned data, request new authorization with requested scopes
            //(only if requested scopes are different, which they should be)
            this.xCoreServices.SecurityService.requestNewScopeAuthorization(this.hubData.Scopes);
        } else {
            this.xCoreServices.LoggingService.debug("No more reauthorization needed. Scopes are up to date");
        }
        //This call is to allow other components interested in hub data to know it is finalized.
        this.hubService.triggerHubDataCompletedLoading();
        this.performPostLoginRouting();
        
        trace(TraceMethodPosition.Exit);
    }
        
    private performPostLoginRouting() {
        
        var trace = this.classTrace("performPostLoginRouting");        
        trace(TraceMethodPosition.Entry);

        //Check for needed routing from post-login (where are previous route was requested and stored)
        var needRoute = this.xCoreServices.CookieService.get(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
        if (needRoute) {
            this.xCoreServices.CookieService.remove(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
            this.xCoreServices.Router.navigate([`${needRoute}`]);
        }        
        
        trace(TraceMethodPosition.Exit);
    }

    public login(): void {
        
        var trace = this.classTrace("login");        
        trace(TraceMethodPosition.Entry);
        
        try {
            this.xCoreServices.SecurityService.Authorize();
        } catch (err) {
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }
        
        trace(TraceMethodPosition.Exit);
    };
        
    public resetLocalHubData() {
        this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes:"", UserId: "" }        
    }
    
    public logout(): void {
        
        var trace = this.classTrace("logout");        
        trace(TraceMethodPosition.Entry);

        try {
            this.xCoreServices.SecurityService.Logoff();
            this.loggedIn = false;
            this.isCollapsed = true;
            this.resetLocalHubData();
            this.xCoreServices.Router.navigate(['/']);            
        } catch (err) {
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }
        
        trace(TraceMethodPosition.Exit);
    };
    
    public ngOnInit(): void {
        
        var trace = this.classTrace("ngOnInit");        
        trace(TraceMethodPosition.Entry);

        super.NotifyLoaded("Security");
        
         try {  
             this.loggedIn = this.xCoreServices.SecurityService.checkAuthorized();            
             this.userName = this.xCoreServices.SecurityService.getUserName();                                   
             this.performPostLoginProcedure();
         } catch (err) {            
             this.xCoreServices.LoggingService.error(JSON.stringify(err));
         }
         
         trace(TraceMethodPosition.Exit);
         
    };
    
    
    public navigateToRoute(route: string): void {
        
        var trace = this.classTrace("navigateToRoute");        
        trace(TraceMethodPosition.Entry);
        
        if (!route) return;
        this.xCoreServices.Router.navigate([route]);  
        this.isCollapsed = true;      
        
        trace(TraceMethodPosition.Exit);
    }
    
    private subscribeToIsApplicationBusy() {
        
        var trace = this.classTrace("subscribeToIsApplicationBusy");        
        trace(TraceMethodPosition.Entry);

        this.xCoreServices.BusyService.notifyBusy$.subscribe(busyCount => {
            trace(TraceMethodPosition.Callback, `notifyBusy ${busyCount}`); 
            this.isBusy = (busyCount > 0);
        });
        
        trace(TraceMethodPosition.Exit);
    }
                  
}

