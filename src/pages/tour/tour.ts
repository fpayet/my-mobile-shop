import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TourPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  closeModal() {
    this.navCtrl.pop()
  }

}
