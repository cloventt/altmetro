import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NextBusComponent } from './next-bus/next-bus.component';
import { AddBusTileComponent } from './add-bus-tile/add-bus-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    NextBusComponent,
    AddBusTileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
