import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices } from '../shared/service/core-services.service';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserProfileService extends XCoreServiceBase {
    
    private apiController: string = 'UserProfile';
    public userProfileSubject = new Subject<IUserProfile>();
    public userProfileObservable = this.userProfileSubject.asObservable().share();

    constructor(xCoreServices: XCoreServices) {
        super(xCoreServices);        
    }
            
    public getUserProfile(): Observable<IUserProfile> {        
        this.userProfileSubject.next({
           UserName: "rlee",
           EmailAddress: "crandlee@gmail.com"            
        });
        return this.userProfileObservable;
    }
    
}

export interface IUserProfile {
     UserName: string;
     EmailAddress: string;
     Password?: string;
     ConfirmPassword?: string;
}