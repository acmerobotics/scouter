import { Component, Input, OnChanges } from '@angular/core';

import { FtcService } from './ftc.service';

@Component({
  templateUrl: './rankings-table.component.html',
  selector: 'rankings-table',
  providers: [FtcService]
})
export class RankingsTableComponent implements OnChanges {
  @Input() matches;
  rankings = [];

  constructor(private ftcService: FtcService) { }

  ngOnChanges() {
    console.log("on changes");
    this.computeRankings();
  }

  computeRankings() {
    this.rankings = this.ftcService.getStats(this.matches);
    console.log(this.rankings);
  }
}
