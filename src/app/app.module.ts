import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PlatformViewComponent } from './platform-view/platform-view.component';
import { NextBusComponent } from './platform-view/next-bus/next-bus.component';
import { AddBusTileComponent } from './platform-view/add-bus-tile/add-bus-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    NextBusComponent,
    AddBusTileComponent,
    PlatformViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
