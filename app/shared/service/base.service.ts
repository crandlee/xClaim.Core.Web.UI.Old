import {Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { XCoreServices } from './core-services.service';
import { BusyService } from './busy.service';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/share';

 @Injectable()
export class BaseService {
        
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
        this.xCoreServices.LoggingService.debug(message, options);
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
        } else {
            //This case shouldn't occur as the user must be authenticated to get here
            return null;
        }   
    }

    protected getTextData(serviceOptions: IServiceOptions, routePath?: string, requestOptions?: RequestOptions,  onError?: (error: any, caught: Observable<string>) => void): Observable<string> {
        var baseObs = this.getBaseGetObservable(serviceOptions.ApiController, routePath)                                        
                .map(res => { return res.text(); });
            var tailObs = this.getTailGetObservable<string>(baseObs, serviceOptions, onError);   
        return this.executeObservable(tailObs);
    }

    private getBaseGetObservable(apiRoot: string, controllerUrl: string, routePath?: string, options?: RequestOptions): Observable<Response> {
        this.xCoreServices.LoggingService.debug(`Making a GET request to ${apiRoot}/${controllerUrl}/${routePath || ''}`);
        return this.xCoreServices.Http
            .get(`${apiRoot}/${controllerUrl}${this.getCleanRoutePath(routePath)}/`, this.setHeaders(options)).share();                                                
    }   
     
    private getTailGetObservable<TData>(currentObservable: Observable<TData>, serviceOptions?: IServiceOptions,
            onError?:(error: any, caught: Observable<TData>) => void): Observable<TData> {        
        if (!onError) onError = (error: any, caught: any) => { this.xCoreServices.LoggingService.error(error); }
        var swallowException = (!serviceOptions || !serviceOptions.PropogateException);
        var suppressDefaultException = (serviceOptions && serviceOptions.SuppressDefaultException); 
        currentObservable = currentObservable
            .catch<TData>((err,caught) => {                
                if (suppressDefaultException) throw err;
                var newError = this.getGeneralErrorMessage("retrieving", serviceOptions);
                onError(newError, caught);
                if (swallowException) return Observable.empty<TData>();
                throw newError;
            }).share();
        return currentObservable.finally(() => {
            this.xCoreServices.BusyService.notifyBusy(false);
        });
                       
    }

    private getGeneralErrorMessage(action:string, serviceOptions?: IServiceOptions): string {
        var dataDescription: string = serviceOptions && serviceOptions.ServiceDataDescription;
        if (!dataDescription) dataDescription = "requested data"; 
        var errorDescription: string = serviceOptions && serviceOptions.ServiceError; 
        if (!errorDescription) errorDescription = `There was an error ${action} the ${dataDescription}`;
        return errorDescription; 
    }   
     
    protected getObjectData<TData>(serviceOptions: IServiceOptions, routePath?: string, 
        requestOptions?: RequestOptions, onError?: (error: any, caught: Observable<TData>) => void): Observable<TData> {            
            var baseObs = this.getBaseGetObservable(serviceOptions.ApiRoot, serviceOptions.ApiController, routePath, requestOptions)
                .map<TData>(res => { return res.json(); });                
            var tailObs = this.getTailGetObservable<TData>(baseObs, serviceOptions, onError);   
        return this.executeObservable(tailObs);
    }
    
    protected postData(data: any, serviceOptions: IServiceOptions,routePath?: string, 
        requestOptions?: RequestOptions, onError?: (error: any, caught: Observable<Response>) => void): Observable<Response> {

        var baseObs = this.xCoreServices.Http
                .post(`${serviceOptions.ApiRoot}/${serviceOptions.ApiController}${this.getCleanRoutePath(routePath)}`, 
                    JSON.stringify(data), this.setHeaders(requestOptions)).share();
        var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
        return this.executeObservable(tailObs);
    }

    protected putData(data: any, serviceOptions: IServiceOptions, routePath?: string, 
        requestOptions?: RequestOptions, onError?: (error: any, caught: Observable<Response>) => void): Observable<Response> {

        var baseObs = this.xCoreServices.Http
                .put(`${serviceOptions.ApiRoot}/${serviceOptions.ApiController}${this.getCleanRoutePath(routePath)}`, 
                    JSON.stringify(data), this.setHeaders(requestOptions)).share();
        var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
        return this.executeObservable(tailObs);
    }

    protected deleteData(data: any, serviceOptions: IServiceOptions, routePath?: string,  
        requestOptions?: RequestOptions, onError?: (error: any, caught: Observable<Response>) => void): Observable<Response> {
            
        var baseObs = this.xCoreServices.Http
                .delete(`${serviceOptions.ApiRoot}/${serviceOptions.ApiController}${this.getCleanRoutePath(routePath)}`, 
                    this.setHeaders(requestOptions)).share();
        var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
        return this.executeObservable(tailObs);
    }
    
                
}


export interface IServiceOptions {
    SuppressDefaultException?: boolean;
    ServiceDataDescription?: string;
    ServiceError?: string;
    PropogateException?: boolean;
    ApiRoot: string,
    ApiController: string
}


