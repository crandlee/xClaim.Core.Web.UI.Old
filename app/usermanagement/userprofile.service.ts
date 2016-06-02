import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices } from '../shared/service/core-services.service';
import { HubService } from '../shared/hub/hub.service';
import { IServiceOptions } from '../shared/service/base.service';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserProfileService extends XCoreServiceBase {
    
    private apiController: string = 'UserProfile';

    constructor(xCoreServices: XCoreServices, private hubService: HubService) {
        super(xCoreServices);
        
    }
            
    private getEndpoint(): IServiceOptions {
        return { ApiRoot: this.hubService.findApiEndPoint('xClaim.Core.Web.Api.Security').ApiRoot };
    }
    
    public getUserProfile(userId: string): Observable<IUserProfile> {        
        return this.getObjectData<IUserProfile>(this.getEndpoint(), `userfromid/${userId}`);
    }
    
    public isEmailDuplicate(email: string, userId: string): Observable<boolean> {        
        return this.getObjectData<boolean>(this.getEndpoint(), `userfromemail/${email}/isduplicated/${userId}`);
    }

}

export interface IUserProfile {
     Name: string;
     Id: string;
     Enabled?: boolean;
     AccessFailedCount: number;
     LockoutEnd?: Date;
     Claims: IUserClaim[]
}

export interface IUserClaim {
     Definition: IClaimDefinition;
     Id: string;         
     Value?: string;
}

export interface IClaimDefinition {
     Id: string;
     Name: string;
     Description?: string;
}