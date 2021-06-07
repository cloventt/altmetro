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

  getNextBus(stopNo: number): Observable<PlatformData> {
    return this.http.get(`https://vpn.cloventt.net/metroinfoproxy/api/nextbus`, {
      params: {
        PlatformTag: `${stopNo}`
      },
      responseType: 'text',
      observe: 'body'
    }).pipe(map(res => this.parseXml(res)));
  }

  private parseXml(xml: string): PlatformData {
    const data = parser.parse(xml, {
      attributeNamePrefix: '',
      ignoreNameSpace: false,
      ignoreAttributes: false,
    });

    const parsed = new PlatformData();
    parsed.stopNo = data.JPRoutePositionET.Platform.PlatformTag;
    parsed.stopName = data.JPRoutePositionET.Platform.Name;
    parsed.buses = [];
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
          parsed.buses.push(r);
        });
      });
    });
    parsed.buses = parsed.buses.sort((a, b) => a.etaMinutes - b.etaMinutes);
    return parsed;
  }
}

export class PlatformData {
  stopName: string;
  stopNo: number;
  buses: RouteEta[];
}

export class RouteEta {
  routeNumber: number;
  tripNumber: number;
  routeName: string;
  etaMinutes: number;
}
