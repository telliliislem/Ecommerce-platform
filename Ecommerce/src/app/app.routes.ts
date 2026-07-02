import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Pages/Admin/layout/layout.component';
import { ProductsComponent } from './Pages/Admin/products/products.component';
import { CategoriesComponent } from './Pages/Admin/categories/categories.component';
import { LandingComponent } from './Pages/Website/landing/landing.component';
import { OrderComponent } from './Pages/Admin/order/order.component';
import { NgModule } from '@angular/core';
import { HouseholdComponent } from './Pages/Website/household/household.component';
import { ElectronicsComponent } from './Pages/Website/electronics/electronics.component';
import { HomeComponent } from './Pages/Website/home/home.component';
import { ClothesComponent } from './Pages/Website/clothes/clothes.component';
import { BooksComponent } from './Pages/Website/books/books.component';
import { CartComponent } from './Pages/Website/cart/cart.component';
import { LogComponent } from './Pages/Website/log/log.component';
import { SignInComponent } from './Pages/Website/sign-in/sign-in.component';
import { AccountComponent } from './Pages/Website/account/account.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full'
  },
  {
    path: 'log',
    component: LogComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'sign-in', // Make this path consistent with the link in your HTML
    component: SignInComponent // or SignUpComponent if renamed
  },
  {
    path: 'household',
    component: HouseholdComponent

  },
  {
    path: 'electronics',
    component: ElectronicsComponent

  },
  {
    path: 'home',
    component: HomeComponent

  },
  {
    path: 'clothes',
    component: ClothesComponent
  },
  {
    path: 'books',
    component: BooksComponent

  },
  {
    path: 'shop',
    component: LandingComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }