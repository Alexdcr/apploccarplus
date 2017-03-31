import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ModalController } from 'ionic-angular';
import { ShareAddPage } from '../share-add/share-add';
import { SharedCarInfoPage } from '../shared-car-info/shared-car-info';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-share-cars',
    templateUrl: 'share-cars.html',
    providers: [ApiService]
})
export class ShareCarsPage {
    //cars variables
    public shared_count_cars: number;

    public shared_user_cars: {
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

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public modal: ModalController) {
        platform.ready().then(() => {
            NativeStorage.getItem('shared_cars_touser').then(
                (data_shared_cars_touser) => {
                    this.shared_user_cars = JSON.parse(data_shared_cars_touser);
                },
                (error) => { });

            NativeStorage.getItem('shared_count_cars').then(
                (data_shared_count_cars) => {
                    this.shared_count_cars = JSON.parse(data_shared_count_cars);
                },
                (error) => { });
        });
    }

    goToAddCar() {
        let modal = this.modal.create(ShareAddPage);
        modal.onDidDismiss(() => {
            NativeStorage.getItem('shared_cars_touser').then(
                (data_shared_cars_touser) => { this.shared_user_cars = JSON.parse(data_shared_cars_touser) },
                (error) => { });
            NativeStorage.getItem('shared_count_cars').then(
                (data_shared_count_cars) => { this.shared_count_cars = JSON.parse(data_shared_count_cars) },
                (error) => { });
        });
        modal.present();
    }

    goToCarInfo(car_id) {
        let modal = this.modal.create(SharedCarInfoPage, { 'car_id': car_id });
        modal.onDidDismiss(() => {
            NativeStorage.getItem('shared_cars_touser').then(
                (data_shared_cars_touser) => { this.shared_user_cars = JSON.parse(data_shared_cars_touser) },
                (error) => { });
            NativeStorage.getItem('shared_count_cars').then(
                (data_shared_count_cars) => { this.shared_count_cars = JSON.parse(data_shared_count_cars) },
                (error) => { });
        });
        modal.present();
    }

}
