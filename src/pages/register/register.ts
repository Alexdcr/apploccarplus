import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController, Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { MenuPage } from '../menu/menu';
import { ApiService } from '../../providers/api-service';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    providers: [ApiService]
})
export class RegisterPage {
    //for error messages
    public wrong_data: {
        name: boolean,
        lastname: boolean,
        email: boolean,
        password: boolean,
        text: string
    } = {
        name: false,
        lastname: false,
        email: false,
        password: false,
        text: ""
    };

    Registersubmit: boolean = false;

    //form register data
    public register_info: {
        name: string,
        lastname: string,
        email: string,
        password: string
    } = {
        name: "",
        lastname: "",
        email: "",
        password: ""
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
        this.user_log.email = this.register_info.email;
        NativeStorage.setItem('user_log', JSON.stringify(this.user_log)).then(() => { }, error => { });

				//Clean inputs
				this.register_info.name = "";
				this.register_info.lastname = "";
				this.register_info.email = "";
				this.register_info.password = "";

        this.nav.push(MenuPage, {}, { animate: false });
    }

    goToRegister() {
        this.Registersubmit = true;
        //this.register_info.uuid = Device.uuid;

        let loader = this.loading.create({
            content: "Creating account...",
						cssClass: 'loccar loccar-message',
            duration: 1500
        });
        this.apiServ.toUserRegister(this.register_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
                    let toast = this.toast.create({
                        message: ' User create ' + this.response.status,
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    toast.present();
                } else if (this.response.status == "error" && this.response.type == "Empty name") {
                    this.wrong_data.name = true;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = false;
                    this.wrong_data.password = false;
                    this.wrong_data.text = "Name is required.";
                } else if (this.response.status == "error" && this.response.type == "Empty lastname") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = true;
                    this.wrong_data.email = false;
                    this.wrong_data.password = false;
                    this.wrong_data.text = "Last name is required.";
                } else if (this.response.status == "error" && this.response.type == "Empty email") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = true;
                    this.wrong_data.password = false;
                    this.wrong_data.text = "Email is required.";
                } else if (this.response.status == "error" && this.response.type == "Password short") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = false;
                    this.wrong_data.password = true;
                    this.wrong_data.text = "Password too short.";
                } else if (this.response.status == "error" && this.response.type == "Email exist") {
                    this.wrong_data.name = false;
                    this.wrong_data.lastname = false;
                    this.wrong_data.email = true;
                    this.wrong_data.password = false;
                    this.wrong_data.text = "The email provided is already in use.";
                } else {
                    let toast = this.toast.create({
                        message: 'There was an error creating the new account, please try again later.',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'error error-message'
                    });
                    toast.present();
                }
            });
        loader.present();
    }

}
