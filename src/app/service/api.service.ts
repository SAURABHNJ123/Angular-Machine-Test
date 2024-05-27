import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment.ts/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  addProfileData(profileData: any): Observable<any> {
    debugger;
    return this._http.post<any>(`${this.apiUrl}profile`, profileData);
  }
  addProfileImage(profileData: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}profileImg`, profileData);
  }
  getUsers(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}profile`);
  }
  uploadProfileImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
    return this._http.put(`${this.apiUrl}/${id}`, formData);
  }

  updateData(formData: any): Observable<any> {
    const itemId = formData.id;
    const updateData = {
      name: formData.name,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      age: formData.age,
      country: formData.country,
      state: formData.state,
      address: formData.address,
      tags: [formData.tags],
      subscribe: formData.subscribe,
      id: formData.id
    };
    const url = `${this.apiUrl}profile/${itemId}`;

    return this._http.put(url, updateData);
  }
}
