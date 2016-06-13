import { Component, OnInit } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import _ from 'lodash';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { IFormValidationResult } from '../shared/validation/validation.service';
import { ValidationComponent } from '../shared/validation/validation.component';
import { AsyncValidator } from '../shared/validation/async-validator.service';
import { UserProfileValidationService } from './userprofile.validation';
import { UserService, IUserProfile, IUserProfileViewModel } from './user.service';

@Component({
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserService, UserProfileValidationService],
    directives: [ValidationComponent]
})
export class UserProfileComponent extends XCoreBaseComponent implements OnInit  {

    public userProfile: IUserProfileViewModel;
    public active: boolean = false;    
    public form: ControlGroup;
    public validationMessages: IFormValidationResult[] = [];
    public controlDataDescriptions: string[];
            
    constructor(protected xCoreServices: XCoreServices, private userService: UserService, 
        private builder: FormBuilder, private validationService: UserProfileValidationService, private hubService: HubService)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserProfileComponent");        
    }
    
    private initializeForm(builder: FormBuilder): void {

        var trace = this.classTrace("initializeForm");
        trace(TraceMethodPosition.Entry);
        
        //Set up any async validators
        var emailControl = new Control("", Validators.compose([Validators.required, this.validationService.emailValidator]));
        var emailAsyncValidator = AsyncValidator.debounceControl(emailControl, control => this.validationService.isEmailDuplicate(control, this.userService, this.userProfile.Id));

        //Set up controls            
        var buildReturn = this.validationService.buildControlGroup(builder, [
            { controlName: "EMailControl", description: "EMail", control: emailControl},
            { controlName: "PasswordControl", description: "Password", control: new Control("", Validators.compose([Validators.required, UserProfileValidationService.passwordStrength]))},
            { controlName: "ConfirmPasswordControl", description: "Confirm Password", control: new Control("", Validators.compose([Validators.required]))}
        ]);                
        this.form = buildReturn.controlGroup;
        this.controlDataDescriptions = buildReturn.controlDataDescriptions;
        
        //Initialize all validation
        this.form.valueChanges.subscribe(form => {
            trace(TraceMethodPosition.CallbackStart, "FormChangesEvent");
            var flv = Validators.compose([UserProfileValidationService.passwordCompare]);
            var flav = Validators.composeAsync([emailAsyncValidator]);
            this.validationService.getValidationResults(this.form, this.controlDataDescriptions, flv, flav).then(results => {
                this.validationMessages = results;
            });
            trace(TraceMethodPosition.CallbackEnd, "FormChangesEvent");                                    
        });
                
        trace(TraceMethodPosition.Exit);
        
    }
    
    
    private getInitialData(userService: UserService, hubService: HubService): void {
        
        var trace = this.classTrace("getInitialData");
        trace(TraceMethodPosition.Entry);
        
        userService.getUserProfile(this.hubService.HubData.UserId).subscribe(up => {
            trace(TraceMethodPosition.CallbackStart);
            this.userProfile = this.userService.toViewModel(up);
            this.active = true;
            this.initializeForm(this.builder);
            trace(TraceMethodPosition.CallbackEnd);            
        }); 
        
        trace(TraceMethodPosition.Exit);
    }
    
    ngOnInit() {        
        super.NotifyLoaded("UserProfile");        
        var trace = this.classTrace("ngOnInit");
        trace(TraceMethodPosition.Entry);
        this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userService, this.hubService));        
        trace(TraceMethodPosition.Entry);
    }
                 
    public onSubmit(): void {
        var trace = this.classTrace("onSubmit");
        trace(TraceMethodPosition.Entry);
        
        this.userService.saveUserProfile(this.userProfile).subscribe(up => {
            trace(TraceMethodPosition.Callback);
            this.userProfile = up;
            this.xCoreServices.LoggingService.success("User profile successfully updated");
            this.xCoreServices.Router.navigate(["/"]);
        });
        
        trace(TraceMethodPosition.Exit);
    }
    
    public cancel(): void {
        this.xCoreServices.Router.navigate(['/']);
    }
}

