export class CSV {
  static parse(str) {
    const lines = str.split('\n');
    const items = [];
    const header = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const item = {};
      const parts = lines[i].split(',');
      for (let j = 0; j < parts.length; j++) {
        let part = parts[j];
        if (part === '') {
          continue;
        }
        if (!isNaN(parseInt(part, 10))) {
          part = parseInt(part, 10);
        }
        item[header[j]] = part;
      }
      if (item === {}) {
        continue;
      }
      items.push(item);
    }
    return items;
  }

  static stringify(items) {
    let str = '';
    const header = [];
    const firstItem = items[0];
    for (const key in firstItem) {
      if (firstItem.hasOwnProperty(key)) {
        header.push(key);
        str += key + ',';
      }
    }
    for (let i = 0; i < items.length; i++) {
      str += '\n';
      for (let j = 0; j < header.length; j++) {
        str += items[i][header[j]] + ',';
      }
    }
    return str;
  }

  static save(data, fileName) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const csv = CSV.stringify(data);
    const blob = new Blob([csv], {type: 'octet/stream'});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
