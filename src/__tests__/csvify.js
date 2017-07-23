import test from 'ava';
import csv, { createCSVRow } from '../csvify';

test('`createCSVRow` convert a row dictionary to a csv row', t => {
  t.is(
    createCSVRow(',', ['a', 'b'], { a: 'a-val', b: 'b-val' }),
    'a-val,b-val'
  );

  t.is(
    createCSVRow(',', ['b', 'a'], { a: 'a-val', b: 'b-val' }),
    'b-val,a-val'
  );

  t.is(
    createCSVRow(',', ['b', 'a'], { a: 'a-val', b: 'b-val', c: 'c-val' }),
    'b-val,a-val'
  );
});

test('`createCSVRow` handles delimiter conflicts', t => {
  t.is(
    createCSVRow(',', ['a', 'c', 'b'], { a: 'a,val', b: 'b-val,', c: 'c-val' }),
    '"a,val",c-val,"b-val,"'
  );
});

test('`createCSVRow` replaces null and undefined with an empty value', t => {
  t.is(
    createCSVRow(',', ['a', 'c', 'b'], {
      a: undefined,
      b: 'b-val',
      c: 'c-val'
    }),
    ',c-val,b-val'
  );
  t.is(
    createCSVRow(',', ['a', 'c', 'b'], {
      a: 'a-val',
      b: 'b-val',
      c: null
    }),
    'a-val,,b-val'
  );
  t.is(
    createCSVRow(',', ['a', 'c', 'b'], {
      a: 'a-val',
      c: 'c-val'
    }),
    'a-val,c-val,'
  );
  t.is(createCSVRow(',', ['a', 'c', 'b'], {}), ',,');
});

test('`csv` properly transform a list of row dictionaries', t => {
  t.is(
    csv(
      [{ b: 'b-val1', a: 'a-val1' }, { a: 'a-val2', b: 'b-val2' }],
      ['b', 'a'],
      { delimiter: ';', writeHeaders: false }
    ),
    'b-val1;a-val1\nb-val2;a-val2'
  );
  t.is(
    csv(
      [{ b: 'b-val1', a: 'a-val1' }, { a: 'a-val2', b: 'b-val2' }],
      ['b', 'a'],
      { delimiter: ',', writeHeaders: true }
    ),
    'b,a\nb-val1,a-val1\nb-val2,a-val2'
  );
  t.is(csv([], ['b', 'a'], ','), 'b,a', { delimiter: ',', writeHeaders: true });
});

test("`csv` uses ',' as a default delimiter", t => {
  t.is(
    csv(
      [{ a: 'a-val1', b: 'b-val1' }, { b: 'b-val2', a: 'a-val2' }],
      ['b', 'a'],
      { writeHeaders: false }
    ),
    'b-val1,a-val1\nb-val2,a-val2'
  );
});

test('`csv` write headers by default', t => {
  t.is(
    csv(
      [{ a: 'a-val1', b: 'b-val1' }, { b: 'b-val2', a: 'a-val2' }],
      ['b', 'a'],
      { delimiter: ',' }
    ),
    'b,a\nb-val1,a-val1\nb-val2,a-val2'
  );
});

test('`csv` uses the first row keys if no columnNames is provided', t => {
  t.is(
    csv([
      { b: 'b-val1', a: 'a-val1' },
      { a: 'a-val2', b: 'b-val2', c: 'c-val2' }
    ]),
    'b,a\nb-val1,a-val1\nb-val2,a-val2'
  );
});

test('`csv` graciously handle non string values', t => {
  t.is(
    csv([{ b: [1, 3, 4], a: true }, { a: { prop: 'val' }, b: 8 }]),
    'b,a\n"1,3,4",true\n8,[object Object]'
  );
});
