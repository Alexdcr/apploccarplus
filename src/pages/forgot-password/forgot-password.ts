import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController, Platform } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
    providers: [ApiService]
})
export class ForgotPasswordPage {
    //for error messages
    public wrong_data: {
        email: boolean,
        text: string
    } = {
        email: false,
        text: ""
    };

    Forgotsubmit: boolean = false;

    //form forgot password data
    public forgot_info: {
        email: string,
    } = {
        email: "",
    };

    //post request
    public response: any;

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public loading: LoadingController, public toast: ToastController, public viewCtrl: ViewController) {

    }

    goToDashboard() {
        this.nav.pop();
    }

    goToRecoverPass() {
        this.Forgotsubmit = true;

        this.apiServ.toForgotPassword(this.forgot_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
                    let toast = this.toast.create({
                        message: 'Mail sent to reset password successfully',
                        duration: 4000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    toast.present();
                } else if (this.response.status == "error" && this.response.type == "Empty account") {
                    this.wrong_data.email = true;
                    this.wrong_data.text = "Email is required.";
                } else if (this.response.status == "error" && this.response.type == "Error on user") {
                    this.wrong_data.email = true;
                    this.wrong_data.text = "The user trying to recover the password no longer exists.";
                }
            });
    }

}
