import { Component, OnInit } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { IFormValidationResult } from '../shared/validation/validation.service';
import { UserProfileValidationService } from './userprofile.validation';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserProfileService, IUserProfile } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';

@Component({
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserProfileService, UserProfileValidationService]
})
export class UserProfileComponent extends XCoreBaseComponent implements OnInit  {

    public userProfile: IUserProfileViewModel;
    public active: boolean = false;    
    public form: ControlGroup;
    public validationMessages: IFormValidationResult[] = [];
    public controlDataDescriptions: string[];
            
    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService, 
        private builder: FormBuilder, private validationService: UserProfileValidationService, private hubService: HubService)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserProfileComponent");        
    }
    
    private initializeForm(builder: FormBuilder): void {

        var trace = this.classTrace("initializeForm");
        trace(TraceMethodPosition.Entry);

        var buildReturn = this.validationService.buildControlGroup(builder, [
            { controlName: "EMailControl", description: "EMail", control: new Control("", Validators.compose([Validators.required, UserProfileValidationService.emailValidator]))},
            { controlName: "PasswordControl", description: "Password", control: new Control("", Validators.compose([Validators.required]))},
            { controlName: "ConfirmPasswordControl", description: "Confirm Password", control: new Control("", Validators.compose([Validators.required]))}
        ]);
        
        this.form = buildReturn.controlGroup;
        this.controlDataDescriptions = buildReturn.controlDataDescriptions;
        
        this.form.valueChanges.subscribe(form => {
            trace(TraceMethodPosition.CallbackStart, "FormChangesEvent");
            var flv = Validators.compose([UserProfileValidationService.passwordCompare]);
            this.validationMessages = this.validationService.getValidationResults(this.form, this.controlDataDescriptions, flv);
            trace(TraceMethodPosition.CallbackEnd, "FormChangesEvent");                                    
        });
        
        trace(TraceMethodPosition.Exit);
        
    }
    
    private getInitialData(userProfileService: UserProfileService, hubService: HubService): void {
        
        var trace = this.classTrace("getInitialData");
        trace(TraceMethodPosition.Entry);
        
        userProfileService.getUserProfile(this.hubService.HubData.UserId).subscribe(up => {
            trace(TraceMethodPosition.CallbackStart);
            console.log(up);
            // this.userProfile = {
            //     UserName: up.UserName,
            //     EmailAddress: up.EmailAddress,
            //     Password: up.Password,
            //     ConfirmPassword: up.ConfirmPassword      
            // };            
            this.active = true;
            this.initializeForm(this.builder);
            trace(TraceMethodPosition.CallbackEnd);            
        }); 

        trace(TraceMethodPosition.Exit);
    }
    
    ngOnInit() {        
        super.NotifyLoaded("UserProfile");        
        
        if (this.hubService.HubDataLoaded)
            this.getInitialData(this.userProfileService, this.hubService);
        else           
            this.hubService.HubDataCompletedEvent.subscribe(hd => {                
                this.getInitialData(this.userProfileService, this.hubService);        
            });
        
    }
                  
}

export interface IUserProfileViewModel {
     UserName: string;
     EmailAddress: string;
     Password?: string;
     ConfirmPassword?: string;
}