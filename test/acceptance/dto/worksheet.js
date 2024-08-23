class worksheet {
    constructor(name, fields) {
        this.name = name;
        this.fields = fields;
    }
}

class worksheetField {
    constructor(rowNo, name, value) {
        this.rowNo = rowNo;
        this.name = name;
        this.value = value;
    }

    hasName() {
        return this.name !== "";
    }
}

module.exports = { worksheet, worksheetField };