export class CSV {
  static parse(str) {
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
  }

  static stringify(items) {
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
  }

  static save(data, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var csv = CSV.stringify(data),
        blob = new Blob([csv], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
