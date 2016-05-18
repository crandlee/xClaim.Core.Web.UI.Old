import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
@Component({
    templateUrl: 'app/welcome/welcome.component.html',
    providers: []
})
export class WelcomeComponent implements OnInit  {

    public userName: string;
    
    constructor(private xCoreServices: XCoreServices)     
    { 
    }
    
    ngOnInit() {
    }
              
}