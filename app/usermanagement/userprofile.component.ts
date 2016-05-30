import { Component, OnInit } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { ValidationService } from '../shared/validation/validation.service';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserProfileService, IUserProfile } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';

@Component({
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserProfileService]
})
export class UserProfileComponent extends XCoreBaseComponent implements OnInit  {

    public userProfile: IUserProfileViewModel;
    public active: boolean = false;
    
    public form: ControlGroup;
    public EMailControl: Control;
 
    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService, private builder: FormBuilder)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserProfileComponent");

        this.EMailControl = new Control("", Validators.compose([Validators.required, ValidationService.emailValidator]));
        this.form = builder.group({ EMailControl: this.EMailControl });
    }
    
    ngOnInit() {

        var trace = this.classTrace("ngOnInit");
        trace(TraceMethodPosition.Entry);
        
        super.NotifyLoaded("UserProfile");

        this.userProfileService.userProfileObservable.subscribe(up => {
            trace(TraceMethodPosition.CallbackStart);
            this.userProfile = {
                UserName: up.UserName,
                EmailAddress: up.EmailAddress,
                Password: up.ConfirmPassword,
                ConfirmPassword: up.ConfirmPassword      
            };            
            this.active = true;
            trace(TraceMethodPosition.CallbackEnd);
            
        }); 
        this.userProfileService.getUserProfile();
        
        trace(TraceMethodPosition.Exit);
    }
                  
}

export interface IUserProfileViewModel {
     UserName: string;
     EmailAddress: string;
     Password?: string;
     ConfirmPassword?: string;
}