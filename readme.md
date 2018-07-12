# ZSet - node queue with a weight in the memory

[![Build Status](https://travis-ci.org/s00d/zset.svg?branch=master)](https://travis-ci.org/s00d/zset)
[![npm version](https://badge.fury.io/js/zset-node.svg)](https://badge.fury.io/js/zset-node)

## methods
create: 
``` let zset = new ZSet({t1: {val: {val: 1}}}) ```

add new item :
``` zset.set('t2', {val: {val: 10}}) ```

multiple add new item:
``` zset.add({t3: {val: {val: 3}}}) ```

increment weight item:
``` zset.incr('t2', weight = 1) ```

search item: 
``` zset.search('val.val', callback)' ```
callback example - (count) => count > 0
val.val - path

first item: 
``` zset.first() ```

last item: 
``` zset.first(true) ```

first and pop item: 
``` zset.firstPop() ```

del item: 
``` zset.del('t2') ```

get by key item: 
``` zset.byKey('t1') ```

reset weight
``` zset.reset(default = 1) ```

clear zset
``` zset.clear() ```

Install: 
``` npm i zset-node --save ```

Example use: 
```
let ZSet = require('zset-node');
let zset = new ZSet({t1: {val: {val: 1}}});
zset.set('t2', {val: {val: 10}})
zset.incr('t2')
console.log(zset.first());
console.log(zset.search('val.val', (count) => count > 5));
zset.incr('t1', 5)
zset.incr('t2', -1)
console.log(zset.first());
zset.reset()
zset.byKey('t1')
zset.clear()
```

benchmark:
```
       1,759,072 op/s » full
      10,804,463 op/s » set
     203,319,032 op/s » incr
      16,473,545 op/s » set2
      16,407,555 op/s » get
       1,506,850 op/s » search

  Suites:  1
  Benches: 6
  Elapsed: 5,085.41 ms
```

