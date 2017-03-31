import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ApiService {
    response: any;

    public host: string = 'http://loccarplus.com/api';

    //Headers needed to correctly access data from the controller
    public headers = new Headers({ 'Content-Type': 'application/json' });
    public options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {

    }

    /*toGetTest() {
    return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        this.http.get(this.host + '/test_get')
            .map(res => res.json())
            .subscribe(data => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                this.response = data;
                resolve(this.response);
            });
    });
}*/

    toGetTest() {
        return Observable.interval(10000)
            .flatMap(() => this.http.get(this.host + '/test_get')
                .map(response => response.json())
            );
    }

    toGetNotification(sessionid, sessiontoken) {
        return Observable.interval(60000)
            .flatMap(() => this.http.get(this.host + '/location/get_info_car/' + sessionid + '/' + sessiontoken)
                .map(response => response.json())
            );
    }

    toPostTest(test_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/test_post', test_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    toPostTestTime(test_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/test_post', test_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    //************************* HTTP REQUEST FOR USER DATA *******************************

    /*Post method for log in user*/
    toUserLogin(login_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/login', login_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for log out user*/
    toUserLogout(logout_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/logout', logout_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for register a new user*/
    toUserRegister(register_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/register', register_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for edit data user*/
    toForgotPassword(account_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/forgot', account_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for edit data user*/
    toUpdatePassword(password_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/change_pass', password_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for edit data user*/
    toUserEdit(session_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/edit', session_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for save changes in user data*/
    toUserUpdate(user_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/user/save', user_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    //************************* HTTP REQUEST FOR CARS DATA *******************************
    /*Post method for add new cars to user logged*/
    toAddNewCars(car_info) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/add', car_info, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for get specific car for user logged*/
    toGetCarInfo(car_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/get_info_car', car_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for enable alarm and location for specific car*/
    toEnableAlarm(car_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/enable_alarm', car_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for disable alarm and location for specific car*/
    toDisableAlarm(car_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/disable_alarm', car_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for get a token for share a current car a other user*/
    toTokenShare(sessionid, sessiontoken, carid) {
        return new Promise(resolve => {
            this.http.get(this.host + '/car/enable_share/' + sessionid + '/' + sessiontoken + '/' + carid)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for validate a token and get the car info*/
    toValidateTokenShare(user_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/share_token', user_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for enable a share car to specific car*/
    toEnableShare(share_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/share_car', share_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

    /*Post method for disable a share car to specific car*/
    toDisableShare(share_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/car/disable_share', share_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for get specific shared car for user logged*/
    toGetShareCarInfo(car_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/share/get_info_car', car_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for enable alarm and location for specific shared car*/
    toEnableShareAlarm(car_share_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/share/enable_car_alarm', car_share_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }

		/*Post method for disable alarm and location for specific shared car*/
    toDisableShareAlarm(car_share_session) {
        return new Promise(resolve => {
            this.http.post(this.host + '/share/disable_car_alarm', car_share_session, this.options)
                .map(res => res.json())
                .subscribe(data => {
                    this.response = data;
                    resolve(this.response);
                });
        });
    }
}
