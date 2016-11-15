var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var glob = require("glob-all");
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
//var zlib = require('zlib');
var rb =require('robin-crypto');
var osenv = require('osenv');
var stream = require('stream');
var streamBuffers = require('stream-buffers');
var config = {
	src:['scripts/**/*.{js,json}'],
	passwd:osenv.home()+"/_password",
	encdir:'.enc/',
	decdir:'.dec/'
}

gulp.task('default', function() {
  return gulp.src(['./lib/*.{js,json}', './scripts/*.{js,json}'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});




gulp.task('enc', function() {
	if (!fs.existsSync(config.passwd)) { 
		throw new Error('password is required');
	}
	var psswd = fs.readFileSync(config.passwd);
	var lines = psswd.toString('utf-8').split("\n");
	psswd = lines[0];	
	

	var files = glob.sync(config.src);
  	for(var i =0; i < files.length; i++){  		
  		mkdirp.sync(config.encdir + path.dirname(files[i]));  
  		var content = fs.readFileSync(files[i]);
  		var hash = crypto.createHmac('md5', psswd)
                   .update(content)
                   .digest('hex');					
		//console.log(files[i]);
		//console.log(content.toString());		
		//console.log(hash);
		//var waitTill = new Date(new Date().getTime() +  1000);
		//while(waitTill > new Date()){}
		var changed =true;
  		if (fs.existsSync(config.encdir + files[i])) { 
  			var json = JSON.parse(fs.readFileSync(config.encdir + files[i]));
  			//console.log(json.key);
  			if(json.key ==hash){
  				changed =false;
  			}
		}

		if(changed){
			console.log("update changed:" + config.encdir + files[i])			
			var rbCrypto = new rb.RobinCrypto(psswd);
			var crypted = rbCrypto.encrypt(content).toString('hex');
			fs.writeFileSync(config.encdir + files[i],JSON.stringify({key:hash,data:crypted}));
		}		
  		
  	}//end loop files
});

gulp.task('dec', function() {	
  	if (!fs.existsSync(config.passwd)) { 
		throw new Error('password is required');
	}
	var psswd = fs.readFileSync(config.passwd);
	var lines = psswd.toString('utf-8').split("\n");
	psswd = lines[0];	
	

	var files = glob.sync([config.encdir+"/**/*.*"]);
  	for(var i =0; i < files.length; i++){ 
  		
  		var json = JSON.parse(fs.readFileSync(files[i]));
  		//console.log(json.key);  

  		var file = 	files[i].substring(5);  		
  		mkdirp.sync(config.decdir + path.dirname(files[i]).substring(5));    		
  		//console.log(config.decdir + path.dirname(files[i]).substring(5));  		
  				
  		
		var changed =true;		
  		if (fs.existsSync(config.decdir + file)) { 
  			var content = fs.readFileSync(config.decdir + file);
	  		var hash = crypto.createHmac('md5', psswd)
	                   .update(content)
	                  .digest('hex');					
			if(json.key == hash){
				changed =false;
			}
		}

		if(changed){
			console.log("update changed:" + config.decdir + file);
			var crypted = new Buffer(json.data, "hex");			
			var rbCrypto = new rb.RobinCrypto(psswd);
			var content = rbCrypto.decrypt(crypted)
			// console.log(content);
			fs.writeFileSync(config.decdir + file,content);			
		}		
  		
  	}//end loop files
});