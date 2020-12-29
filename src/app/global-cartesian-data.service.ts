import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalCartesianDataService {
  constructor(private http: HttpClient) { }

  testService(baseURL: string, reqDbOption: HttpHeaders, jobsiteName: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`, 'JobSiteId': jobsiteName
    });
    const paramsAsDesigned = new HttpParams().set('GisDataType', 'AsDesigned')
    return this.http.get<any>(baseURL + "Tracking/GetGisData", { params: paramsAsDesigned, headers: headers })

  }

  layersInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // return this.http.get<any>('https://api.mocki.io/v1/0885b6cc') // f
    return this.http.get<any>('https://api.mocki.io/v1/5aa38880') // 3 datapoint for first datapoint
    // return this.http.get<any>('https://api.mocki.io/v1/084d4a08') // 3 Structure Type

  }
}
