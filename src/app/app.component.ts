import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'map';
  data: any = [];

  constructor(private http: HttpClient) { }

  loadData(): void {
    this.http.get('../../assets/data.json').subscribe((response:any)=> {
      this.data = response;
      console.log(this.data)
      return response
    });
  }

  addData(newData:any): void {
    this.data.push(newData);
  }

  deleteData(index:number):void {
    this.data.splice(index, 1);
  }

  updateData(index: number, updatedData:any):void {
    this.data[index] = updatedData;
  }

}
