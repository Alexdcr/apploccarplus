import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html',
    providers: [ApiService]
})
export class ChangePasswordPage {
    //for error messages
    public wrong_data: {
        password: boolean,
        re_password: boolean,
        text: string
    } = {
        password: false,
        re_password: false,
        text: ""
    };

    public wrong_session: {
        session_id: boolean,
        session_token: boolean,
        user: boolean,
        text: string
    } = {
        session_id: false,
        session_token: false,
        user: false,
        text: ""
    };

    Changesubmit: boolean = false;

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

    //user data
    public change_info: {
        password: string,
        re_password: string,
        session_id: number,
        session_token: string
    } = {
        password: "",
        re_password: "",
        session_id: null,
        session_token: ""
    };

    //post request
    public response: any;

		constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public viewCtrl: ViewController, public toast: ToastController) {
			platform.ready().then(() => {
					NativeStorage.getItem('user_session_info').then(
							(data_session) => {
									this.user_session_info = JSON.parse(data_session);
									this.user_session.session_id = this.user_session_info.id;
									this.user_session.session_token = this.user_session_info.session_token;

									this.change_info.session_id = this.user_session.session_id;
									this.change_info.session_token = this.user_session.session_token;
							},
							(error) => { });
			});
    }

		dismiss() {
        this.viewCtrl.dismiss();
    }

		goToDashboard() {
        NativeStorage.remove('user_info').then(() => { }, (error) => { });
        NativeStorage.setItem('user_info', JSON.stringify(this.response.user)).then(() => { }, error => { });

        this.viewCtrl.dismiss();
    }

    toSavePasswordInfo() {
        this.Changesubmit = true;

        this.change_info.session_id = this.user_session.session_id;
        this.change_info.session_token = this.user_session.session_token;

        this.apiServ.toUpdatePassword(this.change_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
                    let toast = this.toast.create({
                        message: 'Password Updated Successfully',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    toast.present();
                } else if (this.response.status == "error" && this.response.type == "Password short") {
                    this.wrong_data.password = true;
                    this.wrong_data.re_password = false;
                    this.wrong_data.text = "Password is too short.";
                } else if (this.response.status == "error" && this.response.type == "Password does not match") {
                    this.wrong_data.password = false;
                    this.wrong_data.re_password = true;
                    this.wrong_data.text = "Password does not match.";
                } else if (this.response.status == "error" && this.response.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error saving your information, please try again later.";
                } else if (this.response.status == "error" && this.response.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error saving your information, please try again later.";
                } else if (this.response.status == "error" && this.response.type == "Error on user") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "The user you are trying to upgrade no longer exists.";
                } else if (this.response.status == "error" && this.response.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                }
            });
    }

}
