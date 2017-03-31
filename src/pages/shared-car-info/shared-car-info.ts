import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController, ModalController, ViewController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';

@Component({
    selector: 'page-shared-car-info',
    templateUrl: 'shared-car-info.html',
    providers: [ApiService]
})
export class SharedCarInfoPage {
    //For error messages
    public error_session: {
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

    GetCarsubmit: boolean = false;
    PostCarsubmit: boolean = false;

    //car data
    public owner_car_info: {
        id: number,
        alarm_active: boolean,
        shared_active: boolean,
        shared_token: string,
        user_id: number,
        car_type_id: number,
        car_type: string,
        car_model_id: number,
        car_model: string,
        long: any,
        lat: any,
        lat_last: any,
        long_last: any,
        owner_name: string
    } = {
        id: null,
        alarm_active: false,
        shared_active: false,
        shared_token: '',
        user_id: null,
        car_type_id: null,
        car_type: '',
        car_model_id: null,
        car_model: '',
        long: null,
        lat: null,
        lat_last: null,
        long_last: null,
        owner_name: ''
    };

    //data for get car information
    find_car_id: number = null;

    //session data
    public user_session: {
        session_id: number,
        session_token: any,
        car_id: number
    } = {
        session_id: null,
        session_token: '',
        car_id: null
    };

    public user_session_info: {
        id: number,
        session_token: string
    } = {
        id: null,
        session_token: ""
    };

    //data for enable alarm and location
    public user_car_session: {
        session_id: number,
        session_token: any,
        car_id: number,
        long: any,
        lat: any
    } = {
        session_id: null,
        session_token: '',
        car_id: null,
        long: null,
        lat: null
    };

    //post request
    public response_get: any;
    public response_enable: any;
    public response_disable: any;
    public response_disable_share: any;

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public modal: ModalController, public viewCtrl: ViewController, public toast: ToastController) {
        platform.ready().then(() => {
            this.find_car_id = JSON.parse(this.params.get('car_id'));

            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    //for get request data
                    this.user_session.session_id = this.user_session_info.id;
                    this.user_session.session_token = this.user_session_info.session_token;
                    this.user_session.car_id = this.find_car_id;
                    //for post request data
                    this.user_car_session.session_id = this.user_session_info.id;
                    this.user_car_session.session_token = this.user_session_info.session_token;
                    this.user_car_session.car_id = this.find_car_id;
                    Geolocation.getCurrentPosition().then((position) => {
                        this.user_car_session.long = position.coords.longitude;
                        this.user_car_session.lat = position.coords.latitude;
                    });

                    this.goToGetCarInfo();
                },
                (error) => { });


        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goToGetCarInfo() {
        this.GetCarsubmit = true;

        this.apiServ.toGetShareCarInfo(this.user_session)
            .then(data => {
                this.response_get = data;
                if (this.response_get.status == "success") {
                    this.owner_car_info = this.response_get.shared_car;
                    if ((this.owner_car_info.lat != this.owner_car_info.lat_last) || (this.owner_car_info.long != this.owner_car_info.long_last)) {
                        let alert = this.alert.create({
                            title: 'Location',
                            subTitle: 'A change was detected in the location of your vehicle, please check the status of your vehicle.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                } else if (this.response_get.status == "error" && this.response_get.type == "Empty car id") {
                    this.error_session.session_id = false;
                    this.error_session.session_token = false;
                    this.error_session.user = true;
                    this.error_session.text = "An error occurred the car I selected could not be foundplease try again later.";
                } else if (this.response_get.status == "error" && this.response_get.type == "session_id") {
                    this.error_session.session_id = true;
                    this.error_session.session_token = false;
                    this.error_session.user = false;
                    this.error_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response_get.status == "error" && this.response_get.type == "session_token") {
                    this.error_session.session_id = false;
                    this.error_session.session_token = true;
                    this.error_session.user = false;
                    this.error_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response_get.status == "error" && this.response_get.type == "Error on car") {
                    this.error_session.session_id = false;
                    this.error_session.session_token = false;
                    this.error_session.user = true;
                    this.error_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response_get.status == "error" && this.response_get.type == "User not logged") {
                    this.error_session.session_id = true;
                    this.error_session.session_token = true;
                    this.error_session.user = false;
                    this.error_session.text = "An error occurred with the session, please try again later.";
                }
            });
    }

    alarmChange() {
        if (this.owner_car_info.alarm_active == false) {
            let prompt = this.alert.create({
                title: 'Alarm',
                message: "You are sure to active the alarm in this car?",
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => {
                            console.log('Cancel clicked');
                            this.owner_car_info.alarm_active = false;
                        }
                    },
                    {
                        text: 'Ok',
                        handler: data => {
                            console.log('Alarm Active');
                            this.goToEnableAlarm();
                            this.owner_car_info.alarm_active = true;
                        }
                    }
                ]
            });
            prompt.present();
        } else {
            this.goToDisableAlarm();
            this.owner_car_info.alarm_active = false;
        }
    }

    shareChange() {
        if (this.owner_car_info.shared_active == false) {
            let alert = this.alert.create({
                title: 'Share',
                subTitle: 'You do not have the privileges to activate this function, contact the owner of the vehicle.',
                buttons: ['OK']
            });
            alert.onDidDismiss(() => {
                this.owner_car_info.shared_active = false;
            });
            alert.present();
        } else {
            let prompt = this.alert.create({
                title: 'Share',
                message: "You are sure to finish and return control of the vehicle to its owner?",
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => {
                            console.log('Cancel clicked');
                            this.owner_car_info.shared_active = true;
                        }
                    },
                    {
                        text: 'Ok',
                        handler: data => {
                            this.goToDisableShare();
                            this.owner_car_info.shared_active = false;
                        }
                    }
                ]
            });
            prompt.present();
        }
    }

