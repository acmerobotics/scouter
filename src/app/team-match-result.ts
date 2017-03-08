export class TeamMatchResult {
    number: number = 0;
    opr: number = 0;
    qp: number = 0;
    rp: number = 0;
    rank: number = 0;

    constructor(number: number) {
        this.number = number;
    }

    get formattedOpr() {
        return this.opr.toFixed(2);
    }
}