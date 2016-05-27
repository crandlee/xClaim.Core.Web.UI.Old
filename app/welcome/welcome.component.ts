import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
import { HubService, IHubServiceData, IHubServiceMenuItem } from '../shared/hub/hub.service';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap';

import _ from 'lodash';

@Component({
    templateUrl: 'app/welcome/welcome.component.html',
    directives: [ACCORDION_DIRECTIVES],
    providers: [],
    styleUrls: ['app/welcome/welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    public hubData: IHubServiceData =  { ApiEndpoints: [], MenuItems: [], Scopes:"" };;
    public menuItems: IMainMenuItem[] = [];
    public menuItemIdGenerator: number = 0;
    
    constructor(private xCoreServices: XCoreServices, private hubService: HubService) {
        //Set up events
        this.hubService.HubDataCompletedEvent.subscribe(hd => {
            this.hubData = hd;
            this.hubData.MenuItems = _.chain(this.hubData.MenuItems)
                .sortBy(mi => mi.Description)
                .value();
            this.menuItems = this.flattenMenuItems();
            
        });
    }

    public visibleMenuItems() {
        return _.chain(this.menuItems).filter(mi => mi.IsDisplayed).value();
    }
    
    public navigateToRoute(route: string): void {
        if (!route) return;
        this.xCoreServices.Router.navigate([route]);        
    }

    private flattenMenuItems(): IMainMenuItem[]  {
        var ret: IMainMenuItem[] = [];
        var level: number = 1;
        var parents: number[] = [];
        this.menuItemIdGenerator = 0;
        this.getMenuItemChildren(level, null, parents, this.hubData.MenuItems, ret);
        return ret;
    }

    public reactToItemClick(id: number): void {
        var item = _.find(this.menuItems, mi => mi.Id == id);
        if (!item) this.xCoreServices.LoggingService.warn(`Unable to select element with Id ${id}`);
        if (item.MenuItem.SubMenus.length > 0) {
            this.setMenuItemState(item, !item.IsOpen);
        } else {
            this.navigateToRoute(item.MenuItem.Route);
        }
    }
    
    private setMenuItemState(item: IMainMenuItem, open: boolean) {
        item.IsOpen = open;        
        _.each(this.menuItems, mi => {
           //If an item has this item in the parent chain then check to see if its immediate parent is open
           //If it is then display it.  If not then don't
           if (_.findIndex(mi.Parents, p => p == item.Id) > -1) {
                if (mi.Parent && mi.Parent.IsOpen) mi.IsDisplayed = true;
                if (mi.Parent && !mi.Parent.IsOpen) mi.IsDisplayed = false;             
                if (!open) mi.IsDisplayed = false;      
           }                       
        });
        if (open) {
            //Set other items at this level to closed if they are open
            _.chain(this.menuItems)
                .filter(mi => mi.Id !== item.Id && mi.Level == item.Level)
                .each(mi => { if (mi.IsOpen) this.setMenuItemState(mi, false); }).value();            
        }
    }
    
    public hasSubItems(menuItem: IMainMenuItem): boolean {
        return menuItem.MenuItem.SubMenus.length > 0    
    }
    
    public showDownCaret(menuItem: IMainMenuItem): boolean {
        return menuItem.MenuItem.SubMenus.length > 0 && menuItem.IsOpen;
    }

    public showLeftCaret(menuItem: IMainMenuItem): boolean {
        return menuItem.MenuItem.SubMenus.length > 0 && !menuItem.IsOpen;
    }
    
    private getMenuItemChildren(level: number, parent: IMainMenuItem, parents: number[], currentChildren: IHubServiceMenuItem[], allItems: IMainMenuItem[] ): void {
        _.each(currentChildren, (mi) => {
            this.menuItemIdGenerator += 1;
            var newMenuItem: IMainMenuItem = {
                Id: this.menuItemIdGenerator,
                MenuItem: mi,
                IsDisplayed: (level == 1),
                Level: level,
                Parents: [].concat(parents),
                Parent: parent,
                IsOpen: false
            }
            
            allItems.push(newMenuItem);            
            this.getMenuItemChildren(level + 1, newMenuItem, parents.concat(newMenuItem.Id), mi.SubMenus, allItems);
        });    
    }
    
    ngOnInit() {
    }

}

export interface IMainMenuItem {
    Id: number,
    MenuItem: IHubServiceMenuItem,
    IsDisplayed : boolean,
    IsOpen: boolean,
    Level: number,
    Parents: number[],
    Parent: IMainMenuItem
}