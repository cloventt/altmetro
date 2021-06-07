import { Component, Injectable, OnInit } from '@angular/core';
import { MetroinfoApiService, PlatformData } from '../metroinfo-api.service';
import { StoredConfigService } from '../stored-config.service';

@Component({
  selector: 'app-next-bus',
  templateUrl: './next-bus.component.html',
  styleUrls: ['./next-bus.component.scss']
})
@Injectable()
export class NextBusComponent implements OnInit {

  name: string;

  stopNumber = 3639;

  buses = [];

  constructor(private metroinfoApi: MetroinfoApiService,
              private appConfigService: StoredConfigService) { }

  ngOnInit(): void {
    this.metroinfoApi
      .getNextBus(this.stopNumber)
      .subscribe({
        next: this.handlePlatformUpdate.bind(this),
        error: this.handlePlatformUpdateError.bind(this),
      });
  }

  onDelete(): void {
    const config = this.appConfigService.get();
    config.savedStops.filter((stop) => stop.stopNumber !== this.stopNumber);
    this.appConfigService.update(config);
  }

  private handlePlatformUpdate(data: PlatformData): void {
    this.name = data.stopName;
    this.buses = data.buses;
  }

  private handlePlatformUpdateError(e: Error): void {
    console.log(e);
  }

}
