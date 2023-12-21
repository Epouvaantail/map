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

  // récuperer les données du fichier JSON
  loadData(): void {
    this.http.get('../../assets/data.json').subscribe((response:any)=> {
      this.data = response;
      return response
    });
  }

  // ajouter des données
  addData(newData:any): void {
    this.data.push(newData);
  }

  // supprimer des données
  deleteData(index:number):void {
    this.data.splice(index, 1);
  }

  // mettre à jour des données
  updateData(index: number, updatedData:any):void {
    this.data[index] = updatedData;
  }

}
