import test from 'ava';
import ZSet from './index';

test(t => {
    let data = {t1: {val: {val: 1}}, t2: {val: 2}, t3: {val: {val: 3}}};
    let zset = new ZSet(data);
    let getData = zset.get();

    t.is(getData[Object.keys(getData)[0]].data.val.val, 1);
    t.is(getData[Object.keys(getData)[0]].key, 't1');
    t.is(getData[Object.keys(getData)[0]].score, 1);

    t.is(zset.search('val.val', (count) => count > 0).key, 't1');
    zset.incr('t1');
    t.is(zset.search('val.val', (count) => count > 0).key, 't3');
    zset.incr('t3');
    t.is(zset.search('val.val', (count) => count > 0).key, 't1');

    t.is(zset.get(1,1).length, 1);
    t.is(zset.get(1,2).length, 3);
    t.is(zset.get(2,2).length, 2);

    t.is(zset.search('val.val', (count) => count > 0).score, 2);
    t.is(zset.search('val.val', (count) => count > 0).key, 't1');
    zset.del('t1');
    t.is(zset.search('val.val', (count) => count > 0).key, 't3');
    let item = zset.search('val.val', (count) => count > 0);
    item.data.val.val -= 3;
    t.is(zset.search('val.val', (count) => count > 0), false);
    zset.set('t4', {val: {val: 3}});
    t.is(zset.search('val.val', (count) => count > 0).key, 't4');
    t.is(zset.byKey('t2').key, 't2');
    t.is(zset.first().key, 't2');
    t.is(zset.firstPop().key, 't2');
    t.is(zset.first().key, 't4');

    zset.clear();
    t.is(zset.first(), false);



    zset.set('t10', {val: {val: 10}});
    t.is(zset.set_link('t10.val', 10).val, 10);
    t.is(zset.get_link(10).val, 10);
    zset.del_link(10);
    t.is(zset.get_link(10), false);
    t.is(zset.set_link('t100.val', 100), false);
});
