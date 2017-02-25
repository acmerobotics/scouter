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
  _worker: new Worker("worker.js"),
  computeStats: function(matches, callback) {
    this._worker.postMessage(matches);
    this._worker.onmessage = function(evt) {
      callback(evt.data);
    };
  }
};
