import { Component, ViewChild, Renderer } from '@angular/core';
import { FilterComponent } from '../shared/filtering/filter.component';
import { UserFilterService, IUsersToServerFilter } from './user.filter.service';
import { XCoreServices, TraceMethodPosition } from '../shared/service/core-services.service';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { IUserProfileReturn } from './userprofile.service';
import { OffClickDirective } from '../shared/off-click/off-click.directive';

@Component({
    selector: "userfilter",
    styleUrls: ['app/usermanagement/user.filter.component.css'],
    templateUrl: 'app/usermanagement/user.filter.component.html',
    providers: [],
    directives: [ACCORDION_DIRECTIVES, OffClickDirective]
})
export class UserFilterComponent extends FilterComponent<IUsersToServerFilter, IUserProfileReturn> {
    
    @ViewChild('userName') focusRef;
    public self:FilterComponent<IUsersToServerFilter, IUserProfileReturn> = this;

    constructor(protected xCoreServices: XCoreServices, private userFilterService: UserFilterService, private renderer: Renderer) {

        super(xCoreServices, userFilterService);
        
    }

    ngOnInit() {

    }

}

