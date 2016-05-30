import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices } from '../shared/service/core-services.service';


@Injectable()
export class UserProfileService extends XCoreServiceBase {
    
    private apiController: string = 'UserProfile';
     
    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);        
    }
            
    public getUserProfile(): Observable<string> {
        
        return null;
    }
    
}

// export interface IUserProfile {
//     UserName: string;
// }