var JSObject= {
			extend:function(props){
				$this=function(args){					
					if(typeof(args)=='object'){
						for(var key in args){
							 if (args.hasOwnProperty(key)) {
								this[key]= args[key];
							}
						}
					}else if(typeof(args)=='string'){
						this.elm = document.getElementById(args);
					}
					if(typeof(this.init)=='function'){
						this.init();
					}
				}				
				_props =props||{};
				_props.toString=function(){
					if(this.type){
						return this.type;

					}else{
						return 'JSObject';
					}
				};						
				$this.prototype=_props||{};
				return $this;
			}				
		}