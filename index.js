/* eslint no-prototype-builtins: "error" */
function checkKey (entries, key) {
  return Object.prototype.hasOwnProperty.call(entries, key)
}

class ZSet {
  constructor (init = {}) {
    this.data = {}
    this.links = {}
    this.add(init)
  }

  setLink (path, key) {
    path = path.split('.')

    if (!checkKey(this.data, path[0])) {
      return null
    }
    let select = this.data[path[0]].data
    path.splice(0, 1)
    for (const key of path) {
      if (!checkKey(select, key)) {
        return null
      }

      if (typeof select[key] !== 'object') {
        return null
      }
      select = select[key]
    }
    this.links[key] = select
    return select
  }

  getLink (key) {
    return checkKey(this.links, key) ? this.links[key] : null
  }

  delLink (key) {
    delete this.links[key]
  }

  add (data = {}, score = 1) {
    for (const key in data) {
      this.data[key] = { score: score, key: key, data: data[key] }
    }
  }

  set (key, data, score = 1) {
    const obj = {}
    obj[key] = data
    this.add(obj, score)
  }

  incr (key, score = 1) {
    this.data[key].score += score
  }

  del (key) {
    delete this.data[key]
  }

  get (min = null, max = null, filter = null) {
    const sortable = []
    for (const i in this.data) {
      if (min !== null && this.data[i].score < min) continue
      if (max !== null && this.data[i].score > max) continue
      if (filter !== null) {
        if (!filter.test(i)) continue
        if (typeof this.data[i].data === 'string' && !filter.test(this.data[i].data)) continue
      }
      sortable.push(this.data[i])
    }
    sortable.sort(function (a, b) {
      return a.score - b.score
    })

    return sortable
  }

  search (path, check = null, sort = true) {
    path = path.split('.')
    const vals = sort ? this.get() : this.data
    for (const item of vals) {
      let select = item.data
      let end = false
      for (const key of path) {
        if (key === '_' || key === '*') {
          for (const country in select) {
            if (checkKey(select[country], key)) return item
          }
          break
        }
        if (!checkKey(select, key)) {
          end = false
          break
        }

        select = select[key]
        end = true
      }
      if (end) {
        if (typeof check === 'function' && !check(select)) continue
        return item
      }
    }
    return null
  }

  searchService (service, check = null) {
    const sort = this.get()
    for (const item of sort) {
      for (const country in item.data) {
        if (checkKey(item.data[country], service)) {
          if (typeof check !== 'function' || !check(item.data[country])) {
            return { country: country, item: item }
          }
        }
      }
    }
    return null
  }

  exec (func) {
    const sort = this.get()
    for (const select of sort) {
      if (!func(select)) continue
      return select
    }
    return null
  }

  restart (def = 1, key = null) {
    if (key) {
      this.data[key].score = def
    } else {
      Object.keys(this.data).forEach(i => { this.data[i].score = def })
    }
  }

  clear () {
    this.data = {}
  }

  cond (inv = false) {
    let result = null
    for (const i in this.data) {
      if (result === null) result = this.data[i]
      if (!inv && this.data[i].score < result.score) result = this.data[i]
      if (inv && this.data[i].score > result.score) result = this.data[i]
    }
    return result
  }

  first (inv = false) {
    return this.cond(inv) || null
  }

  firstPop (inv = false) {
    const select = JSON.parse(JSON.stringify(this.cond(inv)))
    if (!select) return null
    this.del(select.key)

    return select
  }

  byKey (key) {
    return this.data[key]
  }
}

module.exports = ZSet
