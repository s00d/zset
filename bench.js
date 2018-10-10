let ZSet = require('./index');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let test = new ZSet({t1: {val: 1}, t2: {val: 2}, t3: {ru: {s1: 1}}});

suite('ZSet_big', function () {
    let init = 0;
    for(let i=0;i<10000;i++) {
        test.set('t'+init, {ru: {s1: getRandomInt(0, 10), s2: 10, s3: 15}, ch:  {s1: getRandomInt(0, 10)}})
    }

    bench('full', function () {
        test.set('t', {ru: {s1: getRandomInt(0, 10), s2: 10, s3: 15}, ch:  {s1: getRandomInt(0, 10)}});
        test.incr('t', 2);
        test.set('t1', {val: 1});
        test.get()
    });
    bench('set', function () {
        test.set('t', {ru: {s1: getRandomInt(0, 10), s2: 10, s3: 15}, ch:  {s1: getRandomInt(0, 10)}});
    });
    bench('incr', function () {
        test.incr('t', 2);
    });
    bench('set2', function () {
        test.set('t1', {val: 1});
    });
    bench('get', function () {
        test.set('t1', {val: 1});
    });
    bench('search', function () {
        test.search('ru.s1', (count) => count > 0);
    });
    bench('first', function () {
        test.first();
    });
    bench('last', function () {
        test.first(true);
    });
    bench('byKey', function () {
        test.byKey('t');
    });
    bench('first and pop', function () {
        test.firstPop();
    });

    bench('set_link', function () {
        let key = 't'+getRandomInt(0, 100);
        test.set(key, {val: {val: 10}});
        test.set_link(key+'.val', 10);
        test.get_link(10);
    });
});
