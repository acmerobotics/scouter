import { Input, Output, Component, EventEmitter, AfterContentChecked, Pipe, PipeTransform, OnInit } from '@angular/core';

import { Match } from './match';



@Component({
  templateUrl: './match-table.component.html',
  selector: 'match-table'
})
export class MatchTableComponent {
  @Input() matches;

  @Output() update: EventEmitter<any> = new EventEmitter();

  addMatch(): void {
    this.matches.push(Match.empty());
    this.updateMatches();
  }

  removeMatch(match): void {
    for (var i = 0; i < this.matches.length; i++) {
      if (this.matches[i] == match) {
        this.matches.splice(i, 1);
        this.updateMatches();
        return;
      }
    }
  }

  updateMatches(): void {
    console.log("emitting");
    this.update.emit(this.matches);
  }
}

@Component({
  selector: 'editable-text',
  template: `
  <div *ngIf="editing" class="ui fluid input">
    <input (blur)="toggleEdit()" [(ngModel)]="val" type="text" />
  </div>
  <span (dblclick)="toggleEdit()" *ngIf="!editing">{{ obj[key] | join:'&nbsp;&nbsp;&nbsp;&nbsp;' }}</span>
  `
})
export class EditableTextComponent implements OnInit {
  @Input() key;
  @Input() obj;

  @Output() change: EventEmitter<any> = new EventEmitter();

  val: string;
  editing = false;
  array = false;

  ngOnInit() {
    var val = this.obj[this.key];
    if (val instanceof Array) {
      this.array = true;
      this.val = val.join(",");
    } else {
      this.val = val;
    }
  }

  toggleEdit() {
    if (this.editing) {
      var array;
      if (this.array) {
        array = this.val.split(",");
        for (var i = 0; i < array.length; i++) {
          if (!isNaN(array[i])) {
            array[i] = parseInt(array[i], 10);
          }
        }
        this.obj[this.key] = array;
      } else {
        this.obj[this.key] = this.val;
      }
      this.change.emit();
    }
    this.editing = !this.editing;
  }
}

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  transform(value: any, separator: string = " "): string {
    if (value instanceof Array) {
      return value.join(separator);
    } else {
      return value;
    }
  }
}
