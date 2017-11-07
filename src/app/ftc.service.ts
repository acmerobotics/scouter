import { Injectable } from '@angular/core';

import { Match } from './match';
import { TeamMatchResult } from './team-match-result';

import * as jsPDF from 'jspdf';

import '../../node_modules/numeric/numeric-1.2.6';

declare var numeric: any;

@Injectable()
export class FtcService {
  generateReport(rankings: TeamMatchResult[]): jsPDF {
    const doc = new jsPDF();

    return doc;
  }

  getUniqueTeams(matches: Match[]): number[] {
    const allTeams: number[] = [];
    for (let i = 0; i < matches.length; i++) {
      const teams = matches[i].getTeams();
      for (let j = 0; j < teams.length; j++) {
        const team = teams[j];
        if (allTeams.indexOf(team) === -1) {
          allTeams.push(team);
        }
      }
    }
    return allTeams;
  }

  getStats(matches: Match[]): TeamMatchResult[] {
    const teamNums = this.getUniqueTeams(matches);
    const numTeams = teamNums.length;

    const results: TeamMatchResult[] = [];

    const indices = {};
    for (let i = 0; i < numTeams; i++) {
      indices[teamNums[i]] = i;
      results.push(new TeamMatchResult(teamNums[i]));
    }

    const A = [], b = [];
    for (let i = 0; i < numTeams; i++) {
      const temp = [];
      for (let j = 0; j < numTeams; j++) {
        temp.push(0);
      }
      A.push(temp);
      b.push(0);
    }

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];

      const baseRedScore = match.redScore.total - match.redScore.penalties;
      const baseBlueScore = match.blueScore.total - match.blueScore.penalties;

      const rp = Math.min(baseRedScore, baseBlueScore);
      let redQp;
      if (match.redScore.total === match.blueScore.total) {
        redQp = 1;
      } else if (match.redScore.total > match.blueScore.total) {
        redQp = 2;
      } else {
        redQp = 0;
      }
      const blueQp = 2 - redQp;

      for (let j = 0; j < match.redTeams.length; j++) {
        const red = indices[match.redTeams[j]];
        for (let k = 0; k < match.redTeams.length; k++) {
          A[red][indices[match.redTeams[k]]] += 1;
        }
        b[red] += baseRedScore;
        results[red].qp += redQp;
        results[red].rp += rp;
      }

      for (let j = 0; j < match.blueTeams.length; j++) {
        const blue = indices[match.blueTeams[j]];
        for (let k = 0; k < match.blueTeams.length; k++) {
          A[blue][indices[match.blueTeams[k]]] += 1;
        }
        b[blue] += baseBlueScore;
        results[blue].qp += blueQp;
        results[blue].rp += rp;
      }

    }

    const x = numeric.solve(A, b);
    for (let i = 0; i < numTeams; i++) {
      results[i].opr = x[i];
    }

    results.sort(function(matchA, matchB) {
      if (matchA.opr < matchB.opr) {
        return 1;
      } else if (matchA.opr > matchB.opr) {
        return -1;
      } else {
        return 0;
      }
    });

    for (let i = 0; i < numTeams; i++) {
      results[i].rank = (i + 1);
    }

    return results;
  }
}
