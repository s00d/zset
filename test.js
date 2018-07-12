import test from 'ava';
import ZSet from './index';

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }

// let init = 0;
// let test = new ZSet({t1: {val: 1}, t2: {val: 2}, t3: {ru: {vk: 1}}});

// setInterval(() => {
//     test.set('t'+init, {ru: {vk: getRandomInt(0, 10), inst: 10, ok: 15}, ch:  {vk: getRandomInt(0, 10)}})
//     init++
// }, 500)

// setInterval(() => {
//     let {country, item} = test.searchService('vk', (count) => count > 0);
//     console.log(country, item);
// }, 500)

// test.incr('t3', 2)
// test.incr('t2', 3)
// test.incr('t1', 2)

// test.set('t1', {val: 1})
// test.set('t4', {val: 4})

// console.log(test.get());


test(t => {
    let data = {t1: {val: {val: 1}}, t2: {val: 2}, t3: {val: {val: 3}}};
    let zset = new ZSet(data);
    let getData = zset.get();
    
    t.is(getData[Object.keys(getData)[0]].data.val.val, 1);
    t.is(getData[Object.keys(getData)[0]].key, 't1');
    t.is(getData[Object.keys(getData)[0]].score, 1);

    t.is(zset.search('val.val', (count) => count > 0).key, 't1');
    zset.incr('t1')
    t.is(zset.search('val.val', (count) => count > 0).key, 't3');
    zset.incr('t3')
    t.is(zset.search('val.val', (count) => count > 0).key, 't1');
    
    t.is(zset.get(1,1).length, 1);
    t.is(zset.get(1,2).length, 3);
    t.is(zset.get(2,2).length, 2);

    t.is(zset.search('val.val', (count) => count > 0).score, 2);
    t.is(zset.search('val.val', (count) => count > 0).key, 't1');
    zset.del('t1')
    t.is(zset.search('val.val', (count) => count > 0).key, 't3');
    let item = zset.search('val.val', (count) => count > 0)
    item.data.val.val -= 3;
    t.is(zset.search('val.val', (count) => count > 0), false);
    zset.set('t4', {val: {val: 3}})
    t.is(zset.search('val.val', (count) => count > 0).key, 't4');
    t.is(zset.byKey('t2').key, 't2');
    t.is(zset.first().key, 't2');
    t.is(zset.firstPop().key, 't2');
    t.is(zset.first().key, 't4');

    zset.clear();
    t.is(zset.first(), false);


    // let resp = network.check('vk auth key 9999')
    // t.is(resp.code, 'vk');

    // resp = network.check('vk auth 9999');
    // t.is(resp.code, 'vk');

    // resp = network.check('Кoд InstАgram поDтверждения: 109 236. #ig');
    // t.is(resp.code, 'instagram');

    // resp = network.check('12345 asdfgrrr');
    // t.is(resp.code, false);

    // resp = network.check('vk autha 12334');
    // t.is(resp.code, 'vk');

    // network.lern('123456', 'code1');
    // network.lern('234567', 'code2');
    // network.lern('890123', 'code3');
    // resp = network.check('123340');
    // logger.info('check 123340', `result: ${resp.code}`, `path: ${resp.path}`);

    // fs.writeFileSync(__dirname + "/tree2.html", network.toHtml(), 'utf-8');
});