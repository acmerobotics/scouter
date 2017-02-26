import { Input, Output, Component, EventEmitter, AfterContentChecked } from '@angular/core';

import { Match } from './match';



@Component({
  templateUrl: './match-table.component.html',
  selector: 'match-table'
})
export class MatchTableComponent {
  @Input() matches;
  @Output() update: EventEmitter<Match[]> = new EventEmitter();

  addMatch(): void {
    this.matches.push(new Match());
  }

  removeMatch(match): void {
    for (var i = 0; i < this.matches.length; i++) {
      if (this.matches[i] == match) {
        this.matches.splice(i, 1);
        return;
      }
    }
  }

  logMatches(): void {
    console.log(this.matches);
  }
}
