// Srt timestamp to seconds
function srtToTime(time: string) {
  console.log(time);
  const [hours, minutes, seconds] = time.split(':');
  const h = Number(hours)*60*60;
  const m = Number(minutes)*60;
  const s = Number(seconds.replace(',', '.'));

  return h+m+s;
}

// Seconds to srt timestamp
function timeToSrt(seconds: number) {
  const hours = Math.floor(seconds / 60 / 60);
  seconds -= hours * 60 * 60;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const h = ('00'+hours).slice(-2); // zero-padded hours
  const m = ('00'+minutes).slice(-2); // zero-padded minutes
  const s = ('00'+seconds.toFixed(3)).slice(-6).replace('.', ','); // zero-padded hours, with ',' indicating decimal places

  return h + ':' + m + ':' + s;
}

class Parser {
  private lines;
  private curr = 0;

  constructor(txt: string) {
    this.lines = txt.replace('\r', '').split('\n');
  }

  public expectID() {
    const n = Number(this.lines[this.curr]);
    this.curr++;
    return n;
  }

  public expectTimestamps() {
    const [start, end] = this.lines[this.curr].split(' --> ');
    this.curr++;
    return [srtToTime(start), srtToTime(end)];
  }

  public expectText() {
    let t = this.lines[this.curr];
    this.curr++;
    // Concatenate line breaks
    while (this.curr < this.lines.length && this.lines[this.curr] != '') {
      t += '\n' + this.lines[this.curr];
      this.curr++;
    }
    // Skip blank lines
    while (this.lines[this.curr] == '') {
      this.curr++;
    }
    return t;
  }

  public hasFinished() {
    return this.curr >= this.lines.length;
  }
}

export function parse(contents: string) {
  const parser = new Parser(contents);
  const res = [];

  // window.parser = parser;

  while (!parser.hasFinished()) {
    const id = parser.expectID();
    const [start, end] = parser.expectTimestamps();
    const text = parser.expectText();

    res.push({
      id,
      start,
      end,
      text
    });
  }

  return res;
}

export function write(cues: {start: number, end: number, text: string}[]) {
  let srt = '';
  let id = 1;
  for (const cue of cues) {
    srt += `${id}\n`;
    srt += `${timeToSrt(cue.start)} --> ${timeToSrt(cue.end)}\n`;
    srt += `${cue.text}\n`;
    srt += '\n';
    id++;
  }
  return srt;
}