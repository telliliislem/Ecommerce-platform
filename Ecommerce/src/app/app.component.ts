import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ecommerce';

  Categories:any=[];
  newCategory="";

  APIURL="http://localhost:5050/";

  constructor(private http:HttpClient){}
  ngOnInit(){
    this.get_Categories();

  }

  get_Categories(){
    this.http.get(this.APIURL+"get_Categories").subscribe((res)=>{
      this.Categories=res;
    })
  }


  add_Category(){
    let body = new FormData;
    body.append("CategoryName",this.newCategory);
    this.http.post(this.APIURL+"add_Category",body).subscribe((res)=>{
      alert(res)
      this.newCategory="";
      this.get_Categories();
    })
  }
}
