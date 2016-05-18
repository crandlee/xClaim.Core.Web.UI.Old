import { AppSettings } from '../../appsettings';
import { SecurityService } from '../security/security.service';
import { LoggingService } from '../logging/logging.service';
import { BaseService } from './base-service.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class XCoreServices {
    
    constructor(public LoggingService: LoggingService, 
                public AppSettings: AppSettings, 
                public SecurityService: SecurityService, 
                public Http: Http, 
                public Router: Router,
                public CookieService: CookieService) {
    }    
}

@Injectable()
export class XCoreServiceBase extends BaseService {
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);
    }
    
} 