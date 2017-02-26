///<reference path="../../@types/numeric.d.ts"/>

import { Injectable } from '@angular/core';

import { Match } from './match';
import { TeamMatchResult } from './team-match-result';

@Injectable()
export class FtcService {
  getUniqueTeams(matches: Match[]): number[] {
    var allTeams: number[] = [];
    for (var i = 0; i < matches.length; i++) {
      var teams = matches[i].getTeams();
      for (var j = 0; j < teams.length; j++) {
        var team = teams[j];
        if (allTeams.indexOf(team) == -1) {
          allTeams.push(team);
        }
      }
    }
    return allTeams;
  }

  getStats(matches: Match[]): TeamMatchResult[] {
    var teamNums = this.getUniqueTeams(matches);
    var numTeams = teamNums.length;

    var results: TeamMatchResult[] = [];

    var indices = {};
    for (var i = 0; i < numTeams; i++) {
      indices[teamNums[i]] = i;
      results.push(new TeamMatchResult(teamNums[i]));
    }

    var A = [], b = [];
    for (var i = 0; i < numTeams; i++) {
      var temp = [];
      for (var j = 0; j < numTeams; j++) {
        temp.push(0);
      }
      A.push(temp);
      b.push(0);
    }

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      
      var baseRedScore = match.redScore.total - match.redScore.penalties;
      var baseBlueScore = match.blueScore.total - match.blueScore.penalties;

      var rp = Math.min(baseRedScore, baseBlueScore);
      var redQp;
      if (match.redScore.total == match.blueScore.total) {
        redQp = 1;
      } else if (match.redScore.total > match.blueScore.total) {
        redQp = 2;
      } else {
        redQp = 0;
      }
      var blueQp = 2 - redQp;

      for (var j = 0; j < match.redTeams.length; j++) {
        var red = indices[match.redTeams[j]];
        for (var k = 0; k < match.redTeams.length; k++) {
          A[red][indices[match.redTeams[k]]] += 1;
        }
        b[red] += baseRedScore;
        results[red].qp += redQp;
        results[red].rp += rp;
      }

      for (var j = 0; j < match.blueTeams.length; j++) {
        var blue = indices[match.blueTeams[j]];
        for (var k = 0; k < match.blueTeams.length; k++) {
          A[blue][indices[match.blueTeams[k]]] += 1;
        }
        b[blue] += baseBlueScore;
        results[blue].qp += blueQp;
        results[blue].rp += rp;
      }

    }

    var x = numeric.solve(A, b);
    for (var i = 0; i < numTeams; i++) {
      results[i].opr = x[i];
    }

    results.sort(function(a, b) {
      if (a.opr < b.opr) {
        return 1;
      } else if (a.opr > b.opr) {
        return -1;
      } else {
        return 0;
      }
    });

    return results;
  }
}
