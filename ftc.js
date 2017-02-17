var CSV = {
  parse: function(str) {
    var lines = str.split("\n");
    var items = [];
    var header = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var item = {};
      var parts = lines[i].split(",");
      for (var j = 0; j < parts.length; j++) {
        var part = parts[j];
        if (part == "") {
          continue;
        }
        if (!isNaN(parseInt(part, 10))) {
          part = parseInt(part, 10);
        }
        item[header[j]] = part;
      }
      if (item == {}) {
        continue;
      }
      items.push(item);
    }
    return items;
  },
  stringify: function(items) {
    var str = "";
    var header = [];
    var firstItem = items[0];
    for (var key in firstItem) {
      if (firstItem.hasOwnProperty(key)) {
        header.push(key);
        str += key + ",";
      }
    }
    for (var i = 0; i < items.length; i++) {
      str += "\n";
      for (var j = 0; j < header.length; j++) {
        str += items[i][header[j]] + ",";
      }
    }
    return str;
  },
  save: function (data, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var csv = CSV.stringify(data),
        blob = new Blob([csv], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

JSON.values = function(data) {
  var vals = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      vals.push(data[key]);
    }
  }
  return vals;
}

var INPUT_HTML = '<input type="text" style="width: 100%" />';

function MatchTable(schema, $tbody) {
  this.schema = schema;
  this.items = [];
  this.$tbody = $tbody;

  var this_ = this;
  this.$tbody.on("blur", "div.input input", function(evt) {
    var $this = $(this);
    var val = $this.val();
    if (this_.isValid(val)) {
      var $parent = $this.parent();
      var $td = $parent.parent();
      this_.items[this_.getRow($td)][this_.schema[this_.getCol($td)]] = parseInt(val, 10);
      $parent.html(val);
      $parent.removeClass("editing");
      updateRankings();
    }
  });

  this.$tbody.on("dblclick", "td", function(evt) {
    var $this = $(this).find("div.input");
    var val = $this.html();
    if (!$this.hasClass("editing")) {
      $this.html(INPUT_HTML);
      $this.addClass("editing");
      var $input = $this.find("input");
      $input.val(val);
      $input.focus();
      $input.select();
    }
  });
}
MatchTable.prototype = {
  add: function(data) {
    var html = "<tr><td>" + (this.items.length + 1) + "</td>";

    if (typeof data == "undefined") {
      data = {};
      for (var i = 1; i < this.schema.length; i++) {
        html += '<td><div class="ui input editing">' + INPUT_HTML + '</td></div>';
        data[this.schema[i]] = 0;
      }
    } else {
      for (var i = 1; i < this.schema.length; i++) {
        html += '<td><div class="ui input">' + data[this.schema[i]] + '</td></div>';
      }
    }
    this.items.push(data);

    html += "</tr>";

    this.$tbody.append(html);
  },
  remove: function(index) {
    this.items.splice(index, 1);
    this.$tbody.find('tr').each(function(i, el) {
      if (index == i) {
        $(el).remove();
      }
    });
  },
  size: function() {
    return this.items.length;
  },
  isValid: function(input) {
    return input.match(/^\d+\*?$/);
  },
  getItems: function() {
    return this.items;
  },
  getCol: function($el) {
    return $el.parent().children().index($el);
  },
  getRow: function($el) {
    return $el.parent().parent().children().index($el.parent());
  }
};

var Competition = {
  computeStats: function(matches) {
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

    console.log(teamNums);

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

    var startTime = (new Date()).getTime();
    var x = numeric.solve(A, b);
    console.log("solution took " + ((new Date()).getTime() - startTime) + "ms");
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
      console.log((i + 1) + ".\t\t" + teamDetails[i].number + " \t\t" + teamDetails[i].opr.toFixed(2) + "\t\t-" + diff.toFixed(2));
    }
    return teamDetails;
  }
};
