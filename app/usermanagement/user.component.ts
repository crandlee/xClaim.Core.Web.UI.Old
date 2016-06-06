import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { IFormValidationResult } from '../shared/validation/validation.service';
import { ValidationComponent } from '../shared/validation/validation.component';
import { AsyncValidator } from '../shared/validation/async-validator.service';
import { UserProfileValidationService } from './userprofile.validation';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserProfileService, IUserProfile, IUserProfileViewModel } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import _ from 'lodash';
import { RouteSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UiSwitchComponent } from 'angular2-ui-switch';

@Component({
    templateUrl: 'app/usermanagement/user.component.html',
    providers: [UserProfileService, UserProfileValidationService],
    directives: [ValidationComponent, UiSwitchComponent]
})
export class UserComponent extends XCoreBaseComponent implements OnInit  {

    public userProfile: IUserProfileViewModel;
    public active: boolean = false;    
    public form: ControlGroup;
    public validationMessages: IFormValidationResult[] = [];
    public controlDataDescriptions: string[];
    public userId: string;

                
    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService, 
        private builder: FormBuilder, private validationService: UserProfileValidationService, private hubService: HubService, private routeSegment: RouteSegment, private elementRef: ElementRef)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserComponent");
        this.userId = routeSegment.getParam("id");
        //console.log(this.userId);
    }
    
    private initializeForm(builder: FormBuilder): void {

        var trace = this.classTrace("initializeForm");
        trace(TraceMethodPosition.Entry);
        
        //Set up any async validators
        var emailControl = new Control("", Validators.compose([Validators.required, this.validationService.emailValidator]));
        var emailAsyncValidator = AsyncValidator.debounceControl(emailControl, control => this.validationService.isEmailDuplicate(control, this.userProfileService, this.userProfile.Id));
        var userNameControl = new Control("", Validators.compose([Validators.required]));
        var userNameValidator = AsyncValidator.debounceControl(userNameControl, control => this.validationService.isUserNameDuplicate(control, this.userProfileService, this.userProfile.Id));
            
        //Set up controls            
        var buildReturn = this.validationService.buildControlGroup(builder, [
            { controlName: "UserNameControl", description: "User Name", control: userNameControl},
            { controlName: "FullNameControl", description: "Full Name", control: new Control("", Validators.compose([Validators.required]))},
            { controlName: "EMailControl", description: "EMail", control: emailControl},
            { controlName: "PasswordControl", description: "Password", control: new Control("", Validators.compose([Validators.required, UserProfileValidationService.passwordStrength]))},
            { controlName: "ConfirmPasswordControl", description: "Confirm Password", control: new Control("", Validators.compose([Validators.required]))},
            { controlName: "EnabledControl", description: "Enabled", control: new Control("")}
        ]);                
        this.form = buildReturn.controlGroup;
        this.controlDataDescriptions = buildReturn.controlDataDescriptions;
        
        //Initialize all validation
        this.form.valueChanges.subscribe(form => {
            trace(TraceMethodPosition.CallbackStart, "FormChangesEvent");
            var flv = Validators.compose([UserProfileValidationService.passwordCompare]);
            var flav = Validators.composeAsync([emailAsyncValidator, userNameValidator]);
            this.validationService.getValidationResults(this.form, this.controlDataDescriptions, flv, flav).then(results => {
                this.validationMessages = results;
            });
            trace(TraceMethodPosition.CallbackEnd, "FormChangesEvent");                                    
        });
                
        trace(TraceMethodPosition.Exit);
        
    }
    
    
    private getInitialData(userProfileService: UserProfileService, userId: string): void {
        
        var trace = this.classTrace("getInitialData");
        trace(TraceMethodPosition.Entry);
        
        var fn: () => Observable<IUserProfile> = (!this.userId) 
            ? userProfileService.getNewUser.bind(userProfileService) 
            : userProfileService.getUserProfile.bind(userProfileService, this.userId);
            
                
        fn().subscribe(up => {
            trace(TraceMethodPosition.CallbackStart);
            this.userProfile = this.userProfileService.userProfileToViewModel(up);
            
            if (this.userId == null) {
                this.userProfile.Password = "";
                this.userProfile.ConfirmPassword = "";
                this.userProfile.Enabled = true;
            }
            
            this.active = true;
            this.initializeForm(this.builder);
            
            trace(TraceMethodPosition.CallbackEnd);            
        }); 
        
        trace(TraceMethodPosition.Exit);
    }
    
    ngOnInit() {        
        super.NotifyLoaded("User");        
        var trace = this.classTrace("ngOnInit");
        trace(TraceMethodPosition.Entry);
        
        
        this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userProfileService, this.userId));        
        trace(TraceMethodPosition.Entry);
    }
                 
    onSubmit() {
        var trace = this.classTrace("onSubmit");
        trace(TraceMethodPosition.Entry);
        
        this.userProfileService.saveUserProfile(this.userProfile).subscribe(up => {
            trace(TraceMethodPosition.Callback);
            this.userProfile = this.userProfileService.userProfileToViewModel(up);
            this.xCoreServices.LoggingService.success("User successfully saved");
            this.xCoreServices.Router.navigate(["/UserManagement"]);
        });
        
        trace(TraceMethodPosition.Exit);
    }
}

