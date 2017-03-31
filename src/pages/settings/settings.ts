import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform, App, ToastController, LoadingController } from 'ionic-angular';

import { AccountPage } from '../account/account';
import { ChangePasswordPage } from '../change-password/change-password';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
    providers: [ApiService]
})
export class SettingsPage {

    //session data
    public user_session: {
        session_id: number,
        session_token: any,
    } = {
        session_id: null,
        session_token: ''
    };

    public user_session_info: {
        id: number,
        session_token: string
    } = {
        id: null,
        session_token: ""
    };

    //User Remember data
    private user_log: {
        email: string,
    } = {
        email: "",
    };

    //post request
    public response: any;

    constructor(private _app: App, public nav: NavController, public navParams: NavParams, public platform: Platform, public apiServ: ApiService, public modal: ModalController, public alert: AlertController, public toast: ToastController, public loading: LoadingController) {
        platform.ready().then(() => {
            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    this.user_session.session_id = this.user_session_info.id;
                    this.user_session.session_token = this.user_session_info.session_token;
                },
                (error) => { });
            NativeStorage.getItem('user_log').then(
                (log) => {
                    this.user_log = JSON.parse(log);
                },
                (error) => { });
        });
    }

    goToAccount() {
        let modal = this.modal.create(AccountPage);
        modal.present();
    }

    goToChangePassword() {
			let modal = this.modal.create(ChangePasswordPage);
			modal.present();
    }

    goToHome() {
        //For Remember User data
        NativeStorage.setItem('user_log', JSON.stringify(this.user_log)).then(() => { }, error => { });

        let root = this._app.getRootNav();
        root.popToRoot();
    }

    goToLogOut() {
        let loader = this.loading.create({
            spinner: 'dots',
            content: "Closing session, please wait...",
						cssClass: 'loccar loccar-message',
            duration: 1500
        });
        this.apiServ.toUserLogout(this.user_session)
            .then(data => {
                this.response = data;
            });
        loader.onDidDismiss(() => {
            if (this.response.status != "success") {
                let toast = this.toast.create({
                    message: this.response.status + ' ' + this.response.type,
                    duration: 2000,
                    position: 'middle',
                    cssClass: 'error error-message'
                });
                toast.present();
            } else {
                NativeStorage.clear().then(() => { }, (error) => { });
                this.goToHome();
            }
        });
        loader.present();
    }
}
