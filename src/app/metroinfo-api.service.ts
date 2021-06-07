import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as parser from 'fast-xml-parser';



@Injectable({
  providedIn: 'root'
})
export class MetroinfoApiService {

  constructor(private http: HttpClient) { }

  getPlatformData(platformNumber: number): Observable<PlatformData> {
    return this.http.get<{features: {attributes: {PlatformTag: number, PlatformNo: number, PlatformName: string}}[]}>(
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
    data.JPRoutePositionET.Platform.Route.forEach((route) => {
      const routeNumber = route.RouteNo;
      const routeName = route.Name;
      const destination = Array.isArray(route.Destination) ? route.Destination : [route.Destination];
      destination.forEach((dest) => {
        const trip = Array.isArray(dest.Trip) ? dest.Trip : [dest.Trip];
        trip.forEach((t) => {
          const r = new RouteEta();
          r.routeName = routeName;
          r.routeNumber = routeNumber;
          r.etaMinutes = t.ETA;
          r.tripNumber = t.TripNo;
          buses.push(r);
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
  routeNumber: number;
  tripNumber: number;
  routeName: string;
  etaMinutes: number;
}