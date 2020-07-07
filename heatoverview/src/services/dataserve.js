import * as d3 from 'd3'
class Service {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        return this
    }
    get_json_data(callback, filename) {
        let that = this;
        if (DataService[filename]) {
            that[callback](DataService[filename])
        }
        d3.json("static/" + filename + ".json").then(function(data) {
            if (data["data"]) {
                data = data["data"]
            }
            DataService[filename] = data;
            that[callback](data)
        })
    }
}
const DataService = new Service()
export default DataService