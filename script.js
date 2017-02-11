function updateRankings() {
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
}

$(document).ready(function() {
  window.table = new MatchTable(["match", "red1", "red2", "blue1", "blue2", "redScore", "blueScore"], $("#matches"));
  // for (var i = 0; i < MATCH_DATA.length; i++) {
  //   table.add(MATCH_DATA[i]);
  // }
  //
  // updateRankings();

  $("#addMatch").on("click", function(evt) {
    table.add();
  });

  $("#export").on("click", function(evt) {
    CSV.save(table.items, "match-data-" + (new Date()).getTime() + ".csv");
  })

  $("#import").on("click", function(evt) {
    var input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.addEventListener("change", function(evt) {
      var files = evt.target.files; // FileList object

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function(evt) {
          console.log(evt.target.result);
          var data = CSV.parse(evt.target.result);
          console.log(data);
          if (data[0].hasOwnProperty("TournamentMatchCode")) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].Match.indexOf("Q") == -1) {
                break;
              }
              table.add({
                red1: data[i].Red1,
                red2: data[i].Red2,
                blue1: data[i].Blue1,
                blue2: data[i].Blue2,
                redScore: data[i].RTot - data[i].RPen,
                blueScore: data[i].BTot - data[i].BPen
              });
            }
          } else {
            for (var i = 0; i < data.length; i++) {
              table.add(data[i]);
            }
          }
          updateRankings();
        };

        // Read in the image file as a data URL.
        reader.readAsText(f);
      }
    }, false);
    document.body.appendChild(input);
    input.click();
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
