import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {decode} from 'html-entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as parser from 'fast-xml-parser';



@Injectable({
  providedIn: 'root'
})
export class MetroinfoApiService {

  constructor(private http: HttpClient) { }

  getPlatformData(platformNumber: number): Observable<PlatformData> {
    return this.http.get<{ features: { attributes: { PlatformTag: number, PlatformNo: number, PlatformName: string } }[] }>(
      `https://vpn.cloventt.net/metroinfoproxy/api/gis`, {
      params: {
        platformNo: `${platformNumber}`
      },
    }).pipe(map((res) => {
      if (res.features.length < 1) {
        return null;
      }
      const platformData = new PlatformData();
      platformData.stopName = res.features[0].attributes.PlatformName;
      platformData.stopNumber = res.features[0].attributes.PlatformNo;
      platformData.stopTag = res.features[0].attributes.PlatformTag;
      return platformData;
    }));
  }

  getNextBus(stopNo: number): Observable<RouteEta[]> {
    return this.http.get(`https://vpn.cloventt.net/metroinfoproxy/api/nextbus`, {
      params: {
        PlatformTag: `${stopNo}`
      },
      responseType: 'text',
      observe: 'body'
    }).pipe(map(res => this.parseXml(res)));
  }


  private parseXml(xml: string): RouteEta[] {
    const data = parser.parse(xml, {
      attributeNamePrefix: '',
      ignoreNameSpace: false,
      ignoreAttributes: false,
    });

    const parsed = new PlatformData();
    if (data.JPRoutePositionET.Platform === undefined) {
      return [];
    }
    parsed.stopTag = data.JPRoutePositionET.Platform.PlatformTag;
    parsed.stopName = data.JPRoutePositionET.Platform.Name;
    const buses = [];
    const route = Array.isArray(data.JPRoutePositionET.Platform.Route) ?
      data.JPRoutePositionET.Platform.Route : [data.JPRoutePositionET.Platform.Route];
    route.forEach((r) => {
      const routeNumber = r.RouteNo;
      const routeName = r.Name;
      const destination = Array.isArray(r.Destination) ? r.Destination : [r.Destination];
      destination.forEach((dest) => {
        const trip = Array.isArray(dest.Trip) ? dest.Trip : [dest.Trip];
        trip.forEach((t) => {
          const routeData = new RouteEta();
          routeData.routeName = decode(routeName);
          routeData.destinationName = decode(dest.Name);
          routeData.routeNumber = decode(routeNumber);
          routeData.etaMinutes = t.ETA;
          routeData.tripNumber = t.TripNo;
          buses.push(routeData);
        });
      });
    });
    buses.sort((a, b) => a.etaMinutes - b.etaMinutes);
    return buses;
  }
}

export class PlatformData {
  stopName: string;
  stopNumber?: number;
  stopTag: number;
  buses: RouteEta[];
}

export class RouteEta {
  destinationName: string;
  routeNumber: string;
  tripNumber: number;
  routeName: string;
  etaMinutes: number;
}
