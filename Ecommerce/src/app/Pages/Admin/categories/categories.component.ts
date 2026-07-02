import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  APIURL = "http://localhost:5050/";
  newCategoryName: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.get_Categories();
  }

  get_Categories(): void {
    this.http.get(this.APIURL + 'get_Categories').subscribe((res: any) => {
      this.categories = res;
    });
  }

  addCategory(){
    console.log("hello")
    let body=new FormData();
    body.append('CategoryName', this.newCategoryName);
    console.log(this.newCategoryName)
    this.http.post(this.APIURL+"add_Category",body).subscribe((res)=>{
      alert(res)
    })
  }

    deleteCategory(category: any){
      this.http.delete(this.APIURL + `delete_Category?CategoryId=${category.CategoryId}`).subscribe((res) => {
        const index = this.categories.indexOf(category);
        if (index !== -1) {
          this.categories.splice(index, 1);
        }
      });
    }
}