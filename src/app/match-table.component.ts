import { Input, Output, Component, EventEmitter, AfterContentChecked, Pipe, PipeTransform, OnInit, ElementRef } from '@angular/core';

import { MatchParserService } from './match-parser.service';

import { Match } from './match';

import { CSV } from './csv';

@Component({
  templateUrl: './match-table.component.html',
  selector: 'app-match-table',
  providers: [MatchParserService]
})
export class MatchTableComponent {
  @Input() matches;

  @Output() update: EventEmitter<Match[]> = new EventEmitter();

  constructor(private matchParser: MatchParserService) { }

  addMatch(): void {
    this.matches.push(Match.empty());
    this.updateMatches();
  }

  removeMatch(match): void {
    for (let i = 0; i < this.matches.length; i++) {
      if (this.matches[i] === match) {
        this.matches.splice(i, 1);
        this.updateMatches();
        return;
      }
    }
  }

  updateMatches(): void {
    this.update.emit(this.matches);
  }

  downloadMatchData() {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    const blob = new Blob([JSON.stringify(this.matches)], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'matches.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importMatchData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.addEventListener('change', (evt) => {
      const files = input.files;

      for (let i = 0, f; f = files[i]; i++) {
        const reader = new FileReader();

        reader.onload = (readerEvt) => {
          const contents: string = reader.result.trim();
          if (contents.charAt(0) === '[') {
            this.matches = [];
            const data = JSON.parse(contents);
            for (let j = 0; j < data.length; j++) {
              const m = new Match();
              for (const key in data[j]) {
                if (data[j].hasOwnProperty(key)) {
                  m[key] = data[j][key];
                }
              }
              this.matches.push(m);
            }
          } else if (contents.charAt(0) === '<') {
            this.matches = this.matchParser.parseHTML(contents);
          } else {
            this.matches = this.matchParser.parseCSV(contents);
          }
          this.updateMatches();
        };

        // Read in the image file as a data URL.
        reader.readAsText(f);
      }
    }, false);
    document.body.appendChild(input);
    input.click();
  }
}

@Component({
  selector: 'app-editable-num',
  template: `
  <div *ngIf='editing' class='ui fluid input'>
    <input (blur)='toggleEdit()' [(ngModel)]='val' type='text' style='width: 100%;' />
  </div>
  <span (dblclick)='toggleEdit()' *ngIf='!editing'>{{ obj[key] | join:'&nbsp;&nbsp;&nbsp;&nbsp;' }}</span>
  `
})
export class EditableNumberComponent implements OnInit {
  @Input() key;
  @Input() obj;

  @Output() change: EventEmitter<any> = new EventEmitter();

  val: string;
  editing = false;
  array = false;

  ngOnInit() {
    const val = this.obj[this.key];
    if (val instanceof Array) {
      this.array = true;
      this.val = val.join(',');
    } else {
      this.val = val;
    }
  }

  toggleEdit() {
    if (this.editing) {
      if (this.val === '') {
        return;
      }
      if (this.array) {
        const array: any[] = this.val.split(',');
        for (let i = 0; i < array.length; i++) {
          const parsedVal = parseInt(array[i], 10);
          if (isNaN(parsedVal)) {
            return;
          }
          array[i] = parsedVal;
        }
        this.obj[this.key] = array;
      } else {
        const parsedVal = parseInt(this.val, 10);
        if (isNaN(parsedVal)) {
          return;
        }
        this.obj[this.key] = parsedVal;
      }
      this.change.emit();
    }
    this.editing = !this.editing;
  }
}

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  transform(value: any, separator: string = ' '): string {
    if (value instanceof Array) {
      return value.join(separator);
    } else {
      return value;
    }
  }
}
