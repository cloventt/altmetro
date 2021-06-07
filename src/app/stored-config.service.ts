import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
      if (storedConfig === undefined) {
        console.log('Initialising new config...');
        this.innerConfig = new Config();
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
  savedStops: {
    stopNumber: number,
    stopName: string,
    routeFilters: number[],
  }[];
}
