import { Component } from '@angular/core';
import { NavController, ModalController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public nav: NavController, public modal: ModalController, public viewCtrl: ViewController) {

    }

    goToRegister() {
        //this.viewCtrl.dismiss();
        this.openModalRegister();
    }

    goToLogin() {
        //this.viewCtrl.dismiss();
        this.openModalLogin();
    }

    openModalLogin() {
        let modal = this.modal.create(LoginPage);
        modal.present();
    }

    openModalRegister() {
        let modal = this.modal.create(RegisterPage);
        modal.present();
    }
}
