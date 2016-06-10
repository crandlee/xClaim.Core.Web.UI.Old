import { Component, EventEmitter } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import { NgTableComponent  }  from '../shared/table/table.component';
import { INgTableColumn, INgTableConfig, INgTableRow, INgTableChangeMessage } from '../shared/table/table.component';
import _ from 'lodash';
import { Subscription } from 'rxjs';

import { UserProfileService, IUserProfile, IUserProfileViewModel, IUserProfileReturn } from './userprofile.service';
import { UserFilterComponent } from './user.filter.component';
import { UserFilterService, IUsersToServerFilter } from './user.filter.service';
import { IFilterDefinition } from '../shared/filtering/filter.service';
import { Observable } from 'rxjs';


@Component({
    styleUrls: ['app/usermanagement/usermanagement.component.css'],
    templateUrl: 'app/usermanagement/usermanagement.component.html',
    providers: [UserProfileService, UserFilterService],
    directives: [NgTableComponent, UserFilterComponent]
})
export class UserManagementComponent extends XCoreBaseComponent {

    public users: IUserProfileViewModel[];
    public active: boolean = false;
    public totalRows: number = 0;
    private userServiceSubscription: Subscription = null;

    public changeTable: EventEmitter<INgTableChangeMessage> = new EventEmitter<INgTableChangeMessage>();
    public rows: INgTableRow[] = [];

    public columns: INgTableColumn[] = [
        { title: "User Name", name: "Name", colWidth: 3, sort: "asc" },
        { title: "Full Name", name: "GivenName", colWidth: 6 },
        { title: "Enabled", name: "Enabled", colWidth: 1, transform: (val: boolean) => { return val ? "Yes": "No"; } },
        { title: "Edit", name: "Edit", colWidth: 1, editRow: true },        
        { title: "Delete", name: "Delete", colWidth: 1, deleteRow: true, deleteMessage: 'Do you want to delete this user?' }
    ];
        
    public config: INgTableConfig = {
        sorting: { columns: this.columns }
    }

    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService, private userFilterService: UserFilterService, private hubService: HubService) {
        super(xCoreServices);

        this.initializeTrace("UserManagementComponent");

        //Unsubscribe from the infinite stream when when change routes
        this.xCoreServices.Router.changes.subscribe(val => {            
            if (this.userServiceSubscription) {
                this.userServiceSubscription.unsubscribe();
                this.userServiceSubscription = null;
            }
        });

    }

    public addNew(event): void {
        event.preventDefault();
        var trace = this.classTrace("addNew");
        trace(TraceMethodPosition.Entry);
        this.xCoreServices.Router.navigate(['/NewUser'])
        trace(TraceMethodPosition.Exit);            
    }
    
    private performStartup(userFilterService: UserFilterService, userProfileService: UserProfileService): void {

        var trace = this.classTrace("performStartup");
        trace(TraceMethodPosition.Entry);
        this.active = true;
        userFilterService.initializeFilter().subscribe(filter => {
            trace(TraceMethodPosition.Callback);
            this.loadFirstData(filter, userProfileService, userFilterService);
            this.subscribeToFilterChanged(userFilterService, userProfileService);
        });

        trace(TraceMethodPosition.Exit);
    }

    private subscribeToFilterChanged(userFilterService: UserFilterService, userProfileService: UserProfileService) {
        var trace = this.classTrace("subscribeToFilterChanged");
        trace(TraceMethodPosition.Entry);
        userFilterService.FilterUpdatedEvent.subscribe(filter => {
            trace(TraceMethodPosition.Callback);
            this.loadFirstData(filter, userProfileService, userFilterService);
        });
        trace(TraceMethodPosition.Exit);
    }    

    private loadFirstData(filter: IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>, userProfileService: UserProfileService, userFilterService: UserFilterService): void {
        var trace = this.classTrace("loadData");
        trace(TraceMethodPosition.Entry);
        this.users = _.map(filter.toClientFilter.Rows, u => userProfileService.userProfileToViewModel(u));
        this.totalRows = filter.toClientFilter.RowCount;
        this.changeTable.emit({ rows: this.users, config: this.config });  
        if (this.userServiceSubscription) this.userServiceSubscription.unsubscribe();      
        this.userServiceSubscription = this.xCoreServices.ScrollService.ScrollNearBottomEvent.subscribe(si => {
            if (this.users.length >= this.totalRows) return;
            userProfileService.getUsers(this.users.length, this.xCoreServices.AppSettings.DefaultPageSize, filter.toServerFilter).subscribe(up => {
                this.users = this.users.concat(_.map(up.Rows, u => userProfileService.userProfileToViewModel(u)));
                this.totalRows = up.RowCount;
                this.changeTable.emit({ rows: this.users, config: this.config });
                this.xCoreServices.ScrollService.checkNearBottom();
            });                                     
        });
        this.xCoreServices.ScrollService.checkNearBottom();
        trace(TraceMethodPosition.CallbackEnd);

    }


    ngOnInit() {
        super.NotifyLoaded("UserManagement")
        this.hubService.callbackWhenLoaded(this.performStartup.bind(this, this.userFilterService, this.userProfileService));
    }


    public editUser(row: INgTableRow): void {
        var trace = this.classTrace("editUser");
        trace(TraceMethodPosition.Entry);
        if (!row || !row.Id) throw Error("Invalid row");
        var url = `/User/${row.Id}`;
        this.xCoreServices.Router.navigate([url]);
        trace(TraceMethodPosition.Exit);            

    }
    
    public deleteUser(row: INgTableRow): void {
        var trace = this.classTrace("deleteUser");
        trace(TraceMethodPosition.Entry);
        if (!row || !row.Id) throw Error("Invalid row");
        this.userProfileService.deleteUser(row.Id).subscribe(d => {
           if (d) {
             this.xCoreServices.LoggingService.success("Used deleted successfully");
             _.remove(this.users, u => u.Id === row.Id);  
             this.changeTable.emit({ rows: this.users, config: this.config });
           } 
        });
        trace(TraceMethodPosition.Exit);                        
    }
    
    // public onChangeTable(data: IUserProfileViewModel[], config: INgTableConfig): void {
        
    //     var trace = this.classTrace("onChangeTable");
    //     trace(TraceMethodPosition.Entry);

    //     if (config && config.sorting) {
    //         Object.assign(this.config.sorting, config.sorting);
    //     }
    //     let sortedData = this.changeSort(data, this.config);
    //     this.rows = sortedData;
        
    //     trace(TraceMethodPosition.Exit);
        
    // }
}