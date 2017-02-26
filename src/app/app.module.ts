import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { MatchTableComponent } from './match-table.component';
import { RankingsTableComponent } from './rankings-table.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchTableComponent,
    RankingsTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
