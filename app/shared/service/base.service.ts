import {Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { XCoreServices } from './core-services.service';
import { BusyService } from './busy.service';
import 'rxjs/add/operator/finally';

 @Injectable()
export class BaseService {
    
    protected token: string;
    protected actionUrl: string;
       
    constructor(
        public xCoreServices: XCoreServices
        ) {}
    
    private setHeaders(options: RequestOptions): RequestOptions {
        
        if (!options) options = new RequestOptions();
        if (!options.headers) options.headers = new Headers();       
        options.headers.delete('Content-Type');
        options.headers.delete('Accept');
        options.headers.delete('Authorization');
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');
        var token = this.xCoreServices.SecurityService.GetToken();
        if (token !== "") {
            options.headers.append('Authorization', 'Bearer ' + token);
        }
        return options;
    }

    public logError(message: string, options?: any): void {
        this.xCoreServices.LoggingService.error(message, options);
    }

    public logSuccess(message: string, options?: any): void {
        this.xCoreServices.LoggingService.success(message, options);
    }

    public logWarn(message: string, options?: any): void {
        this.xCoreServices.LoggingService.warn(message, options);
    }

    public log(message: string, options?: any): void {
        this.xCoreServices.LoggingService.default(message, options);
    }

    public logInfo(message: string, options?: any): void {
        this.xCoreServices.LoggingService.info(message, options);
    }

    public logWait(message: string, options?: any): void {
        this.xCoreServices.LoggingService.wait(message, options);
    }

    private passedAuthentication(): boolean {
        if (this.xCoreServices.SecurityService.checkAuthorized()) return true;        
        var currentRoute = this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree);
        this.xCoreServices.CookieService.put(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey,currentRoute);
        this.xCoreServices.SecurityService.Authorize();
        return false;
    }    
    
    private getCleanRoutePath(routePath: string): string {
        return routePath ? `/${routePath}` : '';
    }
    
    private executeObservable<TData>(obs: Observable<TData>): Observable<TData> {
        if (this.passedAuthentication()) {
            this.xCoreServices.BusyService.notifyBusy(true);                        
            return obs;                
        }
        
    }
    protected getData<TData>(routePath?: string, options?: RequestOptions): Observable<TData> {
        var obs = this.executeObservable(
            this.xCoreServices.Http.get(`${this.actionUrl}${this.getCleanRoutePath(routePath)}/`, this.setHeaders(options))
                .map<TData>(res => { return res.json()}))
                .catch((err,caught) => {
                    this.xCoreServices.LoggingService.error(err);
                    return obs; 
                })
                .finally(() => {
                    this.xCoreServices.BusyService.notifyBusy(false);
                });
        return obs;
    }
    
    protected postData(data: any, routePath?: string, options?: RequestOptions): Observable<Response> {
        return this.executeObservable(
            this.xCoreServices.Http.post(`${this.actionUrl}${this.getCleanRoutePath(routePath)}`, JSON.stringify(data), this.setHeaders(options))
        );
    }

    protected putData(data: any, routePath?: string, options?: RequestOptions): Observable<Response> {
        return this.executeObservable(
            this.xCoreServices.Http.put(`${this.actionUrl}${this.getCleanRoutePath(routePath)}`, JSON.stringify(data), this.setHeaders(options))
        );
    }

    protected deleteData(routePath: string, options: RequestOptions): Observable<Response> {
        return this.executeObservable(
            this.xCoreServices.Http.delete(`${this.actionUrl}${this.getCleanRoutePath(routePath)}`, this.setHeaders(options))
        )
    }
        
    protected setApiController(relativeUrl: string) {
        this.actionUrl = `${this.xCoreServices.AppSettings.ApiEndpoint}/${relativeUrl}`; 
    }
           
           
     
}