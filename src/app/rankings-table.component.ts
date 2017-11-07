import { Component, Input, OnChanges, Directive, ElementRef, HostListener } from '@angular/core';

import { FtcService } from './ftc.service';

import { Match } from './match';

declare var jsPDF: any;

const REPORT_COLUMNS = [
  { title: 'Rank', dataKey: 'rank' },
  { title: 'Team', dataKey: 'number' },
  { title: 'OPR', dataKey: 'formattedOpr' },
  { title: 'QP', dataKey: 'qp' },
  { title: 'RP', dataKey: 'rp' }
];

@Component({
  templateUrl: './rankings-table.component.html',
  selector: 'app-rankings-table',
  providers: [FtcService]
})
export class RankingsTableComponent implements OnChanges {
  @Input() matches;
  rankings = [];

  constructor(private ftcService: FtcService) { }

  ngOnChanges() {
    this.updateRankings();
  }

  downloadRankings() {
    const doc = new jsPDF();
    doc.text('Rankings', 15, 25);
    doc.autoTable(REPORT_COLUMNS, this.rankings, {
      startY: 35
    });
    doc.save('report.pdf');
  }

  updateRankings() {
    console.log(this.matches);
    this.rankings = this.ftcService.getStats(this.matches);
    console.log(this.rankings);
  }

  oprReady(): boolean {
    return this.rankings.length > 0 && this.rankings[0].opr === this.rankings[0].opr;
  }

}