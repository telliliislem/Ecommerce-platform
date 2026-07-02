import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { HouseholdComponent } from './Pages/Website/household/household.component';
import { ElectronicsComponent } from './Pages/Website/electronics/electronics.component';
import { BooksComponent } from './Pages/Website/books/books.component';
import { HomeComponent } from './Pages/Website/home/home.component'; 
import { LogComponent } from './Pages/Website/log/log.component';
import { ProductCardComponent } from './Pages/Website/product-card/product-card.component';
import { ClothesComponent } from './Pages/Website/clothes/clothes.component';
import { SignInComponent } from './Pages/Website/sign-in/sign-in.component';
@NgModule({
  declarations: [
    AppComponent,
    HouseholdComponent,
    ElectronicsComponent,
    ClothesComponent,
    BooksComponent,
    HomeComponent,
    ProductCardComponent,
    LogComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'category/household', component: HouseholdComponent },
      { path: 'category/electronics', component: ElectronicsComponent },
      { path: 'category/clothes', component: ClothesComponent },
      { path: 'category/books', component: BooksComponent },
      { path: 'category/home', component: HomeComponent },
      { path: 'login', component: LogComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
