import { Injectable } from '@angular/core';
import { XCoreServiceBase, XCoreServices, TraceMethodPosition } from '../service/core-services.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export abstract class FilterService<TFilterToServer, TFilterToClient> extends XCoreServiceBase {

    public setupObject: IFilterSetupObject<TFilterToServer, TFilterToClient>;

    public currentFilter: IFilterDefinition<TFilterToServer, TFilterToClient>;
    public componentOptions: IComponentOptions = { autoApplyFilter: false, applyDelayOnAutoFilter: 2000, otherComponentOptions: {} };
    public setupCalled: boolean = false;
    public idListMappings: IFilterIdListMapping[];

    private SetupCalledSource = new Subject<boolean>();    
    public SetupCalledEvent = this.SetupCalledSource.asObservable().share();
    private InitializeCalledSource = new Subject<IFilterDefinition<TFilterToServer, TFilterToClient>>();    
    public InitializeCalledEvent = this.InitializeCalledSource.asObservable().share();

    private FilterUpdatedSource = new Subject<IFilterDefinition<TFilterToServer, TFilterToClient>>();
    public FilterUpdatedEvent = this.FilterUpdatedSource.asObservable().share();

    constructor(protected xCoreServices: XCoreServices) {
        super(xCoreServices);
                
        this.initializeTrace("FilterService");               
        var trace = this.classTrace("constructor");        
        trace(TraceMethodPosition.Entry);
        
        trace(TraceMethodPosition.Exit);
        
    }

    //This gets called by the domain component with all the functions and config data necessary to do its job
    //filterDefinition => the current toServerFilter definition

    public setup(filterDefinition: IFilterDefinition<TFilterToServer, TFilterToClient>, setupObject: IFilterSetupObject<TFilterToServer,TFilterToClient>): void {
        var trace = this.classTrace("setup");        
        trace(TraceMethodPosition.Entry);
        this.setupObject = setupObject;
        this.currentFilter = filterDefinition;
        this.componentOptions = setupObject.componentOptions;
        this.idListMappings = setupObject.idListMappings || [];
        this.SetupCalledSource.next(true);
        this.setupCalled = true;
        trace(TraceMethodPosition.Exit);
    };

    public initializeFilter(): Observable<IFilterDefinition<TFilterToServer, TFilterToClient>> {
        var trace = this.classTrace("initializeFilter");        
        trace(TraceMethodPosition.Entry);        
        //This should retrieve both the client and server filter and set them on the current filter
        this.checkRequiredConfiguration();
        var obs = this.setupObject.initializeFilterFunction().share().map<IFilterDefinition<TFilterToServer, TFilterToClient>>(cf => {
            return { toServerFilter: this.currentFilter.toServerFilter, toClientFilter: cf}
        }); 
        if (!this.setupObject.initializeFilterFunction) throw "No pre-display filter behavior was defined";
        obs.subscribe((returnFilter: IFilterDefinition<TFilterToServer, TFilterToClient>) => {
            trace(TraceMethodPosition.Callback);
            if (!returnFilter) throw "Must return a valid filter object from initializeFilterFunction";
            this.currentFilter = returnFilter;
            this.InitializeCalledSource.next(returnFilter);
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    };

    public applyFilter(): Observable<IFilterDefinition<TFilterToServer, TFilterToClient>> {
        var trace = this.classTrace("applyFilter");        
        trace(TraceMethodPosition.Entry);        
        //This function only returns the client filter.
        this.checkRequiredConfiguration();
        if (!this.setupObject.applyFilterFunction) throw "No apply filter behavior was defined";
        if (!this.currentFilter || !this.currentFilter.toServerFilter) throw "No filter available to send to server";
        var obs = this.setupObject.applyFilterFunction(this.currentFilter.toServerFilter).share();
        
        obs.subscribe((returnFilter: IFilterDefinition<TFilterToServer, TFilterToClient>) => {
            trace(TraceMethodPosition.Callback);
            if (!returnFilter) throw "Must return a valid filter object from applyFilterFunction";
            this.currentFilter = returnFilter;
            this.FilterUpdatedSource.next(returnFilter);            
        });
        
        trace(TraceMethodPosition.Exit);        
        return obs;
    };

    private checkRequiredConfiguration(): FilterService<TFilterToServer, TFilterToClient> {
        if (!this.setupObject) throw "No filter setup has been configured";
        if (!this.currentFilter) throw "No filter definition has been provided";
        return this;
    }

    public getFilterSummary() {
        var trace = this.classTrace("getFilterSummary");        
        trace(TraceMethodPosition.Entry);                
        this.checkRequiredConfiguration();
        if (!this.setupObject.filterSummaryFunction) throw "No filter summary behavior was defined";
        var ret = this.setupObject.filterSummaryFunction(this.currentFilter) || "No filter set";
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    public resetFilter(): Observable<IFilterDefinition<TFilterToServer, TFilterToClient>> {
        var trace = this.classTrace("resetFilter");        
        trace(TraceMethodPosition.Entry);                
        this.checkRequiredConfiguration();
        if (!this.setupObject.filterResetFunction) throw "No filter reset behavior was defined";
        var obs = this.setupObject.filterResetFunction(this.currentFilter.toServerFilter);        
        obs.subscribe((returnFilter: IFilterDefinition<TFilterToServer, TFilterToClient>) => {
            trace(TraceMethodPosition.Callback);
            if (!returnFilter) throw "Must return a valid filter object from resetFilterFunction";
            this.currentFilter = returnFilter;
            this.FilterUpdatedSource.next(returnFilter);
        });
        trace(TraceMethodPosition.Exit);
        return obs;
    }

    //*****Some helper functions for building filter summary descriptions******
    protected aggregateDescription(items, nameProperty, header, anded) {
        var aggregate = "";
        if (items.length > 0) {
            items.forEach(function (item) { aggregate += (aggregate === "" ? "" : " OR ") + item[nameProperty] });
            return anded + header + "(" + aggregate + ")";
        }
        return "";
    }

    protected selectedItems(arrList, idList, idProperty) {
        idProperty = idProperty || "Id";
        return (arrList && arrList.filter(function(item) { return item && idList && (idList.indexOf(item[idProperty]) > -1); })) || [];
    }
    protected addAnd(summary) {
        return (summary === "") ? "" : " AND ";
    }
    //*********************************************************************

    protected abstract emptyFilterDefinition(): IFilterDefinition<TFilterToServer, TFilterToClient>;
    protected abstract filterSummaryFunction(filter: IFilterDefinition<TFilterToServer, TFilterToClient>): string;
    protected abstract initializeFilterFunction() : Observable<TFilterToClient>;
    protected abstract filterResetFunction (filter: TFilterToServer) : Observable<IFilterDefinition<TFilterToServer, TFilterToClient>>;
    protected abstract applyFilterFunction (filter: TFilterToServer) : Observable<IFilterDefinition<TFilterToServer, TFilterToClient>>;
    
} 

export interface IFilterIdListMapping {
    dataArrayName: string;
    idArrayName: string;    
}

export interface IFilterSetupObject<TFilterToServer, TFilterToClient> {
    componentOptions: IComponentOptions;
    idListMappings: IFilterIdListMapping[];
    initializeFilterFunction: (() =>  Observable<TFilterToClient>);
    filterSummaryFunction: ((filter: IFilterDefinition<TFilterToServer, TFilterToClient>) => string);
    filterResetFunction: ((filter: TFilterToServer) => Observable<IFilterDefinition<TFilterToServer, TFilterToClient>>);
    applyFilterFunction: ((filter: TFilterToServer) => Observable<IFilterDefinition<TFilterToServer, TFilterToClient>>);
}


export interface IFilterDefinition<TFilterToServer, TFilterToClient> {
    toClientFilter: TFilterToClient;
    toServerFilter: TFilterToServer;
}

export interface IComponentOptions {
    autoApplyFilter?: boolean;
    applyDelayOnAutoFilter?: number;
    otherComponentOptions?: Object;
}