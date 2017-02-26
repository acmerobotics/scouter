export class Match {
  redTeams: number[] = [];
  blueTeams: number[] = [];
  redScore: {
      auto?: number,
      tele?: number,
      end?: number,
      penalties: number,
      total: number
  } = {
      penalties: 0,
      total: 0
  };
  blueScore: {
      auto?: number,
      tele?: number,
      end?: number,
      penalties: number,
      total: number
  } = {
      penalties: 0,
      total: 0
  };

  getTeams(): number[] {
      return [...this.redTeams, ...this.blueTeams];
  }
}
