import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { XCoreServices } from '../service/core-services.service';
import { AppSettings } from '../../appsettings';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

@Injectable()
export class SecurityService {

    private headers: Headers;
    private storage: any;
    private appSettings: AppSettings;
    constructor(private cookieService: CookieService) {
        this.appSettings = new AppSettings();
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = localStorage;

        if (this.retrieve("xc.IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("xc.HasAdminRole");
            this.IsAuthorized = this.retrieve("xc.IsAuthorized");
        }
    }

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;

    public GetToken(): any {
        return this.retrieve("xc.authorizationData");
    }

    public ResetAuthorizationData() {
        this.store("xc.authorizationData", "");
        this.store("xc.authorizationDataIdToken", "");

        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("xc.HasAdminRole", false);
        this.store("xc.IsAuthorized", false);
    }

    public SetAuthorizationData(token: any, id_token:any) {
        if (this.retrieve("xc.authorizationData") !== "") {
            this.store("xc.authorizationData", "");
        }
        this.store("xc.authorizationData", token);
        this.store("xc.authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("xc.IsAuthorized", true);
    }

    public Authorize() {
        this.ResetAuthorizationData();

        console.log("BEGIN Authorize, no auth data");

        var authServer = this.appSettings.IdentityServerEndpoint;
        
        var authorizationUrl = `${authServer}/connect/authorize`;
        var client_id = this.appSettings.Client_Id;
        var redirect_uri = this.appSettings.ApiRedirectOnLogin;
        var response_type = this.appSettings.ResponseType;
        var scope = this.appSettings.Scopes;
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();

        this.store("xc.authStateControl", state);
        this.store("xc.authNonce", nonce);
        //console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
            "scope=" + encodeURI(scope) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);

        window.location.href = url;
    }

    private retrieveTokensFromUrlHash(): any {
        //Attempt to retrieve tokens from hash        
        var hash = window.location.hash.substr(1);
        return hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            return res;
        }, {});
        
    }
    
    private getUtcNowTicks(): number {
        return Math.floor(new Date().getTime() / 1000); 
    }
    
    private isTokenExpired(token: string): boolean {
        var dataToken: any = this.getDataFromToken(token);
        console.log('Checking for token expiration');
        if (!dataToken.exp || isNaN(parseInt(dataToken.exp)) || this.getUtcNowTicks() >= parseInt(dataToken.exp)) {
            console.log('Token is expired.  Cannot continue authorization');
            return true;
        }        
        return false;
    }

    private isCookieTokenValid(token: string, id_token: string): boolean {
        console.log('Found token and id token in cookies. Continuing check');
        if (this.isTokenExpired(token)) {
            this.ResetAuthorizationData();
            console.log('Could not validate authorization.  New login is required.');
            return false;
        } else {
            this.SetAuthorizationData(token, id_token);
            console.log('Authorization complete and valid (cookie)');                
            return true;
        };        
    }    
    
    private isHashResultValid(error: string, state: string, access_token: string, id_token: string): boolean {
        if (!error) {
            if (!state || state == this.retrieve("xc.authStateControl")) {

                if (access_token && id_token) {
                    
                    console.log("Retrieved token and id token in hash. Continuing check.");                    
                    
                    var dataIdToken: any = this.getDataFromToken(id_token);
                    if (this.isTokenExpired(access_token)) return false;
                    
                    // validate nonce
                    if (dataIdToken.nonce == this.retrieve("xc.authNonce")) {
                        this.store("xc.authNonce", "");
                        this.store("xc.authStateControl", "");
                        console.log('Authorization Successful');
                        return true;
                    }                
                }
            }
        }
        return false;
    }
    public checkAuthorized(): boolean {

        console.log('Checking for valid authorization');
        
        //If stored in cookies then get tokens from there
        var token = this.cookieService.get("xc.authorizationData");
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");        
        if (token && id_token) {
            return this.isCookieTokenValid(token, id_token);
        }
        
        //Check hash for tokens
        this.ResetAuthorizationData();                
        var hashResult: any = this.retrieveTokensFromUrlHash();        
        if (this.isHashResultValid(hashResult.error, hashResult.state, hashResult.access_token, hashResult.id_token)) {
            this.SetAuthorizationData(hashResult.access_token, hashResult.id_token);
            console.log('Authorization complete and valid (hash)');
        }
        else {
            this.ResetAuthorizationData();
            console.log('No valid authorization found');
        }

        return this.IsAuthorized;
    }

    public getUserName():string {
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");
        if (id_token) {
            var dataIdToken: any = this.getDataFromToken(id_token);
            if (dataIdToken) return dataIdToken.given_name;             
        }
        return "";
    }
    
    public Logoff() {
        this.ResetAuthorizationData();
        
            
        // var authServer = this._appSettings.IdentityServerEndpoint;
        // var authorizationUrl = `${authServer}/connect/endsession`;

        // var url =
        //     authorizationUrl + "?" +
        //     `post_logout_redirect_uri=${this._appSettings.ApiRedirectOnLogout}`;

        // window.location.href = url;
    }

    // public HandleError(error: any) {
    //     console.log(error);
    //     if (error.status == 403) {
    //         this._router.navigate(['Forbidden'])
    //     }
    //     else if (error.status == 401) {
    //         this.ResetAuthorizationData();
    //         this._router.navigate(['Unauthorized'])
    //     }
    // }

    private urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        return window.atob(output);
    }

    private getDataFromToken(token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        //Check memory
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }
        //Check cookie
        var cookieVal = this.cookieService.get(key) 
        if (cookieVal) {
            return JSON.parse(cookieVal);
        }        
        return;
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
        this.cookieService.remove(key)
        if (value) this.cookieService.put(key, value)
    }

}
