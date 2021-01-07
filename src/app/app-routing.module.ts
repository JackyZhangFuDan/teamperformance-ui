import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormlistComponent } from './formlist/formlist.component';
import { FormComponent } from './form/form.component';
import { MyratingComponent } from './myrating/myrating.component';

const routes: Routes = [
  {path:'',component:FormlistComponent},
  {path:'form', component:FormlistComponent},
  {path:'form/:id', component:FormComponent},
  {path:'myrating/:id', component:MyratingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
