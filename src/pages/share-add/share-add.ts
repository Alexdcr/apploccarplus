import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-share-add',
    templateUrl: 'share-add.html',
    providers: [ApiService]
})
export class ShareAddPage {
    //for error messages
    public wrong_data: {
        token: boolean,
        text: string
    } = {
        token: false,
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

    Sharesubmit: boolean = false;
    Validate: boolean = false;

    //session data
    public user_session_info: {
        id: number,
        session_token: string
    } = {
        id: null,
        session_token: ""
    };

    //User Share Car data
    public user_session: {
        session_id: number,
        session_token: any,
        token_share: any,
    } = {
        session_id: null,
        session_token: '',
        token_share: '',
    };

    //Enable Share Car data
    public share_session_info: {
        session_id: number,
        session_token: any,
        car_id: number,
    } = {
        session_id: null,
        session_token: '',
        car_id: null,
    };

    //Owner and car info
    public owner_car_info: {
        owner_name: string,
        id: number,
        car_model: string,
        car_type: string
    } = {
        owner_name: "",
        id: null,
        car_model: "",
        car_type: ""
    };


    //post request
    public response_get: any;
    public response: any;

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public viewCtrl: ViewController, public toast: ToastController) {
        NativeStorage.getItem('user_session_info').then(
            (data_session) => {
                this.user_session_info = JSON.parse(data_session);
                //for get request data
                this.user_session.session_id = this.user_session_info.id;
                this.user_session.session_token = this.user_session_info.session_token;
                //for post request data
                this.share_session_info.session_id = this.user_session_info.id;
                this.share_session_info.session_token = this.user_session_info.session_token;
            },
            (error) => { });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    toGetInfoCar() {
        this.Sharesubmit = true;

        this.apiServ.toValidateTokenShare(this.user_session)
            .then(data => {
                this.response_get = data;
                if (this.response_get.status == "success") {
                    this.owner_car_info = this.response_get.shared_car_info;
                    this.share_session_info.car_id = this.owner_car_info.id;
                    this.Validate = true;
                } else if (this.response_get.status == "error" && this.response_get.type == "Empty token") {
                    this.wrong_data.token = true;
                    this.wrong_data.text = "The Token is required.";
                } else if (this.response_get.status == "error" && this.response_get.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response_get.status == "error" && this.response_get.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response_get.status == "error" && this.response_get.type == "Error on car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response_get.status == "error" && this.response_get.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                }
            });
    }

    toAddCar() {
        this.apiServ.toEnableShare(this.share_session_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
										let toast = this.toast.create({
                        message: 'Car added Successfully',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    });
                    toast.present();
                } else if (this.response.status == "error" && this.response.type == "Empty car id") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred the car I selected could not be foundplease try again later.";
                } else if (this.response.status == "error" && this.response.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response.status == "error" && this.response.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response.status == "error" && this.response.type == "Error on car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response.status == "error" && this.response.type == "Error on user") {
									this.wrong_session.session_id = true;
									this.wrong_session.session_token = true;
									this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred with the session. You can not share a vehicle with yourself.";
                } else if (this.response.status == "error" && this.response.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                }
            });
    }

		goToDashboard() {
			NativeStorage.remove('shared_cars_touser').then(() => { }, (error) => { });
			NativeStorage.remove('shared_count_cars').then(() => { }, (error) => { });
			NativeStorage.setItem('shared_cars_touser', JSON.stringify(this.response.shared_cars_touser)).then(() => { }, error => { });
			NativeStorage.setItem('shared_count_cars', JSON.stringify(this.response.shared_count_cars)).then(() => { }, error => { });

			this.viewCtrl.dismiss();
		}

}
