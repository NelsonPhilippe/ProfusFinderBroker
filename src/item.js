export class DofusItem {
    constructor(name, percent, dofusRune, level) {
        this.name = name;
        this.percent = percent;
        this.dofusRune = dofusRune;
        this.level = level;
    }

    getName() {
        return this.name;
    }

    getPercent() {
        return this.percent;
    }

    getDofusRune() {
        return this.dofusRune;
    }

    getLevel() {
        return this.level;
    }
}

export class DofusRune {
    constructor(rune, priceU, totalSell) {
        this.rune = rune;
        this.priceU = priceU;
        this.totalSell = totalSell;
    }

    getRune() {
        return this.rune;
    }

    getTotalSell() {
        return this.totalSell;
    }
}