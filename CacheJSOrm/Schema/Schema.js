class Table{
    constructor(schjson){
        this.DefJson=schjson;
    }
    getJSON(){
        return this.DefJson;
    }
}

module.exports=Table;