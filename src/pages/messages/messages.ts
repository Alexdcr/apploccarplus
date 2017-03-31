import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ModalController } from 'ionic-angular';

@Component({
    selector: 'page-messages',
    templateUrl: 'messages.html'
})
export class MessagesPage {

    constructor(public nav: NavController, public params: NavParams, public platform: Platform, public alert: AlertController, public modal: ModalController ) {

    }

    goToShowMapDetails(geo_id) {

    }

}