    goToEnableAlarm() {
        this.PostCarsubmit = true;

        this.apiServ.toEnableShareAlarm(this.user_car_session)
            .then(data => {
                this.response_enable = data;
                if (this.response_enable.status == "success") {
                    this.owner_car_info = this.response_enable.shared_car;

                    NativeStorage.remove('shared_cars_touser').then(() => { }, (error) => { });
                    NativeStorage.remove('shared_count_cars').then(() => { }, (error) => { });
                    NativeStorage.setItem('shared_cars_touser', JSON.stringify(this.response_enable.shared_cars_touser)).then(() => { }, error => { });
                    NativeStorage.setItem('shared_count_cars', JSON.stringify(this.response_enable.shared_count_cars)).then(() => { }, error => { });
                    let toast = this.toast.create({
                        message: 'Alarm enable successfully!!',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.present();
                } else if (this.response_enable.status == "error" && this.response_enable.type == "Empty car id") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred the car I selected could not be foundplease try again later.";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "Error on car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "Alarm active") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "You already have an alarm enabled, you can not enable another one.";
                } else if (this.response_enable.status == "error" && this.response_enable.type == "Share disable") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "There was an error, this vehicle is not shared with you.";
                }
            });
    }

    goToDisableAlarm() {
        this.PostCarsubmit = true;

        this.apiServ.toDisableShareAlarm(this.user_car_session)
            .then(data => {
                this.response_disable = data;
                if (this.response_disable.status == "success") {
                    this.owner_car_info = this.response_disable.shared_car;

                    NativeStorage.remove('shared_cars_touser').then(() => { }, (error) => { });
                    NativeStorage.remove('shared_count_cars').then(() => { }, (error) => { });
                    NativeStorage.setItem('shared_cars_touser', JSON.stringify(this.response_disable.shared_cars_touser)).then(() => { }, error => { });
                    NativeStorage.setItem('shared_count_cars', JSON.stringify(this.response_disable.shared_count_cars)).then(() => { }, error => { });
                    let toast = this.toast.create({
                        message: 'Alarm disable successfully!!',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.present();
                } else if (this.response_disable.status == "error" && this.response_disable.type == "Empty car id") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred the car I selected could not be foundplease try again later.";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "Error on car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "Error alarm disable") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "The alarm for this car is not enabled.";
                } else if (this.response_disable.status == "error" && this.response_disable.type == "Share disable") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "There was an error, this vehicle is not shared with you.";
                }
            });
    }

    goToDisableShare() {
        this.apiServ.toDisableShare(this.user_session)
            .then(data => {
                this.response_disable_share = data;
                if (this.response_disable_share.status == "success") {
                    this.owner_car_info = this.response_disable_share.shared_car;

                    let toast = this.toast.create({
                        message: 'Share function disable successfully!!',
                        duration: 2000,
                        position: 'middle',
                        cssClass: 'success success-message'
                    });
                    toast.onDidDismiss(() => {
                        this.goToDashboard();
                    })
                    toast.present();
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "Empty car id") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error occurred the car I selected could not be foundplease try again later.";
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "session_id") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(id).";
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "session_token") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "There was an error retrieving your car information, please try again later(token).";
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "Error on car") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "An error has occurred the car I select does not exist, please try again later.";
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "User not logged") {
                    this.wrong_session.session_id = true;
                    this.wrong_session.session_token = true;
                    this.wrong_session.user = false;
                    this.wrong_session.text = "An error occurred with the session, please try again later.";
                } else if (this.response_disable_share.status == "error" && this.response_disable_share.type == "Error share disable") {
                    this.wrong_session.session_id = false;
                    this.wrong_session.session_token = false;
                    this.wrong_session.user = true;
                    this.wrong_session.text = "The share function for this car is not enabled.";
                }
            });
    }

    goToCarLocation() {
        if (this.owner_car_info.alarm_active == false) {
            let alert = this.alert.create({
                title: 'Alarm',
                subTitle: 'It is necessary to enable the alarm to use the location function.',
                buttons: ['OK']
            });
            alert.present();
        } else {
            let modal = this.modal.create(MapPage, { 'car_info': JSON.stringify(this.owner_car_info) });
            modal.present();
        }
    }

    goToDashboard() {
        NativeStorage.remove('shared_cars_touser').then(() => { }, (error) => { });
        NativeStorage.remove('shared_count_cars').then(() => { }, (error) => { });
        NativeStorage.setItem('shared_cars_touser', JSON.stringify(this.response_disable_share.shared_cars_touser)).then(() => { }, error => { });
        NativeStorage.setItem('shared_count_cars', JSON.stringify(this.response_disable_share.shared_count_cars)).then(() => { }, error => { });

        this.viewCtrl.dismiss();
    }

}
