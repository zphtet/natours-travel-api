console.log('hello');

const arr = ['-price'];

const obj = arr.reduce((accum, val) => {
  if (val[0] === '-') {
    return {
        [val.slice(1)] : -1
     }
  }
  return {
    ...accum,
    [val]: 1,
  };
}, {});

console.log(obj);
