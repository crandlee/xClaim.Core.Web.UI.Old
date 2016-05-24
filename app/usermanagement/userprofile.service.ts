import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices } from '../shared/service/core-services.service';


@Injectable()
export class UserProfileService extends XCoreServiceBase {
    
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);
        super.setApiController('Values');   
    }
    
    
    public getUserProfile(): Observable<string> {
        return super.getTextData(null, { ServiceDataDescription: "test data", PropogateException: true });
    }
    
}

// export interface IUserProfile {
//     UserName: string;
// }