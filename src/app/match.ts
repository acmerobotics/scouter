export class Match {
  redTeams: number[];
  blueTeams: number[];
  redScore: {
      auto?: number,
      tele?: number,
      end?: number,
      penalties: number,
      total: number
  };
  blueScore: {
      auto?: number,
      tele?: number,
      end?: number,
      penalties: number,
      total: number
  };

  static empty(): Match {
      let m = new Match();
      m.redTeams = [0, 0];
      m.blueTeams = [0, 0];
      m.redScore = {
          auto: 0,
          tele: 0,
          end: 0,
          penalties: 0,
          total:0
      };
      m.blueScore = {
          auto: 0,
          tele: 0,
          end: 0,
          penalties: 0,
          total:0
      };
      return m;
  }

  getTeams(): number[] {
      return [...this.redTeams, ...this.blueTeams];
  }

  isRedWinner(): boolean {
      return this.redScore.total >= this.blueScore.total;
  }

  isBlueWinner(): boolean {
      return this.blueScore.total >= this.redScore.total;
  }
}
