import { Injectable } from '@angular/core';
import * as CryptoJs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureLocalStorageService {
  private ENCRYPTION_PASSWORD: string = 'super_s3cr3t_key';

  constructor() { }
  removeItem(key: string) {
    localStorage.removeItem(key);
  }
  
  setItem(key: string, value: any) {
    let encryptedValue = CryptoJs.AES.encrypt(value, this.ENCRYPTION_PASSWORD).toString();
    console.log('encrypted value', encryptedValue);
    localStorage.setItem(key, encryptedValue);
  }

  getItem(key: string): any {
    let encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      let decryptedValue = CryptoJs.AES.decrypt(encryptedValue, this.ENCRYPTION_PASSWORD).toString(CryptoJs.enc.Utf8);
      console.log('decrypted value', decryptedValue);
      return decryptedValue;
    }
    return undefined;
  }
}
