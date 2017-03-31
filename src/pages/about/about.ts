import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {
    //App Data
    public app_info: {
        version: any,
        name: any,
        details: any
    } = {
        version: '0.9.14',
        name: 'Location Car',
        details: 'Tesis Project'
    }

    constructor(public nav: NavController, public navParams: NavParams, public platform: Platform, public ViewCtrl: ViewController) {

    }

		dismiss() {
			this.ViewCtrl.dismiss();
		}

}
