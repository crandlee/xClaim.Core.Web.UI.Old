
import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';
import { DROPDOWN_DIRECTIVES, CollapseDirective } from 'ng2-bootstrap';
import { CORE_DIRECTIVES } from '@angular/common';
import { HubService, IHubServiceData } from '../hub/hub.service';
@Component({
    selector: 'xcore-security',
    templateUrl: 'app/shared/security/security.component.html',
    styleUrls: ['app/shared/security/security.component.css'],
    directives: [CollapseDirective, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES],
    providers: [XCoreServices, HubService]
})
export class SecurityComponent implements OnInit {

    public loggedIn: boolean;
    public userName: string;
    public isBusy: boolean = false;
    public disabled: boolean = false;
    public status:{isopen:boolean} = {isopen: false};
    public isCollapsed:boolean = true;
    
    public hubData: IHubServiceData;
    
    constructor( 
        private xCoreServices: XCoreServices, private hubService: HubService) {
    }
          
    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }  
    
    private performPostLoginProcedure() {
        
        this.subscribeToIsApplicationBusy();
        this.retrieveHubData();
        this.performPostLoginRouting();    
    }
    
    private retrieveHubData() {
        this.hubService.getHubData().subscribe(hubData => {
            console.log(hubData);
        });
    }
    
    private recheckAuthenticationWithNewScopes() {
        
    }
    
    private performPostLoginRouting() {
        //Check for needed routing from post-login (where are previous route was requested and stored)
        var needRoute = this.xCoreServices.CookieService.get(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
        if (needRoute) {
            this.xCoreServices.CookieService.remove(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
            this.xCoreServices.Router.navigate([`${needRoute}`]);
        }        
    }

    public login(): void {
        try {
            this.xCoreServices.SecurityService.Authorize();
        } catch (err) {
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }
    };
        
    public logout(): void {
        try {
            this.xCoreServices.SecurityService.Logoff();
            this.loggedIn = false;
            this.isCollapsed = true;
            this.xCoreServices.Router.navigate(['/']);
        } catch (err) {
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }
    };
    
    public ngOnInit(): void {
        try {            
            this.loggedIn = this.xCoreServices.SecurityService.checkAuthorized();            
            this.userName = this.xCoreServices.SecurityService.getUserName();                                   
            this.performPostLoginProcedure();
            
        } catch (err) {            
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }

    };
    
    public navigateToRoute(route: string): void {
        this.xCoreServices.Router.navigate([route]);        
    }
    
    private subscribeToIsApplicationBusy() {
        this.xCoreServices.BusyService.notifyBusy$.subscribe(busyCount => { 
            this.isBusy = (busyCount > 0);
        });
    }

              
}