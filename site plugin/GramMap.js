
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

			this.elements.push( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			this.elements.push( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));
			this.elements.push( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"metoo"
			));
			this.elements.push( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"alsoi"
			));
			this.elements.push( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));

			this.trigger("change");

		},this),1000);

		window.setTimeout( $.proxy(function(){

			this.elements.push( new GramElement(
				"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg",
				getRandomLat(),
				getRandomLng(),
				"iamhappy"
			));
			this.elements.push( new GramElement(
				"",
				getRandomLat(),
				getRandomLng(),
				"sodoi"
			));
			
			this.trigger("change");

		},this),180000);

	},
	trigger:function(event){
		if( !this.listener[event] )
			return
		for(var i=0;i<this.listener[event].length;i++)
			this.listener[event][i]();
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

		isfocus:null,

		latlng:null,

		keylistener:null,

		init:function( gramElement , map ){

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
			},this));

		},

		onAdd:function(){


			var panes = this.getPanes();
  			$( panes.overlayLayer ).append( this.$el );

  			this.$eventLayer
  			.width( this.$el.width() )
  			.height( this.$el.height() )
  			.appendTo( $( panes.overlayMouseTarget ) );
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
 			p.x-=w/2;
 			p.y+=-h+4;

			
  			this.$el.css({ 
				'top':  p.y+"px" ,
				'left': p.x+"px",
				'z-index':Math.floor(p.y) + (this.isfocus?1200:0)
			})

			this.$el.find('.gram-marker-tick').css({ 
				'left': (w/2-6)+"px",
			})

			this.$eventLayer.css({ 
				'width':  w+"px",
				'height': h+"px",
				'top':    p.y+"px" ,
				'left':   p.x+"px",
				'z-index':Math.floor(p.y) + (this.isfocus?1200:0)
			})
			
		},

		onRemove : function() {
		  this.$el.detach();
		  this.$eventLayer.detach();
		},
	});
	};
	

	function GramMap($el,options){
		this.$el=$el;
		this.state="load";
		this.model=options.model;


		var initMap=function(){
	        this.map = new google.maps.Map( $el.get(0) , {
	 		  'center': new google.maps.LatLng(48.685, 6.18),
	          'zoom': 8,
	          'mapTypeId': google.maps.MapTypeId.ROADMAP
	        });
	    };

        this.loadApi( $.proxy(initMap,this) );

        if( this.model )
        	this.model.on("change",$.proxy(this.render,this));
	};
	GramMap.prototype={

		$el:null,

		map:null,

		state:null,

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

	};

	$.fn.gramMap=function(options){
		this.each(function(){
			var $el=$(this);
			var grammap= new GramMap( $el , options );
			$el.data('gramMap',grammap);
		});
		return this;
	};

})($);