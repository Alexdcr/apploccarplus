import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Platform, ToastController } from 'ionic-angular';
import { NewCarsPage } from '../new-cars/new-cars';
import { CarsPage } from '../cars/cars';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
    providers: [ApiService]
})
export class DashboardPage {
    //for check if user is login
    public login_status: boolean;

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

    sessionid: number = null;
    sessiontoken: any = "";

    //user data
    public user_info: {
        picture: any,
        name: string,
        lastname: string,
        email: string,
        phone: string,
        session_id: number,
        session_token: string
    } = {
        picture: "",
        name: "",
        lastname: "",
        email: "",
        phone: "",
        session_id: null,
        session_token: ""
    };

    //cars variables
    public count_cars: number;

    public user_cars: {
        id: number,
        alarm_active: boolean,
        shared_active: boolean,
        shared_token: string,
        user_id: number,
        car_type_id: number,
        car_type: string,
        car_model_id: number,
        car_model: string
    }[] = [{
        id: null,
        alarm_active: false,
        shared_active: false,
        shared_token: '',
        user_id: null,
        car_type_id: null,
        car_type: '',
        car_model_id: null,
        car_model: ''
    }];

    public car_models: {
        id: number,
        model: string
    }[] = [{
        id: null,
        model: ''
    }];

    public car_types: {
        id: number,
        type: string
    }[] = [{
        id: null,
        type: ''
    }];

    //test variables
    public findInterval: any;
    getmessage: any = '';
    public postmessage: {
        user: string,
        pass: string,
        message: string
    } = {
        user: 'prueba',
        pass: '123456',
        message: 'hola puto'
    };

    public responseget: any;
    public responsepost: any;
    public response: {
        status: any,
        notification_car: {
            id: any,
            car_type: string,
            car_model: string,
            loc_status: any,
            message: string
        }
    } = {
        status: null,
        notification_car: {
            id: null,
            car_type: "",
            car_model: "",
            loc_status: null,
            message: ""
        }
    };

    constructor(public nav: NavController, public navParams: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public modal: ModalController, public toast: ToastController) {
        platform.ready().then(() => {
            NativeStorage.getItem('user_info').then(
                (data_user) => {
                    this.user_info = JSON.parse(data_user);
                },
                (error) => { });

            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    this.user_session.session_id = this.user_session_info.id;
                    this.user_session.session_token = this.user_session_info.session_token;
                    this.login_status = true;
                    this.sessionid = this.user_session_info.id;
                    this.sessiontoken = this.user_session_info.session_token;

                    //For get all notifications for the server
                    /*apiServ.toGetNotification(this.sessionid, this.sessiontoken)
                        .subscribe(
                        data => {
                            this.response = data
                            if (this.response.notification_car.loc_status != 0) {
                                let toast = this.toast.create({
                                    message: this.response.notification_car.message,
                                    duration: 5000,
                                    position: 'middle',
                                    cssClass: 'success success-message'
                                });
                                toast.present();
                            }
                        });*/

                },
                (error) => { });

            NativeStorage.getItem('car_types').then(
                (data_car_types) => {
                    this.car_types = JSON.parse(data_car_types);
                },
                (error) => { });

            NativeStorage.getItem('car_models').then(
                (data_car_models) => {
                    this.car_models = JSON.parse(data_car_models);
                },
                (error) => { });

            NativeStorage.getItem('user_cars').then(
                (data_user_cars) => {
                    this.user_cars = JSON.parse(data_user_cars);
                },
                (error) => { });

            NativeStorage.getItem('count_cars').then(
                (data_count_cars) => {
                    this.count_cars = JSON.parse(data_count_cars);
                },
                (error) => { });
        });
    }

    new() {
        let modal = this.modal.create(NewCarsPage);
        modal.onDidDismiss(() => {
            NativeStorage.getItem('user_cars').then(
                (data_user_cars) => { this.user_cars = JSON.parse(data_user_cars) },
                (error) => { });
            NativeStorage.getItem('count_cars').then(
                (data_count_cars) => { this.count_cars = JSON.parse(data_count_cars) },
                (error) => { });
        });
        modal.present();
    }

    goToCarInfo(car_id) {
        this.nav.push(CarsPage, { 'car_id': car_id });
    }

    goToGetTest() {
        this.apiServ.toGetTest()
            .subscribe(data => {
                this.responseget = data;
                if (this.responseget.status == "success") {
                    let alert = this.alert.create({
                        title: 'Get Test',
                        subTitle: 'Response: ' + this.responseget.type,
                        buttons: ['OK']
                    });
                    alert.present();
                }
            },
            error => {
                let alert = this.alert.create({
                    title: 'Get Test',
                    subTitle: 'Error: ' + error,
                    buttons: ['OK']
                });
                alert.present();
            });
    }

    getDataPost() {
        let timeBetweenCalls = 180000;

        this.findInterval = setTimeout(() => {
            this.goToPostTest();
        }, timeBetweenCalls);
    }

    goToShutdownAlarm() {
        clearTimeout(this.findInterval);
    }

    goToPostTest() {
        this.apiServ.toPostTestTime(this.postmessage)
            .then(data => {
                this.responsepost = data;
                if (this.responsepost.status == "success") {
                    let alert = this.alert.create({
                        title: 'Post Test',
                        subTitle: 'Response: ' + this.responsepost.type,
                        buttons: ['OK']
                    });
                    alert.present();
                }
            },
            error => {
                let alert = this.alert.create({
                    title: 'Post Test',
                    subTitle: 'Error: ' + error,
                    buttons: ['OK']
                });
                alert.present();
            });
    }

}
