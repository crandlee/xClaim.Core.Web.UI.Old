
import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';

@Component({
    selector: 'xcore-security',
    templateUrl: 'app/shared/security/security.component.html',
    providers: [XCoreServices]
})
export class SecurityComponent implements OnInit {

    public loggedIn: boolean;
    public userName: string;
    
    constructor( 
        private xCoreServices: XCoreServices) {
           
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
            this.xCoreServices.Router.navigate(['/']);
        } catch (err) {
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }
    };
    
    public ngOnInit(): void {
        try {
            this.loggedIn = this.xCoreServices.SecurityService.checkAuthorized();
            this.userName = this.xCoreServices.SecurityService.getUserName();
            this.performPostLoginRouting();
                                                                        
        } catch (err) {            
            this.xCoreServices.LoggingService.error(JSON.stringify(err));
        }

    };
              
}