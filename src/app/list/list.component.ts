import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})


export class ListComponent {
  data:any;

  constructor(private appcomponent: AppComponent) { }
  ngOnInit(): void {
    this.data = this.appcomponent.loadData();
    this.data = this.appcomponent.data;
    function onSubmit(formValue: {first: String, last: string}) {
    }
  }
}
