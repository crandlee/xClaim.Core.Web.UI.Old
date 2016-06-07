import { Component, OnInit } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { UserProfileService, IUserProfile, IUserProfileViewModel } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';
import { HubService } from '../shared/hub/hub.service';
import { NG_TABLE_DIRECTIVES }  from 'ng2-table/ng2-table';
import _ from 'lodash';

@Component({
    styleUrls: ['app/usermanagement/usermanagement.component.css'],
    templateUrl: 'app/usermanagement/usermanagement.component.html',
    providers: [UserProfileService],
    directives: [NG_TABLE_DIRECTIVES]
})
export class UserManagementComponent extends XCoreBaseComponent implements OnInit {

    public users: IUserProfileViewModel[];
    public active: boolean = false;

    public rows: Array<any> = [];
    public columns: Array<any> = [
        { title: "Name", name: "Name", colWidth: 3 },
        { title: "Full Name", name: "GivenName", colWidth: 3 },
        { title: "EMail Address", name: "EmailAddress", colWidth: 3 },
        { title: "Enabled", name: "Enabled", colWidth: 1, transform: (val: boolean) => { return val ? "Yes": "No"; } },
        { title: "Edit", name: "Edit", colWidth: 1, editRow: true },        
        { title: "Delete", name: "Delete", colWidth: 1, deleteRow: true, deleteMessage: 'Do you want to delete this user?' }
    ];
    
    
    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;
    public config: any = {
        paging: false,
        sorting: { columns: this.columns },
        filtering: { filterString: '', columnName: 'Name' }
    }

    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService, private hubService: HubService) {
        super(xCoreServices);

        this.initializeTrace("UserManagementComponent");
    }

    public addNew(event) {
        event.preventDefault();
        var trace = this.classTrace("addNew");
        trace(TraceMethodPosition.Entry);
        this.xCoreServices.Router.navigate(['/NewUser'])
        trace(TraceMethodPosition.Exit);            
    }
    
    private getInitialData(userProfileService: UserProfileService): void {

        var trace = this.classTrace("getInitialData");
        trace(TraceMethodPosition.Entry);

        userProfileService.getUsers().subscribe(up => {
            trace(TraceMethodPosition.CallbackStart);
            this.users = _.map(up, u => this.userProfileService.userProfileToViewModel(u));
            this.length = this.users.length;
            this.active = true;
            this.onChangeTable(this.users, this.config);
            trace(TraceMethodPosition.CallbackEnd);
        });

        trace(TraceMethodPosition.Exit);
    }

    ngOnInit() {
        super.NotifyLoaded("UserManagement");
        var trace = this.classTrace("ngOnInit");
        trace(TraceMethodPosition.Entry);
        this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userProfileService));
        trace(TraceMethodPosition.Entry);
    }

    public changeFilter(data: any, config: any): any {
        if (!config.filtering) {
            return data;
        }
        let filteredData: Array<any> = data.filter((item: any) => {
            if (!this.config.filtering.filterString) return true;
            var testItem = item[config.filtering.columnName];
            return item[config.filtering.columnName].indexOf(this.config.filtering.filterString) > -1;            
        });
        return filteredData;
    }

        
    // public changePage(page: any, data: Array<any>): Array<any> {

    //     var trace = this.classTrace("changePage");
    //     trace(TraceMethodPosition.Entry);

    //     let start = (page.page - 1) * page.itemsPerPage;
    //     let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    //     var ret = data.slice(start, end);
    //     trace(TraceMethodPosition.Exit);
    //     return ret;
    // }

    public changeSort(data: any, config: any): any {

        var trace = this.classTrace("changeSort");
        trace(TraceMethodPosition.Entry);

        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '') {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting
        var ret = data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
        
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    public editUser(row: any): void {
        var trace = this.classTrace("editUser");
        trace(TraceMethodPosition.Entry);
        if (!row || !row.Id) throw Error("Invalid row");
        var url = `/User/${row.Id}`;
        this.xCoreServices.Router.navigate([url]);
        trace(TraceMethodPosition.Exit);            

    }
    
    public deleteUser(row: any): void {
        var trace = this.classTrace("deleteUser");
        trace(TraceMethodPosition.Entry);
        if (!row || !row.Id) throw Error("Invalid row");
        this.userProfileService.deleteUser(row.Id).subscribe(d => {
           if (d) {
             this.xCoreServices.LoggingService.success("Used deleted successfully");
             _.remove(this.users, u => u.Id === row.Id);  
             this.onChangeTable(this.users, this.config);
           } 
        });
        trace(TraceMethodPosition.Exit);                        
    }
    
    public onChangeTable(data: any, config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): void {
        
        var trace = this.classTrace("onChangeTable");
        trace(TraceMethodPosition.Entry);

        if (config && config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        if (config && config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
        let filteredData = this.changeFilter(data, this.config);
        let sortedData = this.changeSort(filteredData, this.config);
        this.rows = sortedData;
        this.length = sortedData.length;
        
        trace(TraceMethodPosition.Exit);
        
    }
}