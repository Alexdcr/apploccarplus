import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController, Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { MenuPage } from '../menu/menu';
import { ApiService } from '../../providers/api-service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [ApiService]
})
export class LoginPage {
    //for error messages
    public wrong_data: {
        email: boolean,
        pass: boolean,
        text: string
    } = {
        email: false,
        pass: false,
        text: ""
    };

    Loginsubmit: boolean = false;

    //form login data
    public login_info: {
        email: string,
        password: string,
    } = {
        email: "",
        password: "",
    };

    //User Remember data
    private user_log: {
        email: string,
    } = {
        email: "",
    };

    //post request
    public response: any;
    public login_status: boolean;


    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public loading: LoadingController, public toast: ToastController, public viewCtrl: ViewController) {
        platform.ready().then(() => {
            NativeStorage.getItem('user_log').then(
                (log) => {
                    if (JSON.parse(log)) {
                        this.user_log = JSON.parse(log);
                        this.login_info.email = this.user_log.email;
                    } else {
                        this.login_info.email = "";
                    }
                    this.user_log = JSON.parse(log);
                },
                (error) => { });

        });
    }

    test() {
        let loader = this.loading.create({
            spinner: 'crescent',
            content: "Logging in, please wait...",
            duration: 100000,
            cssClass: 'loccar loccar-message'
        });
        loader.present();
    }

    public createAccount() {
        this.nav.push(RegisterPage);
    }

		forgotPassword() {
			this.nav.push(ForgotPasswordPage);
		}

    goToDashboard() {
        NativeStorage.setItem('user_info', JSON.stringify(this.response.user)).then(() => { }, error => { });
        NativeStorage.setItem('user_session_info', JSON.stringify(this.response.user_session)).then(() => { }, error => { });
        NativeStorage.setItem('car_types', JSON.stringify(this.response.car_types)).then(() => { }, error => { });
        NativeStorage.setItem('car_models', JSON.stringify(this.response.car_models)).then(() => { }, error => { });
        NativeStorage.setItem('user_cars', JSON.stringify(this.response.user_cars)).then(() => { }, error => { });
        NativeStorage.setItem('count_cars', JSON.stringify(this.response.count_cars)).then(() => { }, error => { });
				NativeStorage.setItem('shared_cars_touser', JSON.stringify(this.response.shared_cars_touser)).then(() => { }, error => { });
				NativeStorage.setItem('shared_count_cars', JSON.stringify(this.response.shared_count_cars)).then(() => { }, error => { });

        //For Remember User data
        this.user_log.email = this.login_info.email;
        NativeStorage.setItem('user_log', JSON.stringify(this.user_log)).then(() => { }, error => { });

				//Clean inputs
				this.login_info.password = "";

        this.nav.push(MenuPage, {}, { animate: false });
    }

    goToLogin() {
        this.Loginsubmit = true;
        //this.login_info.uuid = Device.uuid;

        this.apiServ.toUserLogin(this.login_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
                    let loader = this.loading.create({
                        spinner: 'crescent',
                        content: "Logging in, please wait...",
												cssClass: 'loccar loccar-message',
                        duration: 2000
                    });
                    loader.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    loader.present();
                } else if (this.response.status == "error" && this.response.type == "Empty account") {
                    this.wrong_data.email = true;
                    this.wrong_data.pass = false;
                    this.wrong_data.text = "Email is required.";
                } else if (this.response.status == "error" && this.response.type == "Password too short") {
                    this.wrong_data.email = false;
                    this.wrong_data.pass = true;
                    this.wrong_data.text = "Password is too short.";
                } else if (this.response.status == "error" && this.response.type == "Wrong user") {
                    this.wrong_data.email = true;
                    this.wrong_data.pass = false;
                    this.wrong_data.text = "Wrong email.";
                } else if (this.response.status == "error" && this.response.type == "Wrong password") {
                    this.wrong_data.email = false;
                    this.wrong_data.pass = true;
                    this.wrong_data.text = "Wrong password.";
                } else {
                    let toast = this.toast.create({
                        message: 'Error: ' + this.response.type,
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'error error-message'
                    });
                    toast.present();
                }
            });
        //loader.present();
    }

}
