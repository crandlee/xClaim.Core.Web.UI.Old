import { Component, Input, ViewChild } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserService, IUserProfile, IUserProfileViewModel } from '../usermanagement/user.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IClaimDefinitionViewModel, ClaimDefinitionsService } from './claimDefinitions.service';

import { INgTableColumn, INgTableConfig, INgTableRow, INgTableChangeMessage, NgTableComponent } from '../shared/table/table.component';
import { OrderByPipe } from '../shared/pipe/orderby.pipe';

@Component({
    selector: 'user-claims',
    styleUrls: ['app/usermanagement/user.claims.component.css'],
    templateUrl: 'app/usermanagement/user.claims.component.html',
    providers: [UserService, ClaimDefinitionsService],
    directives: [NgTableComponent],
    pipes: [OrderByPipe]
})
export class UserClaimsComponent extends XCoreBaseComponent {

    public columns: INgTableColumn[] = [
        { name: "Description", title: "Claim Name", colWidth: 5 },
        { name: "Value", title: "Claim Value", colWidth: 6 },
        { name: "Delete", title: "", deleteRow: true, deleteMessage: "Delete this claim from the user?", colWidth: 1}
    ];

    public tableConfig: INgTableConfig = {
        sorting: { columns: [] }
    }
    public claimDefinitions: IClaimDefinitionViewModel[] = [];
    public ClaimType: string;
    public ClaimValue: string;

    @Input() public User: IUserProfileViewModel;
    @ViewChild(NgTableComponent) TableComponent: NgTableComponent;


    constructor(protected xCoreServices: XCoreServices, private userService: UserService, 
        private builder: FormBuilder, private hubService: HubService, private claimDefinitionsService: ClaimDefinitionsService)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserClaimsComponent");

    }
    
    public load(user: IUserProfileViewModel) {
        this.User = user;
        this.TableComponent.load({ rows: this.User.Claims, config: this.tableConfig });
        this.claimDefinitionsService.getNonCoreDefinitions().subscribe(cd => {
            this.claimDefinitions = cd.Rows;
        });

    }
    
    public deleteClaim(event: any): void {

        var trace = this.classTrace("deleteClaim");
        trace(TraceMethodPosition.Entry);
        trace(TraceMethodPosition.Entry);

    }

    public addClaim(event: any): void {
        var trace = this.classTrace("addClaim");
        trace(TraceMethodPosition.Entry);
        console.log(`${this.ClaimType}|${this.ClaimValue}`);
        // this.userService.saveUserProfile(this.userProfile).subscribe(up => {
        //     trace(TraceMethodPosition.Callback);
        //     this.userProfile = this.userService.toViewModel(up);
        //     this.xCoreServices.LoggingService.success("User successfully saved");
        //     this.xCoreServices.Router.navigate(["/UserList"]);
        // });
        
        trace(TraceMethodPosition.Exit);
    }


}

