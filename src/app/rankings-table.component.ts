import { Component, Input, OnChanges, Directive, ElementRef, HostListener } from '@angular/core';

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
    this.updateRankings();
  }

  updateRankings() {
    console.log(this.matches);
    this.rankings = this.ftcService.getStats(this.matches);
    console.log(this.rankings);
  }

  oprReady(): boolean {
    return this.rankings[0].opr === this.rankings[0].opr;
  }

}