function updateRankings() {
  var $rankings = $("#rankings");
  $rankings.html("");
  comp.computeStats();
  var teams = comp.getTeams();
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var row = "<tr><td>";
    row += (i + 1) + "</td><td>";
    row += team.number + "</td><td>";
    row += team.opr.toFixed(2) + "</td><td>";
    row += team.qp + "</td><td>";
    row += team.rp + "</td></tr>";
    $rankings.append(row);
  }
}

$(document).ready(function() {
  window.table = new MatchTable(["match", "red1", "red2", "blue1", "blue2", "redScore", "blueScore"], $("#matches"));
  for (var i = 0; i < MATCH_DATA.length; i++) {
    table.add(MATCH_DATA[i]);
  }

  var $rankings = $("#rankings");
  $rankings.html("");
  var matches = table.getItems();
  var teams = Competition.computeStats(matches);
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var row = "<tr><td>";
    row += (i + 1) + "</td><td>";
    row += team.number + "</td><td>";
    row += team.opr.toFixed(2) + "</td><td>";
    row += team.qp + "</td><td>";
    row += team.rp + "</td></tr>";
    $rankings.append(row);
  }

  $("#addMatch").on("click", function(evt) {
    table.add();
  });
  // window.comp = new Competition("");
  // updateRankings();
  //
  // var match = 0;
  // var textInput = "<td><div class=\"ui input editing\"><input type=\"text\" size=\"5\"/></div></td>";
  // $("#addMatch").on("click", function(evt) {
  //   var emptyRow = "<tr data-match-num=\"" + match + "\"><td>" + (++match) + "</td>";
  //   for (var i = 0; i < 6; i++) {
  //     emptyRow += textInput;
  //   }
  //   emptyRow += "</tr>";
  //   $("#matches").append(emptyRow);
  // });
  // $("#matches").on("blur", "div.input input", function(evt) {
  //   var $this = $(this), $parent = $this.parent();
  //   $parent.html($this.val());
  //   $parent.removeClass("editing");
  // });
  // $("#matches").on("dblclick", "td", function(evt) {
  //   var $this = $(this).find("div.input");
  //   if (!$this.hasClass("editing")) {
  //     $this.html("<input type=\"text\" size=\"5\" value=\"" + $this.html() + "\"/>")
  //     $this.addClass("editing");
  //     var $input = $this.find("input");
  //     $input.focus();
  //     $input.select();
  //   }
  // });
});
