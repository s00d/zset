class ZSet {
    constructor(init = {}) {
        this.data = {};
        this.add(init)
    }

    add(data = {}, score = 1) {
        for (let key in data) {
            this.data[key] = {score: score, key: key, data: data[key]}
        }
    }

    set(key, data, score = 1) {
        let obj = {};
        obj[key] = data;
        this.add(obj, score)
    }

    incr(key, score = 1) {
        this.data[key].score += score
    }

    del(key) {
        delete this.data[key]
    }

    get(min = false, max = false, filter = false) {
        let sortable = [];
        for (let i in this.data) {
            if (min !== false && this.data[i].score < min) continue;
            if (max !== false && this.data[i].score > max) continue;
            if (filter !== false) {
                if (!filter.test(i)) continue;
                if (typeof this.data[i].data === 'string' && !filter.test(this.data[i].data)) continue;
            }
            sortable.push(this.data[i]);
        }
        sortable.sort(function (a, b) {
            return a.score - b.score;
        });

        return sortable
    }

    search(path, check = false) {
        path = path.split('.');
        let sort = this.get();
        for (let item of sort) {
            let select = item.data;
            let end = false;
            for (let key of path) {
                if(key === '_') {
                    for(let country in select) {
                        if (select[country].hasOwnProperty(key)) return item
                    }
                    break;
                }
                if (!select.hasOwnProperty(key)) {
                    end = false;
                    break;
                }

                select = select[key];
                end = true;
            }
            if (end) {
                if (typeof check === "function" && !check(select)) continue;
                return item
            }
        }
        return false
    }

    searchService(service, check = false) {
        let sort = this.get();
        for (let item of sort) {
            for(let country in item.data) {
                if (item.data[country].hasOwnProperty(service)) {
                    if(typeof check !== "function" || !check(item.data[country])) {
                        return {country: country, item: item }
                    }
                }
            }
        }
        return false
    }

    exec(func) {
        let sort = this.get();
        for (let item of sort) {
            if (!func(select)) continue;
            return item
        }
        return false
    }

    restart(def = 1, key = false) {
        if(key) {
            this.data[key].score = def
        } else {
            Object.keys(this.data).forEach(i => this.data[i].score = def)
        }
    }

    clear() {
        this.data = {};
    }

    cond(inv = false) {
        let result = null;
        for (let i in this.data) {
            if (result === null) result = this.data[i];
            if (!inv && this.data[i].score < result.score) result = this.data[i];
            if (inv && this.data[i].score > result.score) result = this.data[i];
        }
        return result
    }

    first(inv = false) {
        return this.cond(inv) || false
    }

    firstPop(inv = false) {
        let select = JSON.parse(JSON.stringify(this.cond(inv)));
        this.del(select.key);
        return select;
    }

    byKey(key) {
        return this.data[key];
    }
};

module.exports = ZSet;