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
        super.setApiController('UserProfile');   
    }
    
    
    public getUserProfile(): Observable<IUserProfile[]> {
        return super.getData<IUserProfile[]>();
    }
    
}

export interface IUserProfile {
    UserName: string;
}