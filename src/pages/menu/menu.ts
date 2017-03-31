import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { ShareCarsPage } from '../share-cars/share-cars';
import { MessagesPage } from '../messages/messages';
import { SettingsPage } from '../settings/settings';

@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html'
})
export class MenuPage {

    tab1Root: any;
    tab2Root: any;
    tab3Root: any;
    tab4Root: any;

    constructor(public nav: NavController) {
        this.tab1Root = DashboardPage;
        this.tab2Root = ShareCarsPage;
        this.tab3Root = MessagesPage;
        this.tab4Root = SettingsPage;
    }

}
