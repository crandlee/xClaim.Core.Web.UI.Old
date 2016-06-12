import { Component, Input, ViewChild } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserService, IUserProfile, IUserProfileViewModel } from '../usermanagement/user.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { INgTableColumn, INgTableConfig, INgTableRow, INgTableChangeMessage, NgTableComponent } from '../shared/table/table.component';

@Component({
    selector: 'user-claims',
    templateUrl: 'app/usermanagement/user.claims.component.html',
    providers: [UserService],
    directives: [NgTableComponent]
})
export class UserClaimsComponent extends XCoreBaseComponent {

    public columns: INgTableColumn[] = [
        { name: "Description", title: "Claim Name", colWidth: 6 },
        { name: "Value", title: "Claim Value", colWidth: 6 }
    ];

    public tableConfig: INgTableConfig = {
        sorting: { columns: [] }
    }
    @Input() public User: IUserProfileViewModel;
    @ViewChild(NgTableComponent) TableComponent: NgTableComponent;

    constructor(protected xCoreServices: XCoreServices, private userService: UserService, 
        private builder: FormBuilder, private hubService: HubService)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserClaimsComponent");

    }
    
    public load(user: IUserProfileViewModel) {
        this.User = user;
        this.TableComponent.load({ rows: this.User.Claims, config: this.tableConfig });
    }
    
    public deleteClaim(event: any): void {

        var trace = this.classTrace("deleteClaim");
        trace(TraceMethodPosition.Entry);
        trace(TraceMethodPosition.Entry);

    }

    public addClaim(event: any): void {
        var trace = this.classTrace("addClaim");
        trace(TraceMethodPosition.Entry);
        // this.userService.saveUserProfile(this.userProfile).subscribe(up => {
        //     trace(TraceMethodPosition.Callback);
        //     this.userProfile = this.userService.toViewModel(up);
        //     this.xCoreServices.LoggingService.success("User successfully saved");
        //     this.xCoreServices.Router.navigate(["/UserList"]);
        // });
        
        trace(TraceMethodPosition.Exit);
    }


}

