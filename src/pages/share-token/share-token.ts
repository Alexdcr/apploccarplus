import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController, ViewController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { NativeStorage } from 'ionic-native';

@Component({
    selector: 'page-share-token',
    templateUrl: 'share-token.html',
    providers: [ApiService]
})
export class ShareTokenPage {
    //session data
    public user_session_info: {
        id: number,
        session_token: string
    } = {
        id: null,
        session_token: ""
    };

    sessionid: number = null;
    sessiontoken: any = "";
    carid: number = null;

    //post request
    public response: any;

		token_share: string = "";

    tokenInterval: any;
    plaseshow: boolean = true;

    constructor(public nav: NavController, public params: NavParams, public apiServ: ApiService, public platform: Platform, public alert: AlertController, public viewCtrl: ViewController, public toast: ToastController) {
        platform.ready().then(() => {
            if (JSON.parse(this.params.get('car_id'))) {
                this.carid = JSON.parse(this.params.get('car_id'));
            } else {
                this.carid = 0;
            }
            NativeStorage.getItem('user_session_info').then(
                (data_session) => {
                    this.user_session_info = JSON.parse(data_session);
                    this.sessionid = this.user_session_info.id;
                    this.sessiontoken = this.user_session_info.session_token;

										//For get first token
										this.goToGetToken();
                    //For update the token every 90 sec
                    let timeBetweenCalls = 90000;

                    this.tokenInterval = setInterval(() => {
                        this.goToGetToken();
                    }, timeBetweenCalls);
                },
                (error) => { });

        });
    }

		goToGetToken() {
			this.apiServ.toTokenShare(this.sessionid, this.sessiontoken, this.carid)
					.then(data => {
							this.response = data;
							this.token_share = this.response.token_share;
							this.plaseshow = false;
					});
		}

    dismiss() {
        clearInterval(this.tokenInterval);
        this.viewCtrl.dismiss();
    }

}
