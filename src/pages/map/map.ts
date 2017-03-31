import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController, ViewController } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';

declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {
    @ViewChild('map') mapElement: ElementRef;

    map: any;
    mapInitialised: boolean = false;
    apiKey: string = "AIzaSyBSsNlTRz12yLvI6tXznHaebL5Ehh6q14Y";

    public marker: any;
    public content: any;
    public latlng: any;

    //Car location data
    public car_info: {
        id: number,
        alarm_active: boolean,
        shared_active: boolean,
        shared_token: string,
        user_id: number,
        car_type_id: number,
        car_type: string,
        car_model_id: number,
        car_model: string,
        long: number,
        lat: number,
        lat_last: number,
        long_last: number,
        shared_name: string
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
        shared_name: ''
    };

    constructor(public nav: NavController, public params: NavParams, public connectivityService: ConnectivityService, public platform: Platform, public alert: AlertController, public toast: ToastController, public viewCtrl: ViewController) {
        platform.ready().then(() => {
            this.car_info = JSON.parse(params.get('car_info'));

            this.loadGoogleMaps();
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    loadGoogleMaps() {
        this.addConnectivityListeners();

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
            console.log("Google maps JavaScript needs to be loaded.");
            console.log('Disable map');

            if (this.connectivityService.isOnline()) {
                console.log("online, loading map");

                //Load the SDK
                window['mapInit'] = () => {
                    this.initMap();
                    console.log('Enable map');
                }
                let script = document.createElement("script");
                script.id = "googleMaps";

                if (this.apiKey) {
                    script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
                } else {
                    script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                }
                document.body.appendChild(script);
            }
        }
        else {
            if (this.connectivityService.isOnline()) {
                console.log("showing map");
                this.initMap();
                console.log('Enable map');
            }
            else {
                console.log("disabling map");
                console.log('Disable map');
            }
        }
    }

    initMap() {
        this.mapInitialised = true;

        let latLng = new google.maps.LatLng(this.car_info.lat, this.car_info.long);
        let mapOptions = {
            center: latLng,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        if ((this.car_info.lat != this.car_info.lat_last) || (this.car_info.long != this.car_info.long_last)) {
            this.latlng = new google.maps.LatLng(this.car_info.lat_last, this.car_info.lat_last);
            this.marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.latlng
            });
            this.content = "<h5>Your " + this.car_info.car_model + "-" + this.car_info.car_type + " last location!</h5>";
            this.addInfoWindow(this.marker, this.content);
        } else {
            this.latlng = new google.maps.LatLng(this.car_info.lat_last, this.car_info.lat_last);
            this.marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.latlng
            });
            this.content = "<h5>Your " + this.car_info.car_model + "-" + this.car_info.car_type + " location!</h5>";
            this.addInfoWindow(this.marker, this.content);
        }
    }

    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }

    disableMap() {
        let alert = this.alert.create({
            title: 'Map',
            subTitle: 'Disable map',
            buttons: ['OK']
        });
        alert.present();
    }

    enableMap() {
        let alert = this.alert.create({
            title: 'Map',
            subTitle: 'Enable map',
            buttons: ['OK']
        });
        alert.present();
    }

    addConnectivityListeners() {
        let onOnline = () => {
            setTimeout(() => {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {
                    this.loadGoogleMaps();
                } else {
                    if (!this.mapInitialised) {
                        this.initMap();
                    }
                    console.log('Enable map');
                }
            }, 2000);
        };
        let onOffline = () => {
            console.log('Disable map');
        };
        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);
    }

}
