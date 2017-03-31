import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-account',
    templateUrl: 'account.html',
    providers: [ApiService]
})
export class AccountPage {
    //for error messages
    public wrong_data: {
        name: boolean,
        lastname: boolean,
        email: boolean,
        phone: boolean,
        text: string
    } = {
        name: false,
        lastname: false,
        email: false,
        phone: false,
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

    Accountsubmit: boolean = false;

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
    public account_info: {
        name: string,
        lastname: string,
        email: string,
        phone: string,
        session_id: number,
        session_token: string
    } = {
        name: "",
        lastname: "",
        email: "",
        phone: "",
        session_id: null,
        session_token: ""
    };

    //post request
    public response_save: any;

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public viewCtrl: ViewController, public toast: ToastController) {
        platform.ready().then(() => {
            NativeStorage.getItem('user_info').then(
                (data_user) => {
                    this.account_info = JSON.parse(data_user);
                },
                (error) => { });

            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    this.user_session.session_id = this.user_session_info.id;
                    this.user_session.session_token = this.user_session_info.session_token;

                    this.account_info.session_id = this.user_session.session_id;
                    this.account_info.session_token = this.user_session.session_token;
                },
                (error) => { });
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goToDashboard() {
        NativeStorage.remove('user_info').then(() => { }, (error) => { });
        NativeStorage.setItem('user_info', JSON.stringify(this.response_save.user)).then(() => { }, error => { });
        NativeStorage.getItem('user_info').then(
            (data_user) => { this.account_info = JSON.parse(data_user) },
            (error) => { });

        this.viewCtrl.dismiss();
        //this.nav.pop();
    }

    toSaveUserInfo() {
        this.Accountsubmit = true;

        this.account_info.session_id = this.user_session.session_id;
        this.account_info.session_token = this.user_session.session_token;

        this.apiServ.toUserUpdate(this.account_info)
            .then(data => {
                this.response_save = data;
                if (this.response_save.status == "success") {
                    let toast = this.toast.create({
                        message: 'Information Updated Successfully',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    toast.present();
                } else if (this.response_save.status == "error" && this.response_save.type == "Empty name") {
                    this.wrong_data.name = true;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = false;
                    this.wrong_data.phone = false;
                    this.wrong_data.text = "Name is required.";
                } else if (this.response_save.status == "error" && this.response_save.type == "Empty lastname") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = true;
                    this.wrong_data.email = false;
                    this.wrong_data.phone = false;
                    this.wrong_data.text = "Last name is required.";
                } else if (this.response_save.status == "error" && this.response_save.type == "Empty email") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = true;
                    this.wrong_data.phone = false;
                    this.wrong_data.text = "Mail is required.";
                } else if (this.response_save.status == "error" && this.response_save.type == "Empty phone") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = false;
                    this.wrong_data.phone = true;
                    this.wrong_data.text = "Phone is required.";
                } else if (this.response_save.status == "error" && this.response_save.type == "Email exist") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = true;
                    this.wrong_data.phone = false;
                    this.wrong_data.text = "The email provided is already in use.";
                } else if (this.response_save.status == "error" && this.response_save.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error saving your information, please try again later.";
                } else if (this.response_save.status == "error" && this.response_save.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error saving your information, please try again later.";
                } else if (this.response_save.status == "error" && this.response_save.type == "Error on user") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "The user you are trying to upgrade no longer exists.";
                } else if (this.response_save.status == "error" && this.response_save.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                }
            });
    }
}
