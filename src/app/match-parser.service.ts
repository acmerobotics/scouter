import { Injectable } from '@angular/core';

import { Match } from './match';

import { CSV } from './csv';

@Injectable()
export class MatchParserService {
    parseCSV(data: string): Match[] {
        var matches: Match[] = [];
        let rows = CSV.parse(data);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.Match.indexOf("Q") == -1) continue;
            var match = new Match();
            match.redTeams = [ row.Red1, row.Red2 ];
            match.blueTeams = [ row.Blue1, row.Blue2 ];
            if (row.Red3 != 0) match.redTeams.push(row.Red3);
            if (row.Blue3 != 0) match.blueTeams.push(row.Blue3);
            match.redScore = {
                auto: row.RAuto,
                tele: row.RTele,
                end: row.REnd,
                penalties: row.RPen,
                total: row.RTot
            };
            match.blueScore = {
                auto: row.BAuto,
                tele: row.BTele,
                end: row.BEnd,
                penalties: row.BPen,
                total: row.BTot
            };
            matches.push(match);
        }
        return matches;
    }
}