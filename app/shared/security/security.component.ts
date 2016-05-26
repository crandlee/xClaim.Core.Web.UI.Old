
import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';
import { DROPDOWN_DIRECTIVES, CollapseDirective } from 'ng2-bootstrap';
import { CORE_DIRECTIVES } from '@angular/common';
import { HubService, IHubServiceData } from '../hub/hub.service';
import _ from 'lodash';

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
    public status:{isopen: boolean} = {isopen: true};
    public isCollapsed:boolean = true;
    public menuStatuses: IDropDownMenuStatus[] = [];    
    public hubData: IHubServiceData =  { ApiEndpoints: [], MenuItems: [], Scopes:"" };
    
    constructor( 
        private xCoreServices: XCoreServices, private hubService: HubService) {
    }
              
    // private getDropdownMenuStatus(name: string) {
    //     var existingStatus = _.find(this.menuStatuses, name);
    //     if (!existingStatus) return { MenuName: name, MenuOpen: false }    
    // }
    
    // private toggleDropdownMenuStatus(name: string) {
    //     var existingStatus = this.getDropdownMenuStatus(name);
    //     existingStatus.MenuOpen = !existingStatus.MenuOpen;            
    // }   
     
    // private saveDropdownMenuStatus(name: string, open: boolean) {
    //     var existingStatus = this.getDropdownMenuStatus(name);
    //     existingStatus.MenuOpen = open;
    // }
    
    private performPostLoginProcedure() {
        
        this.subscribeToIsApplicationBusy();
        this.retrieveHubData();
    }
    
    private retrieveHubData() {
        this.xCoreServices.LoggingService.debug(`Retrieving data from hub at ${this.xCoreServices.AppSettings.HubApiEndpoint}`, { noToast: true });
        this.hubService.retrieveHubData().subscribe(hubData => {
            this.xCoreServices.LoggingService.debug(`Retrieved ${this.hubService.HubData.ApiEndpoints.length} api endpoints and ${this.hubService.HubData.MenuItems.length} menu items from the hub`);                
            this.hubData = this.hubService.HubData;
            _.each(this.hubData.MenuItems, mi => {
                this.menuStatuses.push({ MenuName: mi.Name, MenuOpen: false});
            });
            if (this.hubData.Scopes !== this.xCoreServices.AppSettings.HubScopes 
                && this.xCoreServices.SecurityService.getCurrentScopes() == this.xCoreServices.AppSettings.HubScopes) {                
                //Now that hub has returned data, request new authorization with requested scopes
                //(only if requested scopes are different, which they should be)
                this.xCoreServices.SecurityService.requestNewScopeAuthorization(this.hubData.Scopes);                        
            }
            this.performPostLoginRouting();            
        });            
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
        
    public resetHubData() {
        this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes:"" }        
    }
    public logout(): void {
        try {
            this.xCoreServices.SecurityService.Logoff();
            this.loggedIn = false;
            this.isCollapsed = true;
            this.resetHubData();
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
        if (!route) return;
        this.xCoreServices.Router.navigate([route]);        
    }
    
    private subscribeToIsApplicationBusy() {
        this.xCoreServices.BusyService.notifyBusy$.subscribe(busyCount => { 
            this.isBusy = (busyCount > 0);
        });
    }


                  
}

interface IDropDownMenuStatus {
    MenuName: string,
    MenuOpen: boolean
}  