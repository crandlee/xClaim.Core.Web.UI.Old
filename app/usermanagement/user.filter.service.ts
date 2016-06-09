import { FilterService } from '../shared/filtering/filter.service';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { IFilterDefinition, IComponentOptions, IFilterIdListMapping, IFilterSetupObject } from '../shared/filtering/filter.service';
import { Observable } from 'rxjs';
import { UserProfileService, IUserProfileReturn } from './userprofile.service';
import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable()
export class UserFilterService extends FilterService<IUsersToServerFilter, IUserProfileReturn> {

    constructor(public xCoreServices: XCoreServices, private userProfileService: UserProfileService) {
        super(xCoreServices)
        

        var trace = this.classTrace("constructor");
        trace(TraceMethodPosition.Entry);
        
        var setupObject: IFilterSetupObject<IUsersToServerFilter, IUserProfileReturn> = {
            componentOptions: this.initialComponentOptions,
            idListMappings: this.idListMappings,
            filterSummaryFunction: this.filterSummaryFunction.bind(this),
            initializeFilterFunction:this.initializeFilterFunction.bind(this),
            filterResetFunction: this.filterResetFunction.bind(this),
            applyFilterFunction: this.applyFilterFunction.bind(this)
        };
        this.setup(this.emptyFilterDefinition(), setupObject);

        trace(TraceMethodPosition.Exit);

    }

    private initialComponentOptions: IComponentOptions = {
        autoApplyFilter: false
    }

    public idListMappings: IFilterIdListMapping[] = [{ dataArrayName: "Status", idArrayName: "Statuses" }];

    protected emptyFilterDefinition(): IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>  {
        return {
            toClientFilter: { Rows: [], RowCount: 0, Statuses: this.userProfileService.defaultStatuses },
            toServerFilter: { UserName: null, Email: null, FullName: null, Status: "All"  }            
        };
    }

    protected filterSummaryFunction(filter: IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>): string  {

        var trace = this.classTrace("filterSummaryFunction");
        trace(TraceMethodPosition.Entry);

        var toServerFilter = filter.toServerFilter;
        var toClientFilter = filter.toClientFilter;

        var filterSummary = "";
        if (toServerFilter.UserName) filterSummary += "User Name contains '" + (toServerFilter.UserName || "") + "'";
        if (toServerFilter.FullName) filterSummary += this.addAnd(filterSummary) + "Full Name contains '" + (toServerFilter.FullName || "") + "'";
        if (toServerFilter.Email) filterSummary += this.addAnd(filterSummary) + "Email contains '" + (toServerFilter.Email || "") + "'";
        if (toServerFilter.Status && toServerFilter.Status !== "All") filterSummary += this.addAnd(filterSummary) + "Status = " + (toServerFilter.Status || "") + "";
        //filterSummary += this.aggregateDescription(this.selectedItems(toClientFilter.Status, toServerFilter.Statuses, "Value"), "Value", "Statuses are ", this.addAnd(filterSummary));

        trace(TraceMethodPosition.Exit);

        return filterSummary;
    } 

    protected initializeFilterFunction() : Observable<IUserProfileReturn> {
        
        var trace = this.classTrace("initializeFilterFunction");
        trace(TraceMethodPosition.Entry);
        var obs = this.userProfileService.getUsers(null, null, this.emptyFilterDefinition().toServerFilter);
        trace(TraceMethodPosition.Exit);
        return obs;

    }

    protected filterResetFunction (filter: IUsersToServerFilter) : Observable<IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>> {

        var trace = this.classTrace("filterResetFunction");
        trace(TraceMethodPosition.Entry);
        var obs = this.userProfileService.getUsers(null, null, this.emptyFilterDefinition().toServerFilter).map<IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>>(cf => {
            return { toClientFilter: cf, toServerFilter: this.emptyFilterDefinition().toServerFilter }
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    }

    protected applyFilterFunction (filter: IUsersToServerFilter) : Observable<IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>> {
        var trace = this.classTrace("applyFilterfunction");
        trace(TraceMethodPosition.Entry);
        var obs = this.userProfileService.getUsers(null, null, filter).map<IFilterDefinition<IUsersToServerFilter, IUserProfileReturn>>(cf => {
            return { toClientFilter: cf, toServerFilter: this.currentFilter.toServerFilter }
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    }


}


export interface IUsersToServerFilter {
    UserName: string;
    FullName: string;
    Email: string;
    Status: string;
}

