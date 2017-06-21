import  { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Store } from '../models/store.interface';
import firebase from 'firebase';
import { ImageService } from './image.service';
import "rxjs/add/operator/map";

@Injectable()
export class StoreService {
  constructor(private database: AngularFireDatabase, private imageService: ImageService) {

  }

  addStore(store: Store, captureData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let newStoreKey = this.database.list(`stores`).push({}).key;
      if(captureData) {
        let imgSrc = `images/stores/${newStoreKey}/${Date.now()}.jpg`;
        this.imageService.uploadImage(imgSrc, captureData).then((snapshot: any) => {
          store.image = snapshot.downloadURL;
          this.updateStore(newStoreKey, store).then((data) => {
            resolve(true);
          })
        })
      } else {
        this.updateStore(newStoreKey, store).then((data) => {
          resolve(true);
        })
      }
    })
  }

  updateStore(storeKey: string, store: Store) {
    return new Promise((resolve) => {
     var updateRef = firebase.database().ref('stores').child(storeKey);
     updateRef.update(store);
     resolve(true);
   });
  }

  deleteStore(storeKey: string) {
    return new Promise((resolve, reject) => {
      // get list of products images

      // delete data
      let storeRef = firebase.database().ref(`stores`).child(storeKey);
      storeRef.remove()
      let productRef = firebase.database().ref(`products`).child(storeKey);
      productRef.remove()
      // delete image
      // let storageRef = firebase.storage().ref();
      // var imageRef = storageRef.child(`images/stores/${storeKey}/products/${productKey}.jpg`);
      // imageRef.delete().then(function() {
      //   resolve(true)
      // }).catch(function(error) {
      //   reject(error)
      // });
      resolve(true);
    })
  }

  getStore(storeKey) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/stores/' + storeKey).once('value').then((snapshot) => {
        let store = snapshot.val()
        store.$key = snapshot.key
        resolve(store)
      }, (err) => {
        reject(err);
      })
    })
  }

  getStoreList(): FirebaseListObservable<Store[]> {
    return this.database.list('stores').map((array) => array.reverse()) as FirebaseListObservable<Store[]>;
  }
}
