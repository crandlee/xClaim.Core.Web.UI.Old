import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices } from '../service/core-services.service';
import _ from 'lodash';

@Injectable()
export class HubService extends XCoreServiceBase {
    
    private clientId: string;
    private scopes: string;
    private menuItems: IHubServiceMenuItem[];
    private apiEndpoints: IHubServiceApiEndpoint[];    
    private hubDataLoaded: boolean = false;
    
    public get ClientId():string { return this.clientId; }
    public get Scopes():string { return this.scopes; }
    
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);
            
        //Initially set hub client/scope to the hub client scope.  These will
        //get modified when the hub sends new scopes
        this.clientId = this.xCoreServices.AppSettings.HubClientId;
        this.scopes = this.xCoreServices.AppSettings.HubScopes;
                       
    }

    public getHubData(): Observable<IHubServiceData> {
        
        if (this.hubDataLoaded) return new Observable<IHubServiceData>();
        
        var obs = super.getObjectData<IHubServiceData>({
             ApiRoot: this.xCoreServices.AppSettings.HubApiEndpoint,
             ApiController: this.xCoreServices.AppSettings.HubController,
             ServiceDataDescription: "Menu Items" });
        obs.subscribe(hb => {
           //Update with the proper api scopes - hub should not be called again until total refresh
           this.clientId = this.xCoreServices.AppSettings.ApiClientId;
           this.scopes = hb.Scopes;
           this.apiEndpoints = hb.ApiEndpoints,
           this.menuItems = hb.MenuItems,
           this.hubDataLoaded = true;
        });
        return obs;
    }    
    
    public getApiEndPoint(apiKey: string): IHubServiceApiEndpoint {
        return _.find(this.apiEndpoints, e => { e.ApiKey == apiKey }); 
    }

    public getMenus(): IHubServiceMenuItem[] {
        return this.menuItems; 
    }

    
}

export interface IHubServiceData {
    ApiEndpoints: IHubServiceApiEndpoint[],
    MenuItems: IHubServiceMenuItem[],
    Scopes: string
}

export interface IHubServiceApiEndpoint {
    ApiKey: string;
    ApiRoot: string;
}

export interface IHubServiceMenuItem {
    Key: string,
    Name: string,
    Description: string,
    Route: string,
    Icon: string,
    SubMenus: IHubServiceMenuItem[]
}