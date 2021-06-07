import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformData } from './metroinfo-api.service';

@Injectable({
  providedIn: 'root'
})
export class StoredConfigService {

  private innerConfig: Config;

  constructor() { }

  public update(config: Config): void {
    localStorage.setItem('appConfig', JSON.stringify(config));
    this.innerConfig = config;
  }

  public watch(): Observable<Config> {
    this.get();
    return new BehaviorSubject(this.innerConfig);
  }

  public get(): Config {
    if (this.innerConfig === undefined) {
      const storedConfig = localStorage.getItem('appConfig');
      if (storedConfig === null) {
        console.log('Initialising new config...');
        this.innerConfig = new Config();
        this.innerConfig.savedStops = [];
        this.update(this.innerConfig);
      } else {
        this.innerConfig = JSON.parse(localStorage.getItem('appConfig'));
      }
    }
    return this.innerConfig;
  }

  public clear(): void {
    localStorage.clear();
  }
}

export class Config {
  savedStops: PlatformData[];
}
