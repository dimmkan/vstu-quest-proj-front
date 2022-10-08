import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AngularFileUploaderModule} from "angular-file-uploader";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './pages/home/home.component';
import {CookieService} from "ngx-cookie-service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FilterPipeModule} from "ngx-filter-pipe";
import {NgxPaginationModule} from "ngx-pagination";
import { BoolPipePipe } from './pipes/bool-pipe.pipe';
import { CandidateComponent } from './pages/candidate/candidate.component';
import {ExcelService} from "./services/excel.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoolPipePipe,
    CandidateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    AngularFileUploaderModule,
    HttpClientModule,
    FilterPipeModule,
    NgxPaginationModule
  ],
  providers: [
    CookieService,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
