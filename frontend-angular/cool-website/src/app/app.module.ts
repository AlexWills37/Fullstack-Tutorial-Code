import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContestBarComponent } from './contest-bar/contest-bar.component';
import { ContestItemComponent } from './contest-item/contest-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ContestBarComponent,
    ContestItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
