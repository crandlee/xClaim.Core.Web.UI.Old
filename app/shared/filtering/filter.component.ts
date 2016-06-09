import { Component, OnInit } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../service/core-services.service';
import _ from 'lodash';
import { FilterService, IComponentOptions, IFilterDefinition } from './filter.service';
import { XCoreBaseComponent } from '../component/base.component';
import { Subscription, Observable } from 'rxjs';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';


@Component({
    styleUrls: ['app/shared/filtering/filter.component.css'],
    templateUrl: 'app/shared/filtering/filter.component.html',
    providers: [FilterService],
    directives: [ACCORDION_DIRECTIVES]
})
export abstract class FilterComponent<TFilterToServer, TFilterToClient> extends XCoreBaseComponent  {

    private unregisterSetupCalled: Subscription;
    private mergedServiceOptions = false;
    private updateSubscription: Subscription;

    public filterVisible: boolean = false;
    public workingArea: IWorkingArea;
    public summaryText: string = "No filter set";
    public get toServerFilter(): TFilterToServer { return this.filterService.currentFilter.toServerFilter }

    public get componentOptions(): IComponentOptions { return this.filterService.componentOptions;}
    public set componentOptions(componentOptions: IComponentOptions) { this.filterService.componentOptions = _.merge(this.filterService.componentOptions, componentOptions);}

    constructor(protected xCoreServices: XCoreServices, private filterService: FilterService<TFilterToServer, TFilterToClient>) {
        super(xCoreServices);
        this.initializeTrace("FilterComponent");  
        var trace = this.classTrace("constructor");
        trace(TraceMethodPosition.Entry);
        this.watchForServiceSetupCalled();
        trace(TraceMethodPosition.Exit);
    }


    public fillWorkingArea() {
        //Currently Fills out Id variables for selected Id lists passed in the toServerFilter
        //Uses the idListMappings on the FilterService to determine which dataArray goes to a particular idArray
        this.workingArea = {};
        this.filterService.idListMappings.forEach((mapping) => {
            if (this.filterService.currentFilter.toServerFilter[mapping.idArrayName]) {
                this.filterService.currentFilter.toServerFilter[mapping.idArrayName].forEach((dataId: number) => {
                    this.workingArea[mapping.dataArrayName + dataId] = true;
                });
            }
        });
    }


    //Once filter service has been configured, execute functionality that relies on that
    private watchForServiceSetupCalled() {
        var trace = this.classTrace("watchForServiceSetupCalled");
        trace(TraceMethodPosition.Entry);
        this.unregisterSetupCalled = this.filterService.SetupCalledEvent.subscribe(called => {
            this.filterService.initializeFilter().subscribe((returnFilter: IFilterDefinition<TFilterToServer, TFilterToClient>) => {
                this.unregisterSetupCalled.unsubscribe();
                this.unregisterSetupCalled = null;
                this.fillWorkingArea();
                //Keep copy of initial summary text so we can make immediate text change on Reset (since we don't have to wait
                //for the server to come back to know what it's going to be).
                this.summaryText = this.filterService.getFilterSummary();
            });            
        });
        trace(TraceMethodPosition.Exit);
    }


    //Fire this when toServerFilter changes (ngModelChange)="toServerFilterChanged($event)" 
    public toServerFilterChanged(event?: any): void {
        if (this.filterService.componentOptions && this.filterService.componentOptions.autoApplyFilter) {
            this.applyFilter(event);
        }
    }
    

    private updateFilter(filterFunction: () => Observable<IFilterDefinition<TFilterToServer, TFilterToClient>>, timer: number): Observable<IFilterDefinition<TFilterToServer, TFilterToClient>> {
        var trace = this.classTrace("updateFilter");
        trace(TraceMethodPosition.Entry);              
        this.summaryText = this.filterService.getFilterSummary();
        var obs = filterFunction.bind(this.filterService)();
        if (timer > 0) 
            obs = obs.debounceTime(timer).map(i => i);
        else
            obs = obs.map(i => i);
        obs.subscribe((filter: IFilterDefinition<TFilterToServer, TFilterToClient>) => {
            this.fillWorkingArea();
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    }

    public applyFilter(event): void {        
        var trace = this.classTrace("applyFilter");
        trace(TraceMethodPosition.Entry);
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        var timeout: number = 0;
        if (this.filterService.componentOptions.autoApplyFilter) {
            timeout = (this.filterService.componentOptions && this.filterService.componentOptions.applyDelayOnAutoFilter) || 2000;            
        } else {
            this.filterVisible = false;
        }
        var obs = this.updateFilter(this.filterService.applyFilter, timeout);
        trace(TraceMethodPosition.Exit);
    }

    public resetFilter(event): Observable<IFilterDefinition<TFilterToServer, TFilterToClient>> {
        var trace = this.classTrace("resetFilter");
        trace(TraceMethodPosition.Entry);
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.filterVisible = false;
        var obs = this.updateFilter(this.filterService.resetFilter, 0);
        obs.subscribe(() => {
            this.summaryText = this.filterService.getFilterSummary();
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    }


    public setIdList(idType: string, id: any): void {
        var trace = this.classTrace("setIdList");
        trace(TraceMethodPosition.Entry);

        var mapping = this.filterService.idListMappings.filter((item) => item.dataArrayName === idType);
        if (!mapping || mapping.length === 0) return;
        if (this.workingArea[idType + id]) {
            this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].push(id);            
        } else {
            var index = this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].indexOf(id);
            if (index > -1) this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].splice(index, 1);
        }
        this.toServerFilterChanged();
        trace(TraceMethodPosition.Exit);
    }

    //*****Some helper functions for building filter summary descriptions******
    protected static aggregateDescription(items, nameProperty, header, anded) {
        var aggregate = "";
        if (items.length > 0) {
            items.forEach(function (item) { aggregate += (aggregate === "" ? "" : " OR ") + item[nameProperty] });
            return anded + header + "(" + aggregate + ")";
        }
        return "";
    }

    protected static selectedItems(arrList, idList, idProperty) {
        idProperty = idProperty || "Id";
        return (arrList && arrList.filter(function(item) { return item && idList && (idList.indexOf(item[idProperty]) > -1); })) || [];
    }
    protected static addAnd(summary) {
        return (summary === "") ? "" : " AND ";
    }
    //*********************************************************************

}


export interface IWorkingArea {
    [key: string]: boolean;
}

