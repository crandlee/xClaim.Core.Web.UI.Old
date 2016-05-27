import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
import { HubService, IHubServiceData } from '../shared/hub/hub.service';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap';

@Component({
    templateUrl: 'app/welcome/welcome.component.html',
    directives: [ACCORDION_DIRECTIVES],
    providers: []
})
export class WelcomeComponent implements OnInit {

    public hubData: IHubServiceData;


    public oneAtATime: boolean = true;
    public items: Array<string> = ['Item 1', 'Item 2', 'Item 3'];

    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    public groups: Array<any> = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    public addItem(): void {
        this.items.push(`Items ${this.items.length + 1}`);
    }

    constructor(private xCoreServices: XCoreServices, private hubService: HubService) {
        //Set up events
        this.hubService.HubDataCompletedEvent.subscribe(hd => {
            this.hubData = hd;            
        });
    }

    ngOnInit() {
    }

}