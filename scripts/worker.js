importScripts("/libs/numeric-1.2.6.min.js");

onmessage = function(evt) {
  var matches = evt.data;
  postMessage(computeStats(matches));
};

function computeStats(matches) {
  var teamNums = [], teamDetails = [], numTeams = 0;
  for (var i = 0; i < matches.length; i++) {
    for (var j = 0; j < 4; j++) {
      var team = matches[i][["red1", "red2", "blue1", "blue2"][j]];
      if (teamNums.indexOf(team) == -1) {
        numTeams += 1;
        teamNums.push(team);
        teamDetails.push({
          number: team,
          opr: 0,
          qp: 0,
          rp: 0
        });
      }
    }
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
    var red1 = teamNums.indexOf(match.red1);
    var red2 = teamNums.indexOf(match.red2);
    var blue1 = teamNums.indexOf(match.blue1);
    var blue2 = teamNums.indexOf(match.blue2);

    A[red1][red1] += 1;
    A[red1][red2] += 1;
    b[red1] += (match.redScore - match.redPenalty);
    A[red2][red1] += 1;
    A[red2][red2] += 1;
    b[red2] += (match.redScore - match.redPenalty);
    A[blue1][blue1] += 1;
    A[blue1][blue2] += 1;
    b[blue1] += (match.blueScore - match.bluePenalty);
    A[blue2][blue1] += 1;
    A[blue2][blue2] += 1;
    b[blue2] += (match.blueScore - match.bluePenalty);

    if (match.redScore == match.blueScore) {
      teamDetails[red1].qp += 1;
      teamDetails[red2].qp += 1;
      teamDetails[blue1].qp += 1;
      teamDetails[blue2].qp += 1;
    } else if (match.redScore > match.blueScore) {
      teamDetails[red1].qp += 2;
      teamDetails[red2].qp += 2;
    } else {
      teamDetails[blue1].qp += 2;
      teamDetails[blue2].qp += 2;
    }

    var smallerScore = match.redScore > match.blueScore ? match.blueScore : match.redScore;
    teamDetails[red1].rp += smallerScore;
    teamDetails[red2].rp += smallerScore;
    teamDetails[blue1].rp += smallerScore;
    teamDetails[blue2].rp += smallerScore;
  }

  var x = numeric.solve(A, b);
  for (var i = 0; i < numTeams; i++) {
    teamDetails[i].opr = x[i];
  }

  teamDetails.sort(function(a, b) {
    if (a.opr < b.opr) {
      return 1;
    } else if (a.opr > b.opr) {
      return -1;
    } else {
      return 0;
    }
  });

  for (var i = 0; i < teamNums; i++) {
    var diff = 0;
    if (i != 0) {
      diff = teamDetails[i - 1].opr - teamDetails[i].opr;
    }
  }
  return teamDetails;
}
