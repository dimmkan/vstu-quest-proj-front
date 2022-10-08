import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CandidateComponent} from "./pages/candidate/candidate.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'candidate/:id', component: CandidateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
