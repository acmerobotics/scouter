import { Component, OnInit } from '@angular/core';

import { MatchParserService } from './match-parser.service';

import { CSV } from './csv';

import { Match } from './match';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MatchParserService]
})
export class AppComponent {
  matches: Match[] = [];

  constructor(private matchParser: MatchParserService) { }

}
