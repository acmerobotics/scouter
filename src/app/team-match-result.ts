export class TeamMatchResult {
    number = 0;
    opr = 0;
    qp = 0;
    rp = 0;
    rank = 0;

    constructor(number: number) {
        this.number = number;
    }

    get formattedOpr() {
        return this.opr.toFixed(2);
    }
}
