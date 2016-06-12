import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { XCoreServiceBase, XCoreServices, TraceMethodPosition, INameValue } from '../shared/service/core-services.service';
import { HubService } from '../shared/hub/hub.service';
import { IServiceOptions, IDataService, ICollectionViewModel, IEntity } from '../shared/service/base.service';
import _ from 'lodash';
import { IUsersToServerFilter } from './user.filter.service';
import { IFilterDefinition } from '../shared/filtering/filter.service';


@Injectable()
export class ClaimDefinitionsService extends XCoreServiceBase implements IDataService<IClaimDefinitionModel, IClaimDefinitionViewModel, IClaimDefinitionsToServerFilter, IClaimDefinitionsToClientFilter> {

    constructor(xCoreServices: XCoreServices, protected hubService: HubService) {
        super(xCoreServices);
        
         this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UserService");
    }

    private endpointKey: string = 'xClaim.Core.Web.Api.Security';

    public get(skip?: number, take?: number, toServerFilter?: IClaimDefinitionsToServerFilter): Observable<IClaimDefinitionsToClientFilter> {
        var trace = this.classTrace("get");
        trace(TraceMethodPosition.Entry);
        
        if (!skip) skip = 0;
        if (!take) take = this.xCoreServices.AppSettings.DefaultPageSize;

        var url = `claimdefinitions?skip=${skip}&take=${take}`;

        var obs = this.getObjectData<IClaimDefinitionModel[]>(this.getOptions(this.hubService, this.endpointKey, "There was an error retrieving the claim definitions"), url)
            .map(cds =>  {
                var vm = _.map(cds, cd => this.toViewModel(cd));
                return { Rows: vm }; 
            });
        trace(TraceMethodPosition.Exit);
        return obs;

    }

    public getNonCoreDefinitions(): Observable<IClaimDefinitionsToClientFilter> {
        var trace = this.classTrace("getNonCoreDefinitions");
        trace(TraceMethodPosition.Entry);
        
        var obs = this.get(null, null, {}).map(cd => {
            cd.Rows = _.filter(cd.Rows, r => ['given_name', 'email', 'sub', 'name'].indexOf(r.Name) === -1); 
            return cd; 
        });
        trace(TraceMethodPosition.Exit);
        return obs;

    }

    public toModel(vm: IClaimDefinitionViewModel): IClaimDefinitionModel {
        return {
            Id: vm.Id,
            Name: vm.Name,            
            Description: vm.Description                    
        };
    }

    public toViewModel(model: IClaimDefinitionModel): IClaimDefinitionViewModel {
        return {
            Id: model.Id,
            Name: model.Name,            
            Description: model.Description                    
        };
    }

}

export interface IClaimDefinitionModel extends IEntity {
    Name: string;
    Description: string;
}

export interface IClaimDefinitionViewModel extends IEntity {
    Name: string;    
    Description: string;
}

export interface IClaimDefinitionsToServerFilter {

}

export interface IClaimDefinitionsToClientFilter {
    Rows: IClaimDefinitionViewModel[]
}