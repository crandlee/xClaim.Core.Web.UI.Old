import { Component, Input, ViewChild } from '@angular/core';
import { Validators, ControlGroup, Control, FormBuilder } from '@angular/common';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserService, IUserProfile, IUserProfileViewModel, IUserClaimViewModel } from '../usermanagement/user.service';
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
        { name: "Description", title: "Claim Name", colWidth: 5, sort: "asc" },
        { name: "Value", title: "Claim Value", colWidth: 6 },
        { name: "Delete", title: "", deleteRow: true, deleteMessage: "Delete this claim from the user?", colWidth: 1}
    ];

    public tableConfig: INgTableConfig = {
        sorting: { columns: this.columns  }
    }
    public claimDefinitions: IClaimDefinitionViewModel[] = [];
    public ClaimType: string;
    public ClaimValue: string;

    @Input() public User: IUserProfileViewModel;
    @ViewChild(NgTableComponent) TableComponent: NgTableComponent;

    private get tableLoadFunction(): () => INgTableChangeMessage {
        return () => {
            return { rows: _.filter(this.User.Claims, r => ['given_name', 'email', 'sub', 'name'].indexOf(r.Name) === -1), config: this.tableConfig }            
        };
    }
    constructor(protected xCoreServices: XCoreServices, private userService: UserService, 
        private builder: FormBuilder, private hubService: HubService, private claimDefinitionsService: ClaimDefinitionsService)     
    {  
        super(xCoreServices);
        
        this.initializeTrace("UserClaimsComponent");

    }
    
    public load(user: IUserProfileViewModel) {
        this.User = user;
        this.TableComponent.load(this.tableLoadFunction());
        this.claimDefinitionsService.getNonCoreDefinitions().subscribe(cd => {
            this.claimDefinitions = cd.Rows;
        });

    }
    
    public deleteClaim(row: IUserClaimViewModel): void {

        var trace = this.classTrace("deleteClaim");
        trace(TraceMethodPosition.Entry);

        this.userService.deleteUserClaim(row.Id).subscribe(d => {
           if (d) {
             this.xCoreServices.LoggingService.success(`User claim ${row.Description} deleted successfully`);
             _.remove(this.User.Claims, cd =>  cd.Id === row.Id && cd.Value.toLowerCase() === row.Value.toLowerCase());  
             this.TableComponent.load(this.tableLoadFunction());
           } 
        });
        trace(TraceMethodPosition.Exit);

    }

    public addClaim(event: any): void {
        var trace = this.classTrace("addClaim");
        trace(TraceMethodPosition.Entry);
        var claimLookup: IClaimDefinitionViewModel = _.find(this.claimDefinitions, cd => cd.Id === this.ClaimType);
        var existingUserClaim: IUserClaimViewModel = _.find(this.User.Claims, cd => cd.DefinitionId === this.ClaimType && cd.Value.toLowerCase() === this.ClaimValue.toLowerCase());
        if (existingUserClaim) this.xCoreServices.LoggingService.warn("This claim/value already exist on the user");
        if (claimLookup && !existingUserClaim) {
            var vm = <IUserClaimViewModel>{ Id: "", Value: this.ClaimValue, DefinitionId: claimLookup.Id, Description: claimLookup.Description, Name: claimLookup.Name, UserId: this.User.Id };            
            this.userService.saveUserClaim(vm).subscribe(vm => {
                this.xCoreServices.LoggingService.success(`Successfully added new ${vm.Description} claim `);
                this.User.Claims.push(vm);
                this.TableComponent.load(this.tableLoadFunction());
                this.ClaimType = null;
                this.ClaimValue = null;
            });
        }    
        trace(TraceMethodPosition.Exit);
    }


}

