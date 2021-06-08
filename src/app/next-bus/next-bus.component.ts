import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetroinfoApiService, PlatformData as PlatformConfig, RouteEta } from '../metroinfo-api.service';
import { StoredConfigService } from '../stored-config.service';

@Component({
  selector: 'app-next-bus',
  templateUrl: './next-bus.component.html',
  styleUrls: ['./next-bus.component.scss']
})
@Injectable()
export class NextBusComponent implements OnInit {

  @Input() platformData: PlatformConfig;

  nextBuses: RouteEta[];

  dataObserverSubscription: Subscription;

  constructor(private metroinfoApi: MetroinfoApiService,
              private appConfigService: StoredConfigService) { }

  ngOnInit(): void {
    this.dataObserverSubscription = this.metroinfoApi
      .getNextBus(this.platformData.stopTag)
      .subscribe({
        next: this.handlePlatformUpdate.bind(this),
        error: this.handlePlatformUpdateError.bind(this),
      });
  }

  onDelete(): void {
    const config = this.appConfigService.get();
    config.savedStops = config.savedStops.filter((stop) => stop.stopTag !== this.platformData.stopTag);
    this.appConfigService.update(config);
    window.location.reload();
  }

  private handlePlatformUpdate(data: RouteEta[]): void {
    this.nextBuses = data.slice(0, 4);
  }

  private handlePlatformUpdateError(e: Error): void {
    console.log(e);
  }

}
