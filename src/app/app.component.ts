import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
//import { MenuPage } from '../pages/menu/menu';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    private rootPage: any;

    constructor(platform: Platform) {
				this.rootPage = LoginPage;
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
}
