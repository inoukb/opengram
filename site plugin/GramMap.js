
var GramElement=function(){
	this.init.apply(this,arguments);
};
GramElement.prototype={
	imageState:null,
	image:null,
	imageUrl:null,
	pos:null,
	title:null,
	id:null,

	init:function(imageUrl,lat,lng,title,id){
		this.imageState="loading";
		this.imageUrl=imageUrl;
		this.pos={
			lat:lat,
			lng:lng
		};
		this.title=title;
	},
};


var GramListener=function(){
	this.init.apply(this,arguments);
};
GramListener.prototype={

	elements:null,

	listener:null,

	init:function(){

		this.listener={};

		this.elements=[];

		var getRandomLat=function(){
			return 48.685 + ( Math.random() - 0.5 ) * 0.1;
		};
		var getRandomLng=function(){
			return 6.18 + ( Math.random() - 0.5 ) * 0.1;
		};
		
		window.setTimeout( $.proxy(function(){
			
			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));

			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));

			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"metoo"
			));

			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"alsoi"
			));

			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));

			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),1000);

		window.setTimeout( $.proxy(function(){

			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));
			
			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),1800);

		window.setTimeout( $.proxy(function(){

			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));

			this.trigger("add",this.elements[ 0] );

			this.elements.unshift( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));
			
			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),3800);
	

		window.setTimeout( $.proxy(function(){

			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			
			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),100);

		window.setTimeout( $.proxy(function(){

			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			
			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),5000);

		window.setTimeout( $.proxy(function(){

			this.elements.unshift( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			
			this.trigger("add",this.elements[ 0] );
			this.trigger("change");

		},this),6000);

	},
	trigger:function(event){
		if( !this.listener[event] )
			return
		var args=[];
		for(var i=1;i<arguments.length;i++)
			args.push(arguments[i]);
		for(var i=0;i<this.listener[event].length;i++)
			this.listener[event][i].apply(this,args);
	},
	on:function(event,fn){
		if( !this.listener[event] )
			this.listener[event]=[];
		this.listener[event].push(fn);
	},
	off:function(event,fn){
		if( !this.listener[event] )
			return
		var i=this.listener[event].length;
		while(i--)
			if(this.listener[event][i]==fn)
				this.listener[event].splice(i,1);
	},


};

(function($){

	var googleApiKey="AIzaSyBMU_Uuqf8WevUvNoRw3hONVjr8K_q5aIw";

	var GramMarker;

	var initGoogleMapsElements=function(){
		var markerTemplate=[
		'<div class="gram-marker small">',
			'<div>',
				'<img class="gram-marker-photo"></img>', 
				'<div class="gram-marker-label"></div>',
			'</div>',
			'<div class="gram-marker-tick"></div>',
		'</div>',
		].join("");

	GramMarker=function (){
		this.init.apply(this,arguments);
	};
	GramMarker.prototype = new google.maps.OverlayView();
	$.extend( GramMarker.prototype , {

		gramElement:null,

		$el:null,

		$eventLayer:null,

		$shadow:null,

		isfocus:null,

		latlng:null,

		keylistener:null,

		init:function( gramElement , map , onChange ){

			this.gramElement=gramElement;

			this.$el=$( markerTemplate );

			this.render();

			this.isfocus=false;

			this.latlng=new google.maps.LatLng( gramElement.pos.lat , gramElement.pos.lng );

			

			// Explicitly call setMap() on this overlay
			this.setMap(map);


			this.$eventLayer=$('<div style="position:absolute;">')
			.on( 'click' , $.proxy(function(e){
				this.isfocus?this.unfocus():this.focus();
				e.stopPropagation();
			},this))
			.on( 'mouseenter' , $.proxy(function(e){
				this.$el.add( this.$shadow ).addClass('hover');
			},this))
			.on( 'mouseleave' , $.proxy(function(e){
				this.$el.add( this.$shadow ).removeClass('hover');
			},this))
			

			this.$shadow=$('<div class="gram-marker-shadow" style="position:absolute;">');

			this.animDrop();
		},

		onAdd:function(){


			var panes = this.getPanes();
  			$( panes.overlayImage ).append( this.$el );

  			this.$eventLayer
  			.width( this.$el.width() )
  			.height( this.$el.height() )
  			.appendTo( $( panes.overlayMouseTarget ) );

  			this.$shadow
  			.appendTo( $( panes.overlayShadow ) );

		},

		focus:function(){
			
			this.isfocus=true;

			this.$el.removeClass("small");
			
			this.draw();

			this.keylistener = this.map.addListener('click',$.proxy(function(e){
				this.unfocus();
				e.stopPropagation();
			},this));

		},

		unfocus:function(){
			
			this.isfocus=false;

			this.$el.addClass("small");
			
			this.draw();

			google.maps.event.removeListener( this.keylistener );

		},

		animDrop:function(){
			if(this.$el.hasClass('drop-anim'))
				return;
			this.$el.add( this.$shadow ).addClass('drop-anim');
			window.setTimeout($.proxy(function(){
				this.$el.add( this.$shadow ).removeClass('drop-anim');
			},this),600);
		},

		render:function(){

			this.$el.find('img.gram-marker-photo')
			.attr('src',this.gramElement.imageUrl );

			this.$el.find('.gram-marker-label')
			.text( this.gramElement.title );

			return this;
		},

		draw:function(){
			var overlayProjection = this.getProjection();

			var w=this.$el.width(),
				h=this.$el.height();

  			var p = overlayProjection.fromLatLngToDivPixel(this.latlng);

  			var z=Math.floor( p.y );

 			p.x-=w/2;
 			p.y+=-h+4;

			
  			this.$el.css({ 
				'top':  p.y+"px" ,
				'left': p.x+"px",
				'z-index':z
			})

			this.$el.find('.gram-marker-tick').css({ 
				'left': (w/2-6)+"px",
			})

			this.$eventLayer.css({ 
				'width':  w+"px",
				'height': h+"px",
				'top':    p.y+"px" ,
				'left':   p.x+"px",
				'z-index':z
			})

			this.$shadow.css({ 
				'top':  (p.y+10)+"px" ,
				'left': (p.x+w/2-5)+"px",
			})
			
		},

		onRemove : function() {
		  this.$el.detach();
		  this.$eventLayer.detach();
		  this.$shadow.detach();
		},
	});
	};
	

	function GramMap($el,options){
		this.$el=$el;
		this.state="load";
		this.model=options.model;
		this.onChange=options.onChange;

		var initMap=function(){
	        this.map = new google.maps.Map( $el.get(0) , {
	 		  'center': new google.maps.LatLng(48.685, 6.18),
	          'zoom': 8,
	          'mapTypeId': google.maps.MapTypeId.ROADMAP
	        });
	    };

        this.loadApi( $.proxy(initMap,this) );

        if( this.model )
        	//this.model.on("change",$.proxy(this.render,this));
        	this.model.on("add",$.proxy(this.addOne,this));
	};
	GramMap.prototype={

		$el:null,

		map:null,

		state:null,

		onchange:null,

		loadApi:function( onloaded ){
			//is it already loaded?
			

			initGoogleMapsElements();

			var $scr;
			$('script[src]').each(function(){
				var c=$(this);
				var source=c.attr('src');
				if( source && source.match( /maps\.googleapis\.com\/maps\/api/ ) )
					$scr=c;
			});

			if($scr && $scr.attr('data-loaded')){
				onloaded();
				return;
			}

			if($scr && !$scr.attr('data-loaded')){
				var ex=$scr.get(0).onload;
				$scr.get(0).onload=function(){ 
					onloaded(); 
					if(typeof(ex)=='function')
						ex();
				};
				return;
			}
			

			var $scr=$('<script>')
			.attr('type',"text/javascript")
			.attr('src',"https://maps.googleapis.com/maps/api/js?key="+googleApiKey+"&sensor=true")
			
			$scr.get(0).onload=function(e){
				$(e.target).attr('data-loaded',true);
				initGoogleMapsElements();
				onloaded();
			}

			$scr.appendTo($('head'));
		},

		render:function(){

			var elements=this.model.elements;

			for(var i=0;i<elements.length;i++){
				var el=elements[i];
				

				var marker = new GramMarker(
			      el,
			      this.map
			  	);
				/*
				var marker = new google.maps.Marker({
			      position: new google.maps.LatLng( el.pos.lat , el.pos.lng ),
			      map: this.map,
			      title: el.title,
			  	});*/
				
				
			}

			return this;
		},

		addOne:function(gramElement){
			var marker = new GramMarker(
			    gramElement,
			    this.map
			);
		},

	};

	$.fn.gramMap=function(options){
		options=options||{};
		this.each(function(){
			var $el=$(this);
			var grammap= new GramMap( $el , options );
			$el.data('gramMap',grammap);
		});
		return this;
	};

})($);




(function($){

	function GramElementView(){
		this.init.apply(this,arguments);
	};
	GramElementView.prototype={

		$el:null,

		gramElement:null,

		onChange:null,

		init:function(gramElement,options){
			options=options||{};
			this.gramElement=gramElement;
			this.onChange=options.onChange;

			this.$el=$( '<div class="gram-list-element"><img></img></div>' );

			this.render();

		},

		
		render:function(){

			this.$el.find('img').attr('src', this.gramElement.imageUrl );

			return this;
		},


	}

	function GramList($el,options){
		this.$el=$el
		.elegantContainer({
			margin:15,
		});

		this.gramListener=options.gramListener;
		this.onChange=options.onChange;
		this.maxElement=options.maxElement;

        if( this.gramListener )
        	//this.gramListener.on("change",$.proxy(this.render,this));
        	this.gramListener.on("add",$.proxy(this.addone,this));

        this.gramElementViews=[];
	};
	GramList.prototype={

		$el:null,

		onchange:null,

		gramListener:null,

		gramElementViews:null,

		addone:function(gramElement){

			var el=new GramElementView(gramElement);

			this.gramElementViews.push( el );

			this.$el.elegantContainer('append', el.$el );
		},

		render:function(){

			
			return this;
		},

	};

	$.fn.gramList=function(options){
		options=options||{};
		this.each(function(){
			var $el=$(this);
			var gramlist= new GramList( $el , options );
			$el.data('gramList',gramlist);
		});
		return this;
	};

})($);










(function($){


	function ElegantContained($el,options){
		this.$el=$el
		.addClass('elegant-element');
	};
	ElegantContained.prototype={

		$el:null,

		moveTo:function(x,y,notransition){
			if(notransition)
				this.$el.removeClass('transition-enable');
			this.$el.css({
				'left':x+'px',
				'top':y+'px',
			});
			if(notransition)
				this.$el.addClass('transition-enable');
		},

	};

	function ElegantContainer($el,options){
		this.$el=$el;
		this.q=[];
		this.margin=options.margin==null?5:options.margin;

		this.$c=$('<div style="position:absolute;">')
		.appendTo( this.$el );

		var qResize=window.onresize;
		window.onresize=$.proxy(function(){
			this.resize();
			qResize();
		},this);
	};
	ElegantContainer.prototype={

		$el:null,

		$c:null,

		q:null,

		margin:null,

		addToQueu:function( $el ){
			this.q.unshift( new ElegantContained($el) );
			this.$c.append($el);
			this.resize();
		},

		resize:function(){

			if(this.q.length==0)
				return this;

			var cw=this.$el.width(),
				ch=this.$el.height();

			var ew=this.q[0].$el.width(),
				eh=this.q[0].$el.height();

			var margin=this.margin;

			var ncol=Math.floor( ( cw - margin )/( ew + margin ) );

			var trueMargin=(cw-ncol*ew)/(ncol+1);

			var xc=-1,yc=0;

			var i=0;
			while(i<this.q.length){
				if(yc%2==0){
					xc++;
					if(xc>=ncol){
						yc++;
						xc=ncol-1;
					}
				}else{
					xc--;
					if(xc<0){
						yc++;
						xc=0;
					}
				}

				this.q[i].moveTo(
					xc * ( trueMargin + ew ) + trueMargin,
					yc * ( margin + eh ) + margin
				);
				i++;
			}

			this.$el.height( (yc+1) * ( margin + eh ) + margin )

		},
	};

	$.fn.elegantContainer=function(options){
		options=options||{};
		var args=arguments;
		this.each(function(){
			var $el=$(this);
			if( !$el.data('elegantContainer') ){
				var elegantContainer= new ElegantContainer( $el , options );
				$el.data('elegantContainer',elegantContainer);
			}
			if( typeof(options)=="string" ){
				if(options=="append")
					$el.data('elegantContainer').addToQueu(args[1]);
			}
		});
		return this;
	};

})($);
















