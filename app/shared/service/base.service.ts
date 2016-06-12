import {Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from './core-services.service';
import { BusyService } from './busy.service';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/share';
import { IFilterDefinition } from '../filtering/filter.service';

 @Injectable()
export class BaseService {
        
    constructor(
        protected xCoreServices: XCoreServices
        ) {
            this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UnspecifiedService");
        }
    
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
    
    protected initializeTrace(className: string) {
        this.classTrace = this.xCoreServices.LoggingService.getTraceFunction(className);
    }
    
    protected classTrace: (methodName: string) => (methodPosition: TraceMethodPosition, extraMessage?: string) => void;

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

    public logTrace(message: string, options?: any): void {
        this.xCoreServices.LoggingService.trace(message, options);
    }

    private passedAuthentication(): boolean {
        var trace = this.classTrace("passedAuthentication");
        trace(TraceMethodPosition.Entry);
        if (this.xCoreServices.SecurityService.checkAuthorized()) {
            trace(TraceMethodPosition.Exit);
            return true;
        }        
        var currentRoute = this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree);
        this.xCoreServices.CookieService.put(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey,currentRoute);
        this.xCoreServices.SecurityService.Authorize();
        trace(TraceMethodPosition.Exit);
        return false;
    }    
    
    private getCleanRoutePath(routePath: string): string {        
        return routePath ? `/${routePath}` : '';
    }

    private getCleanApiRoot(apiRoot: string): string {        
        return apiRoot.endsWith('/api') ? apiRoot : apiRoot + '/api';
    }
    
    private executeObservable<TData>(obs: Observable<TData>): Observable<TData> {
        var trace = this.classTrace("executeObservable");
        trace(TraceMethodPosition.Entry);
        if (this.passedAuthentication()) {
            this.xCoreServices.BusyService.notifyBusy(true);
            trace(TraceMethodPosition.Exit); 
            return obs;                
        } else {
            //This case shouldn't occur as the user must be authenticated to get here
            return null;
        }   
    }

    protected getTextData(serviceOptions: IServiceOptions, routePath: string, requestOptions?: RequestOptions,  onError?: (error: any, friendlyError: string, caught: Observable<string>) => void): Observable<string> {
        var trace = this.classTrace("getTextData");
        trace(TraceMethodPosition.Entry);
        var baseObs = this.getBaseGetObservable(serviceOptions.ApiRoot, routePath)                                        
                .map(res => { return res.text(); });
            var tailObs = this.getTailGetObservable<string>(baseObs, serviceOptions, onError);   
        var ret  = this.executeObservable(tailObs);
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    private getBaseGetObservable(apiRoot: string, routePath: string, options?: RequestOptions): Observable<Response> {
        var trace = this.classTrace("getBaseGetObservable");
        trace(TraceMethodPosition.Entry);
        apiRoot = this.getCleanApiRoot(apiRoot);
        this.xCoreServices.LoggingService.debug(`Making a GET request to ${apiRoot}${this.getCleanRoutePath(routePath)}`);
        var ret = this.xCoreServices.Http
            .get(`${apiRoot}${this.getCleanRoutePath(routePath)}`, this.setHeaders(options)).share();
        trace(TraceMethodPosition.Exit);
        return ret;
    }   
     
    private getTailGetObservable<TData>(currentObservable: Observable<TData>, serviceOptions?: IServiceOptions,
            onError?:(error: any, friendlyError: string, caught: Observable<TData>) => void): Observable<TData> {
                
        var trace = this.classTrace("getTailGetObservable");
        trace(TraceMethodPosition.Entry);
        if (!onError) onError = (error: any, friendlyError: string,  caught: any) => { this.xCoreServices.LoggingService.error(error, friendlyError); }
        var swallowException = (!serviceOptions || !serviceOptions.PropogateException);
        var suppressDefaultException = (serviceOptions && serviceOptions.SuppressDefaultException); 
        currentObservable = currentObservable
            .catch<TData>((err,caught) => {
                if (suppressDefaultException) throw err;
                var newError = err._body;
                var friendlyError = this.getGeneralErrorMessage("retrieving", serviceOptions);                
                if (!err.status || err.status === 200) newError = friendlyError;                                
                onError(newError, friendlyError, caught);
                if (swallowException) return Observable.empty<TData>();
                throw newError;
            }).share();
        var ret = currentObservable.finally<TData>(() => {
            this.xCoreServices.BusyService.notifyBusy(false);
        });
        
        trace(TraceMethodPosition.Exit);
        return ret;
        
    }

    private getGeneralErrorMessage(action:string, serviceOptions?: IServiceOptions): string {
        
        var trace = this.classTrace("getGeneralErrorMessage");
        
        trace(TraceMethodPosition.Entry);
        var dataDescription: string = serviceOptions && serviceOptions.ServiceDataDescription;
        if (!dataDescription) dataDescription = "requested data"; 
        var errorDescription: string = serviceOptions && serviceOptions.ServiceError; 
        if (!errorDescription) errorDescription = `There was an error ${action} the ${dataDescription}`;
        
        trace(TraceMethodPosition.Exit);
        return errorDescription; 
    }   
     
    protected getObjectData<TData>(serviceOptions: IServiceOptions, routePath: string, 
        requestOptions?: RequestOptions, onError?: (error: any, friendlyError: string, caught: Observable<TData>) => void): Observable<TData> {
            
            var trace = this.classTrace("getObjectData");
            trace(TraceMethodPosition.Entry);
            var baseObs = this.getBaseGetObservable(serviceOptions.ApiRoot, routePath, requestOptions)
                .map<TData>(res => res.json());                
            var tailObs = this.getTailGetObservable<TData>(baseObs, serviceOptions, onError);   
        var ret =  this.executeObservable(tailObs);
        trace(TraceMethodPosition.Exit);
        return ret;
    }
    
    protected postData<T, TRet>(data: T, serviceOptions: IServiceOptions, routePath: string, 
        requestOptions?: RequestOptions, onError?: (error: any, friendlyError: string, caught: Observable<TRet>) => void): Observable<TRet> {
        
        var trace = this.classTrace("postData");
        trace(TraceMethodPosition.Entry);
        serviceOptions.ApiRoot = this.getCleanApiRoot(serviceOptions.ApiRoot);
        var baseObs = this.xCoreServices.Http
                .post(`${serviceOptions.ApiRoot}${this.getCleanRoutePath(routePath)}`, 
                    JSON.stringify(data), this.setHeaders(requestOptions)).share()
                    .map<TRet>( res => { return res.json(); });
        var tailObs = this.getTailGetObservable<TRet>(baseObs, serviceOptions, onError);
        var ret =  this.executeObservable(tailObs);
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    protected putData<T, TRet>(data: T, serviceOptions: IServiceOptions, routePath: string, 
        requestOptions?: RequestOptions, onError?: (error: any, friendlyError: string, caught: Observable<TRet>) => void): Observable<TRet> {
        
        var trace = this.classTrace("putData");
        trace(TraceMethodPosition.Entry);
        serviceOptions.ApiRoot = this.getCleanApiRoot(serviceOptions.ApiRoot);                
        var baseObs = this.xCoreServices.Http
                .put(`${serviceOptions.ApiRoot}${this.getCleanRoutePath(routePath)}`, 
                    JSON.stringify(data), this.setHeaders(requestOptions)).share()
                    .map<TRet>( res => { return res.json(); });
        var tailObs = this.getTailGetObservable<TRet>(baseObs, serviceOptions, onError);
        var ret = this.executeObservable(tailObs);
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    protected deleteData(serviceOptions: IServiceOptions, routePath: string,  
        requestOptions?: RequestOptions, onError?: (error: any, friendlyError: string, caught: Observable<boolean>) => void): Observable<boolean> {
        
        var trace = this.classTrace("deleteData");
        trace(TraceMethodPosition.Entry);
        serviceOptions.ApiRoot = this.getCleanApiRoot(serviceOptions.ApiRoot);                
        var baseObs = this.xCoreServices.Http
                .delete(`${serviceOptions.ApiRoot}${this.getCleanRoutePath(routePath)}`, 
                     this.setHeaders(requestOptions)).share()
                    .map<boolean>( res => { return true; });
        var tailObs = this.getTailGetObservable<boolean>(baseObs, serviceOptions, onError);
        var ret =  this.executeObservable(tailObs);
        trace(TraceMethodPosition.Exit);
        return ret;
    }
        
}


export interface IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient> {
    toViewModel(model: TModel): TViewModel;
    toModel(vm: TViewModel): TModel;
    get(skip?: number, take?: number, filter?: TFilterToServer): Observable<TFilterToClient>
}

export interface ICollectionViewModel<T> {
    RowCount: number;
    Rows: T[];
}

export interface IServiceOptions {
    SuppressDefaultException?: boolean;
    ServiceDataDescription?: string;
    ServiceError?: string;
    PropogateException?: boolean;
    ApiRoot: string
}


