import { Component, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
import { UserProfileService } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';

@Component({
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserProfileService]
})
export class UserProfileComponent extends XCoreBaseComponent implements OnInit  {

    public userNames: string[];
    
    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService)     
    {  
        super(xCoreServices);
    }

    ngOnInit() {
        this.userProfileService.getUserProfile().subscribe(up => {
                //this.userNames = up.map(u => u.UserName);
                console.log(up);
            }); 
    }
                  
}