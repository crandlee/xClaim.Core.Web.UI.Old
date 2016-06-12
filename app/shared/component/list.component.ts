import { Component, EventEmitter } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../service/core-services.service';
import { XCoreBaseComponent } from './base.component';
import { INgTableColumn, INgTableConfig, INgTableRow, INgTableChangeMessage } from '../table/table.component';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { IDataService, ICollectionViewModel } from '../service/base.service';
import { Observable } from 'rxjs';
import { IFilterDefinition, IFilterService } from '../filtering/filter.service';
import { HubService } from '../hub/hub.service';

export abstract class XCoreListComponent<TModel, TViewModel extends INgTableRow, TFilterToServer, TFilterToClient extends ICollectionViewModel<TViewModel>> extends XCoreBaseComponent  {
    
    protected serviceSubscription: Subscription = null;
    public dataViewModel: ICollectionViewModel<TViewModel> = { RowCount:0, Rows:[], Active: false };

    public columns: INgTableColumn[] = [];

    public tableChangeEmitter: EventEmitter<INgTableChangeMessage> = new EventEmitter<INgTableChangeMessage>();
    public tableConfig: INgTableConfig = {
        sorting: { columns: [] }
    }
    private filterService: IFilterService<TFilterToServer, TFilterToClient>;
    private dataService: IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient>;

    constructor(protected xCoreServices: XCoreServices, protected hubService: HubService) {
        super(xCoreServices);
        this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("XCoreListComponent");

        //Unsubscribe from the infinite stream when when change routes
        this.xCoreServices.Router.changes.subscribe(val => {            
            if (this.serviceSubscription) {
                this.serviceSubscription.unsubscribe();
                this.serviceSubscription = null;
            }
        });

     }

    protected initializeWith(columns: INgTableColumn[], 
        filterService: IFilterService<TFilterToServer, TFilterToClient>, 
        dataService: IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient>) {
        
        this.columns = columns;
        this.tableConfig = { sorting: {columns: columns }};
        this.filterService = filterService;
        this.dataService = dataService;
    }

    protected performStartup(currentViewModel: ICollectionViewModel<TViewModel>,
        tableChangeEmitter: EventEmitter<INgTableChangeMessage>, 
        tableConfig: INgTableConfig,
        filterService: IFilterService<TFilterToServer, TFilterToClient>, 
        service: IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient>): void {

        var trace = this.classTrace("performStartup");
        trace(TraceMethodPosition.Entry);
        currentViewModel.Active = true;
        filterService.initializeFilter().subscribe(filter => {
            trace(TraceMethodPosition.Callback);
            currentViewModel.Rows = [];
            this.loadFirstData(currentViewModel, tableChangeEmitter, tableConfig, filter, service);
            this.subscribeToFilterChanged(currentViewModel, tableChangeEmitter, tableConfig, filterService, service);
        });

        trace(TraceMethodPosition.Exit);
    }

    private subscribeToFilterChanged(currentViewModel: ICollectionViewModel<TViewModel>,
        tableChangeEmitter: EventEmitter<INgTableChangeMessage>, 
        tableConfig: INgTableConfig,
        filterService: IFilterService<TFilterToServer, TFilterToClient>,         
        service: IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient>) {

        var trace = this.classTrace("subscribeToFilterChanged");
        trace(TraceMethodPosition.Entry);
        filterService.FilterUpdatedEvent.subscribe(filter => {
            trace(TraceMethodPosition.Callback);
            currentViewModel.Rows = [];
            this.loadFirstData(currentViewModel, tableChangeEmitter, tableConfig, filter, service);
        });
        trace(TraceMethodPosition.Exit);
    }    

    private loadFirstData(currentViewModel: ICollectionViewModel<TViewModel>,
        tableChangeEmitter: EventEmitter<INgTableChangeMessage>,      
        tableConfig: INgTableConfig,
        filter: IFilterDefinition<TFilterToServer, TFilterToClient>, 
        service: IDataService<TModel, TViewModel, TFilterToServer, TFilterToClient>): void {

        var trace = this.classTrace("loadFirstData");
        trace(TraceMethodPosition.Entry);

        currentViewModel.Rows = currentViewModel.Rows.concat(filter.toClientFilter.Rows);
        currentViewModel.RowCount = filter.toClientFilter.RowCount;
        var msg: INgTableChangeMessage = { rows: currentViewModel.Rows, config: tableConfig };
        tableChangeEmitter.emit(msg);

        //Subscribe to infinite scroll
        if (this.serviceSubscription) this.serviceSubscription.unsubscribe();      
        this.serviceSubscription = this.xCoreServices.ScrollService.ScrollNearBottomEvent.subscribe(si => {
            if (currentViewModel.Rows.length >= currentViewModel.RowCount) return;
            service.get(currentViewModel.Rows.length, this.xCoreServices.AppSettings.DefaultPageSize, filter.toServerFilter).subscribe(data => {
                currentViewModel.Rows = currentViewModel.Rows.concat(data.Rows);
                currentViewModel.RowCount = data.RowCount;                
                tableChangeEmitter.emit({ rows: currentViewModel.Rows, config: tableConfig });
                this.xCoreServices.ScrollService.checkNearBottom();
            });                                     
        });
        this.xCoreServices.ScrollService.checkNearBottom();
        trace(TraceMethodPosition.Exit);
    }


    ngOnInit() {

        var trace = this.classTrace("ngOnInit");
        trace(TraceMethodPosition.Entry);

        this.hubService.callbackWhenLoaded(this.performStartup.bind(this,
            this.dataViewModel,
            this.tableChangeEmitter,
            this.tableConfig,  
            this.filterService, 
            this.dataService));

        trace(TraceMethodPosition.Exit);
    }

}