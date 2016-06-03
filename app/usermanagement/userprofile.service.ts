import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { XCoreServiceBase, XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { HubService } from '../shared/hub/hub.service';
import { IServiceOptions } from '../shared/service/base.service';
import _ from 'lodash';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserProfileService extends XCoreServiceBase {
    
    private apiController: string = 'UserProfile';

    constructor(xCoreServices: XCoreServices, private hubService: HubService) {
        super(xCoreServices);
        
         this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UserProfileService");
    }
            
    private getEndpoint(): IServiceOptions {
        var trace = this.classTrace("getEndpoint");
        trace(TraceMethodPosition.Entry);
        var obs = { ApiRoot: this.hubService.findApiEndPoint('xClaim.Core.Web.Api.Security').ApiRoot };
        trace(TraceMethodPosition.Exit);
        return obs;
    }
    
    public getUserProfile(userId: string): Observable<IUserProfile> {        
        var trace = this.classTrace("getUserProfile");
        trace(TraceMethodPosition.Entry);
        var obs = this.getObjectData<IUserProfile>(this.getEndpoint(), `userfromid/${userId}`);
        trace(TraceMethodPosition.Exit);
        return obs;
    }
    
    public isEmailDuplicate(email: string, userId: string): Observable<boolean> {
        var trace = this.classTrace("getUserProfile");
        trace(TraceMethodPosition.Entry);                
        var obs = this.getObjectData<boolean>(this.getEndpoint(), `userfromemail/${email}/isduplicated/${userId}`);
        trace(TraceMethodPosition.Exit);
        return obs;
    }
    
    public userProfileToModel(vm: IUserProfileViewModel): IUserProfile {
        var trace = this.classTrace("userProfileToModel");
        trace(TraceMethodPosition.Entry);
        var up: IUserProfile = {
            Name: vm.Name,
            Id: vm.Id,
            SavePassword: vm.Password,
            ConfirmPassword: vm.ConfirmPassword,
            SaveGivenName: vm.GivenName,
            SaveEmailAddress: vm.EmailAddress,
            Claims: []
        };        
        trace(TraceMethodPosition.Exit);
        return up;
    }

    public userProfileToViewModel(model: IUserProfile): IUserProfileViewModel {
        var trace = this.classTrace("userProfileToModel");
        trace(TraceMethodPosition.Entry);
            var emailClaim = _.find(model.Claims, c => c.Definition && c.Definition.Name == "email");
            var givenNameClaim = _.find(model.Claims, c => c.Definition && c.Definition.Name == "given_name");
            var vm: IUserProfileViewModel  = {
                 Id: model.Id,
                 Name: model.Name,
                 GivenName: (givenNameClaim && givenNameClaim.Value) || "",
                 EmailAddress: (emailClaim && emailClaim.Value) || "",
                 Password: "Dummy@000",
                 ConfirmPassword: "Dummy@000"      
            };            
        
        trace(TraceMethodPosition.Exit);
        return vm;
    }
    
    public saveUserProfile(vm: IUserProfileViewModel): Observable<IUserProfile> {
        var trace = this.classTrace("saveUserProfile");
        trace(TraceMethodPosition.Entry);                
        var obs = this.postData(this.userProfileToModel(vm), this.getEndpoint(), 'user')        
        trace(TraceMethodPosition.Exit)
        return obs;
    }
           
}

export interface IUserProfileViewModel {
     Name: string;
     Id: string;
     EmailAddress: string;
     GivenName: string;
     Password?: string;
     ConfirmPassword?: string;          
}

export interface IUserClaimViewModel {
     Name: string;
     Description: string;
     Value: string;
}

export interface IUserProfile {
     Name: string;
     Id: string;
     SavePassword: string;
     ConfirmPassword: string;
     SaveGivenName: string;
     SaveEmailAddress: string;    
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