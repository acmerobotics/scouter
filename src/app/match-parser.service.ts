import { Injectable } from '@angular/core';

import { Match } from './match';

import { CSV } from './csv';

@Injectable()
export class MatchParserService {
    parseCSV(data: string): Match[] {
        const matches: Match[] = [];
        const rows = CSV.parse(data);
        for (let i = 0; i < rows.length - 1; i++) {
            const row = rows[i];
            if (row.Match.indexOf('Q') === -1) {
                continue;
            }
            const match = new Match();
            match.redTeams = [ row.Red1, row.Red2 ];
            match.blueTeams = [ row.Blue1, row.Blue2 ];
            if (row.Red3 !== 0) {
                match.redTeams.push(row.Red3);
            }
            if (row.Blue3 !== 0) {
                match.blueTeams.push(row.Blue3);
            }
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

    parseHTML(data: string): Match[] {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const matches: Match[] = [];

        const tables = doc.getElementsByTagName('table');
        for (let i = 0; i < tables.length; i++) {
            const m = this.parseTable(tables[i]);
            for (let j = 0; j < m.length; j++) {
                matches.push(m[j]);
            }
        }

        return matches;
    }

    parseTable(table: HTMLElement): Match[] {
        const matches: Match[] = [];
        const rows = table.getElementsByTagName('tr');
        const th = rows[0].getElementsByTagName('th')[0];
        if (th === undefined) {
            // do nothing
        } else if (th.innerHTML === 'Match') {
            // abbreviated
            for (let i = 1; i < rows.length;) {
                const firstRow = rows[i].getElementsByTagName('td');
                const secondRow = rows[i + 1].getElementsByTagName('td');
                const m = Match.empty();
                m.redTeams = [
                    parseInt(firstRow[2].innerHTML, 10),
                    parseInt(secondRow[0].innerHTML, 10)
                ];
                m.blueTeams = [
                    parseInt(firstRow[3].innerHTML, 10),
                    parseInt(secondRow[1].innerHTML, 10)
                ];
                const results = firstRow[1].innerHTML.split(' ')[0].split('-');
                m.redScore.total = parseInt(results[0], 10);
                m.blueScore.total = parseInt(results[1], 10);
                matches.push(m);
                if (firstRow[0].innerHTML.startsWith('Q')) {
                    i += 2;
                } else {
                    // i += 3;
                    break;
                }
            }
        } else if (rows.length >= 2) {
            // details
            const firstCell = rows[1].getElementsByTagName('th')[0];
            if (firstCell !== undefined && firstCell.innerHTML === 'Match') {
                for (let i = 2; i < rows.length; i++) {
                    const row = rows[i].getElementsByTagName('td');
                    if (!row[0].innerHTML.startsWith('Q')) {
                        break;
                    }
                    const m = Match.empty();
                    const redTeams = row[2].innerHTML.split(' ');
                    const blueTeams = row[3].innerHTML.split(' ');
                    for (let j = 0; j < redTeams.length - 1; j++) {
                        m.redTeams.push(parseInt(redTeams[j], 10));
                        m.blueTeams.push(parseInt(blueTeams[j], 10));
                    }
                    m.redScore = {
                        total: parseInt(row[4].innerHTML, 10),
                        auto: parseInt(row[5].innerHTML, 10),
                        tele: parseInt(row[7].innerHTML, 10),
                        end: parseInt(row[8].innerHTML, 10),
                        penalties: parseInt(row[9].innerHTML, 10)
                    };
                    m.blueScore = {
                        total: parseInt(row[10].innerHTML, 10),
                        auto: parseInt(row[11].innerHTML, 10),
                        tele: parseInt(row[13].innerHTML, 10),
                        end: parseInt(row[14].innerHTML, 10),
                        penalties: parseInt(row[15].innerHTML, 10)
                    };
                    matches.push(m);
                }
            }
        }
        return matches;
    }
}
