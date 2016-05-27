import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
    private hubData: IHubServiceData;
    private id: number;
    
    public get Id(): number  { return this.id; }
    public get HubData(): IHubServiceData { return this.hubData; }
    public get ClientId():string { return this.clientId; }
    public get Scopes():string { return this.scopes; }
    
    private HubDataRetrievedSource = new Subject<IHubServiceData>();
    private HubDataCompletedSource = new Subject<IHubServiceData>();
    
    public HubDataRetrievedEvent = this.HubDataRetrievedSource.asObservable().share();
    public HubDataCompletedEvent = this.HubDataCompletedSource.asObservable().share();
    
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);
        //Initially set hub client/scope to the hub client scope.  These will
        //get modified when the hub sends new scopes
        this.clientId = this.xCoreServices.AppSettings.ApiClientId;
        this.scopes = this.xCoreServices.AppSettings.HubScopes;
        this.id = parseInt(String(Math.random() * 100));
    }

    public retrieveHubData(): void {
        
        var obs = super.getObjectData<IHubServiceData>({
             ApiRoot: this.xCoreServices.AppSettings.HubApiEndpoint,
             ApiController: this.xCoreServices.AppSettings.HubController,
             ServiceDataDescription: "Menu Items" });
        obs.subscribe(hb => {
           //Update with the proper api scopes - hub should not be called again until total refresh
           this.clientId = this.xCoreServices.AppSettings.ApiClientId;
           this.scopes = hb.Scopes;
           this.hubData = hb;
           this.HubDataRetrievedSource.next(hb);
        });
        
    }    
    
    public triggerHubDataCompletedLoading(): void {
        this.HubDataCompletedSource.next(this.hubData);        
    }
    
    public findApiEndPoint(apiKey: string): IHubServiceApiEndpoint {
        return _.find(this.hubData.ApiEndpoints, e => { e.ApiKey == apiKey }); 
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