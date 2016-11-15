var rb= require('robin-crypto');
var fs = require('fs');
var Benchmark = require('benchmark');
const assert = require('assert');


var buf = new Buffer("TEST STRING THAT USE TO COMPRESS", 'utf8');
console.log(buf.toString());
var javaBuff = rb.toJavaBuffer(buf)
console.log(typeof javaBuff)
var nodeBuff = rb.fromJavaBuffer(javaBuff);
console.log(nodeBuff.toString());
assert.equal(buf.toString(),nodeBuff.toString());
rb.hello();

var rbCrypto = new rb.RobinCrypto('123412344gfgfgdg gdfgdfgfg dfggfgfgf fgfg');

console.log(rbCrypto.decrypt(rbCrypto.encrypt(buf)).toString());
var enc = rbCrypto.encrypt(new Buffer("test String"));

fs.writeFileSync('test-data',enc.toString('hex'));
var rb1 = new rb.RobinCrypto('123412344gfgfgdg gdfgdfgfg dfggfgfgf fgfg');
var tt = rb1.decrypt(enc).toString();

console.log(tt);

var rand =function () {
    n = Math.random()*1e17;
    return (n+"").substr(1,10000);
   }
process.exit();
console.log("\nPERFORMANCE TEST\n-----------------------\n")
var suite = new Benchmark.Suite; 
suite.add('#toJavaBuffer', function() {
   var javaBuff = rb.toJavaBuffer(buf)   
})
.add('#fromJavaBuffer', function() {
   var nodeBuff = rb.fromJavaBuffer(javaBuff);  
})
.add('#RobinCrypto', function() {	

   var buf = new Buffer(rand());
   //console.log(buf.toString())
   var test =rbCrypto.decrypt(rbCrypto.encrypt(buf));
   assert.equal(buf.toString(),test.toString());
})
.add('#gzipSync', function() {
  var test = rb.gunzipSync(rb.gzipSync(nodeBuff))
  assert.equal(nodeBuff.toString(),test.toString());
})
.add('#zlib', function() {
  //var test = rb.zLibDecompressSync(rb.zLibCompressSync(buf))
  // assert.equal(buf.toString(),test.toString());
   
})// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async 
.run({ 'async': true });