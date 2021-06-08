import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { delay, repeat } from 'rxjs/operators';
import { MetroinfoApiService, PlatformData as PlatformConfig, RouteEta } from '../../metroinfo-api.service';
import { StoredConfigService } from '../../stored-config.service';

@Component({
  selector: 'app-next-bus',
  templateUrl: './next-bus.component.html',
  styleUrls: ['./next-bus.component.scss']
})
@Injectable()
export class NextBusComponent implements OnInit {

  @Input() platformData: PlatformConfig;

  nextBuses: RouteEta[];

  constructor(private metroinfoApi: MetroinfoApiService,
    private appConfigService: StoredConfigService) { }

  ngOnInit(): void {
    this.metroinfoApi
      .getNextBus(this.platformData.stopTag)
      .subscribe({
        next: this.handlePlatformUpdate.bind(this),
        error: this.handlePlatformUpdateError.bind(this),
      });

    // update every 10 seconds
    this.metroinfoApi
      .getNextBus(this.platformData.stopTag)
      .pipe(delay(10000))
      .pipe(repeat())
      .subscribe({
        next: this.handlePlatformUpdate.bind(this),
        error: this.handlePlatformUpdateError.bind(this),
      });

    window.onfocus = () => {
      this.metroinfoApi
        .getNextBus(this.platformData.stopTag)
        .subscribe({
          next: this.handlePlatformUpdate.bind(this),
          error: this.handlePlatformUpdateError.bind(this),
        });
    };
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
