import { AppSettings } from '../../appsettings';
import { SecurityService } from '../security/security.service';
import { LoggingService } from '../logging/logging.service';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import { BusyService } from './busy.service';
import { ScrollService } from '../scroll/scroll.service';
import { HubService } from '../hub/hub.service';

@Injectable()
export class XCoreServices {
    
    constructor(public LoggingService: LoggingService, 
                public AppSettings: AppSettings, 
                public SecurityService: SecurityService, 
                public Http: Http, 
                public Router: Router,
                public CookieService: CookieService,
                public BusyService: BusyService,
                public ScrollService: ScrollService) {                    
    }    
}

@Injectable()
export class XCoreServiceBase extends BaseService {
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);
    }
    
} 

export enum TraceMethodPosition {
    Entry,
    Exit,
    Callback,
    CallbackStart,
    CallbackEnd
}

export interface INameValue<T> {
    Name: string,
    Value: T
}