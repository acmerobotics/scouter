import { Input, Output, Component, EventEmitter, AfterContentChecked, Pipe, PipeTransform, OnInit, ElementRef } from '@angular/core';

import { MatchParserService } from './match-parser.service';

import { Match } from './match';

import { CSV } from './csv';

@Component({
  templateUrl: './match-table.component.html',
  selector: 'match-table',
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

  downloadMatchData() {
    var a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    var blob = new Blob([JSON.stringify(this.matches)], { type: 'octet/stream' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "matches.json";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importMatchData() {
    var this_ = this;
    var input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.addEventListener("change", function(evt) {
      var files = input.files; // FileList object

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function(evt) {
          var contents: string = reader.result;
          console.log(contents);
          if (contents.charAt(0) == "[") {
            this_.matches = [];
            var data = JSON.parse(contents);
            for (var i = 0; i < data.length; i++) {
              var m = new Match();
              for (var key in data[i]) {
                m[key] = data[i][key];
              }
              this_.matches.push(m);
            }
          } else {
            this_.matches = this_.matchParser.parseCSV(contents);
          }
          console.log("import");
          console.log(this_.matches);
          this_.updateMatches();
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
  selector: 'editable-num',
  template: `
  <div *ngIf="editing" class="ui fluid input">
    <input (blur)="toggleEdit()" [(ngModel)]="val" type="text" style="width: 100%;" />
  </div>
  <span (dblclick)="toggleEdit()" *ngIf="!editing">{{ obj[key] | join:'&nbsp;&nbsp;&nbsp;&nbsp;' }}</span>
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
    var val = this.obj[this.key];
    if (val instanceof Array) {
      this.array = true;
      this.val = val.join(",");
    } else {
      this.val = val;
    }
  }

  toggleEdit() {
    console.log("toggle edit");
    if (this.editing) {
      if (this.val === "") {
        return;
      }
      if (this.array) {
        var array = this.val.split(",");
        for (var i = 0; i < array.length; i++) {
          var val = parseInt(array[i], 10);
          if (val != val) {
            console.log("invalid: " + this.val);
            return;
          }
        }
        this.obj[this.key] = array;
      } else {
        var val = parseInt(this.val, 10);
        if (val != val) {
          console.log("invalid: " + this.val);
          return;
        }
        this.obj[this.key] = val;
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
