import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';


@Component({
    selector: 'page-new-cars',
    templateUrl: 'new-cars.html',
    providers: [ApiService]
})
export class NewCarsPage {
    //for error messages
    public wrong_data: {
        car_type: boolean,
        car_model: boolean,
        text: string
    } = {
        car_type: false,
        car_model: false,
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

    NewCarsubmit: boolean = false;

    //session data
    public user_session: {
        session_id: number,
        session_token: any
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

    //User Car data
    private car_info: {
        session_id: number,
        session_token: any,
        car_model: number,
        car_type: number
    } = {
        session_id: null,
        session_token: '',
        car_model: null,
        car_type: null
    };

    //Assing for car models
    public car_models: {
        id: number,
        model: string
    }[] = [{
        id: null,
        model: ''
    }];

    public models_picker: {
        name: string,
        options: {
            text: string,
            value: string
        }[]
    }[] = [{
        name: '',
        options: [
            {
                text: '',
                value: ''
            }
        ]
    }];

    //Assing for car types
    public car_types: {
        id: number,
        type: string
    }[] = [{
        id: null,
        type: ''
    }];

    public types_picker: {
        name: string,
        options: {
            text: string,
            value: string
        }[]
    }[] = [{
        name: '',
        options: [
            {
                text: '',
                value: ''
            }
        ]
    }];

    //post request
    public response: any;

    constructor(public nav: NavController, public navParams: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public viewCtrl: ViewController, public toast: ToastController) {
        platform.ready().then(() => {
            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    this.user_session.session_id = this.user_session_info.id;
                    this.user_session.session_token = this.user_session_info.session_token;
                },
                (error) => { });
            NativeStorage.getItem('car_types').then(
                (data_car_types) => {
                    this.car_types = JSON.parse(data_car_types);
                    //Method for add all types a picker_types
                    this.types_picker[0].name = 'Types';
                    for (var i = 0; i < this.car_types.length; i++) {
                        if (this.car_types[i].id === 1) {
                            this.types_picker[0].options[i] = { text: 'Touring', value: this.car_types[i].id.toString() };
                        } else if (this.car_types[i].id === 2) {
                            this.types_picker[0].options[i] = { text: 'Sports', value: this.car_types[i].id.toString() };
                        } else if (this.car_types[i].id === 3) {
                            this.types_picker[0].options[i] = { text: 'Pickup', value: this.car_types[i].id.toString() };
                        }
                    }
                },
                (error) => { });

            NativeStorage.getItem('car_models').then(
                (data_car_models) => {
                    this.car_models = JSON.parse(data_car_models);
                    //Method for add all types a picker_models
                    this.models_picker[0].name = 'Models';
                    for (var i = 0; i < this.car_models.length; i++) {
                        this.models_picker[0].options[i] = { text: this.car_models[i].model, value: this.car_models[i].id.toString() };
                    }
                },
                (error) => { });
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goToDashboard() {
        NativeStorage.remove('user_cars').then(() => { }, (error) => { });
        NativeStorage.remove('count_cars').then(() => { }, (error) => { });
        NativeStorage.setItem('user_cars', JSON.stringify(this.response.user_cars)).then(() => { }, error => { });
        NativeStorage.setItem('count_cars', JSON.stringify(this.response.count_cars)).then(() => { }, error => { });

        this.viewCtrl.dismiss();
				//this.nav.pop();
    }

    toSaveCarInformation() {
        this.NewCarsubmit = true;

        this.car_info.session_id = this.user_session.session_id;
        this.car_info.session_token = this.user_session.session_token;

        this.apiServ.toAddNewCars(this.car_info)
            .then(data => {
                this.response = data;
                if (this.response.status == "success") {
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
                } else if (this.response.status == "error" && this.response.type == "Empty model") {
                    this.wrong_data.car_model = true;
                    this.wrong_data.car_type = false;
                    this.wrong_data.text = "Car model is required.";
                } else if (this.response.status == "error" && this.response.type == "Empty type") {
                    this.wrong_data.car_model = false;
                    this.wrong_data.car_type = true;
                    this.wrong_data.text = "Car type is required.";
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
                } else if (this.response.status == "error" && this.response.type == "Error on added car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred added the new car, please try again later.";
                } else if (this.response.status == "error" && this.response.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
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
    }

}
