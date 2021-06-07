import { Component, OnInit } from '@angular/core';
import { PlatformData } from '../metroinfo-api.service';
import { Config, StoredConfigService } from '../stored-config.service';

@Component({
  selector: 'app-platform-view',
  templateUrl: './platform-view.component.html',
  styleUrls: ['./platform-view.component.scss']
})
export class PlatformViewComponent implements OnInit {

  savedStops: PlatformData[];

  constructor(private appConfigService: StoredConfigService) { }

  ngOnInit(): void {
    this.appConfigService.watch()
      .subscribe({
        next: this.updateSavedStops.bind(this),
      });
  }

  updateSavedStops(data: Config): void {
    this.savedStops = data.savedStops;
  }

}
