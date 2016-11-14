 var java = require("java");
var path = require('path');
java.classpath.push(path.resolve(__dirname, './tools-1.0-SNAPSHOT.jar'));
var Crypto= java.import('robin.tools.Crypto');
var AES256CtrCrypto= java.import('robin.tools.AES256CtrCrypto');
var ByteBuffer= java.import('java.nio.ByteBuffer');

var fs = require('fs');

var toJavaBuffer=function(buf){
    if(buf instanceof Buffer){
       var javaBuff = java.callStaticMethodSync("java.nio.ByteBuffer", "allocate",buf.length);      
       for(var i =0; i< buf.length;i++){
          javaBuff.putSync(java.newByte(buf.readInt8(i)))
       }
       return javaBuff;
    }
    return undefined;
}
var fromJavaBuffer=function(buf){
  if(buf && buf.toString().lastIndexOf('java.nio.HeapByteBuffer[', 0) === 0){
     var bytes = buf.arraySync();
     var nodeBuff = new Buffer(bytes.length);     
     for(var i =0; i< bytes.length;i++){
       nodeBuff.writeInt8(bytes[i], i);
     }  
     return nodeBuff;
  }
  return undefined;
}

var gzipSync=function(buf){
   var jbuff = java.callStaticMethodSync('robin.tools.Crypto', "gzip",toJavaBuffer(buf)); 
   return fromJavaBuffer(jbuff);
}

var gunzipSync=function(buf){
   var jbuff = java.callStaticMethodSync('robin.tools.Crypto', "gunzip",toJavaBuffer(buf)); 
   return fromJavaBuffer(jbuff);
}

var hello =function(){  
   console.log("hello");
   
}

var zLibCompress = function(buf){
   var jbuff = java.callStaticMethodSync('robin.tools.Crypto', "zLibCompress",toJavaBuffer(buf)); 
   return fromJavaBuffer(jbuff);
}

var zLibDecompress = function(buf){
   var jbuff = java.callStaticMethodSync('robin.tools.Crypto', "zLibDecompress",toJavaBuffer(buf)); 
   return fromJavaBuffer(jbuff);
}

var RobinCrypto = function(password){
  var _crypto =  new AES256CtrCrypto(password);
  this.encrypt = function(raw){
      var jbuff = _crypto.encryptSync(toJavaBuffer(raw));
      return fromJavaBuffer(jbuff);
  } ,
  this.decrypt = function(encrypted){
       var jbuff = _crypto.decryptSync(toJavaBuffer(encrypted));
      return fromJavaBuffer(jbuff);
  } 
}

exports.toJavaBuffer=toJavaBuffer;
exports.fromJavaBuffer=fromJavaBuffer;
exports.gzipSync=gzipSync;
exports.gunzipSync=gunzipSync;
exports.zLibCompress=zLibCompress;
exports.zLibDecompress=zLibDecompress;
exports.RobinCrypto = RobinCrypto;
exports.unzipSync=zLibDecompress;
exports.hello=hello;
