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
      const m = new Match();
      m.redTeams = [];
      m.blueTeams = [];
      m.redScore = {
          auto: 0,
          tele: 0,
          end: 0,
          penalties: 0,
          total: 0
      };
      m.blueScore = {
          auto: 0,
          tele: 0,
          end: 0,
          penalties: 0,
          total: 0
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
