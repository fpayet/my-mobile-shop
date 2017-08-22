import  { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Product } from '../models/product.interface';
import { ImageService } from './image.service';
import firebase from 'firebase';

@Injectable()
export class ProductService {
  constructor(private database: AngularFireDatabase, private imageService: ImageService) {
  }

  async addProduct(product: Product, captureData: string) {
    product.timestamp = Date.now();
    let nextProductKey = this.database.list(`/products/${product.shopRef}`).push({}).key;
    if(captureData) {
      let imgSrc = `images/shops/${product.shopRef}/products/${nextProductKey}/${Date.now()}.jpg`;
      this.imageService.uploadImage(imgSrc, captureData).then((snapshot: any) => {
        product.image = snapshot.downloadURL;
        this.database.object(`/products/${product.shopRef}/${nextProductKey}`).set(product)
      })
    } else {
      this.database.object(`/products/${product.shopRef}/${nextProductKey}`).set(product)
    }
  }

  updateProduct(productRef: string, shopRef: string, productProperties: Object) {
    this.database.list(`/products/${shopRef}`).update(productRef, productProperties)
  }

  deleteProduct(product: Product) {
    return new Promise((resolve, reject) => {
      //delete data
      let removeRef = firebase.database().ref(`products/${product.shopRef}`).child(product.$key);
      removeRef.remove()
      // delete image
      let storageRef = firebase.storage().ref();
      var imageRef = storageRef.child(`images/shops/${product.shopRef}/products/${product.$key}.jpg`);
      imageRef.delete().then(function() {
        resolve(true)
      }).catch(function(error) {
        reject(error)
      });
    })
  }

  getProductList(shopKey: string, query: any = {}): FirebaseListObservable<Product[]> {
    return this.database.list(`products/${shopKey}`, { query });
  }

  getProducts(query = {} as any): any {
    let queryOpts: any = {
      preserveSnapshot: true,
      orderByChild: query.orderByChild || 'timestamp',
      limitToLast: query.limitToLast || 3
    }
    if (query.endAt) {
      queryOpts.endAt = query.endAt;
    }
    if (query.equalTo) {
      queryOpts.equalTo = query.equalTo;
    }
    let list = this.database.list('recent-products', {query: queryOpts})
    return list.map((array) => array.reverse()) as FirebaseListObservable<Product[]>
  }

  getRelatedShop(product) {
    return this.database.object(`/shops/${product.shopRef}`)
  }
}
