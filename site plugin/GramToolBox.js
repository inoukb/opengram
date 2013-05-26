/**
 *
 * Get started :
 *  this lib contains cool element to display your openGram database
 *  the class GramListener communicate with the server, it poll request to stay updated and fire event when some changes append
 *  
 *  display elements need an instance of GramListener to stay updated
 *  they are wrap in jQuery plugin and easy to use
 *
 *  the GramMap use the google map api to display a map with the last pictures where they were taken
 *
 *  the GramList display a list of the last pictures 
 */



/**
 * TODO
 *
 *  auto set the viewport of the map ( currently it always go to nancy )
 *  reduce the img size ( use canvas )
 *  make the css comptatible all browsers
 */




/**
 * @Class 
 * @Description a model which hold the properties of one entry
 * @Description is set up by the GramListener
 */
var GramElement=function(){
	this.init.apply(this,arguments);
};
GramElement.prototype={
	imageState:null,	//unused
	image:null,			//unused
	imageUrl:null,
	pos:null,			// polar coord { lat:Number, lng:Number}
	title:null,
	id:null,			// id of the device
	date:null,

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

/**
 * @Class 
 * @Description a model which hold the element gathered in the server
 * @Description poll request to the server to stay aware of new element
 * @Description fire 'change' and 'add' event whenever an element is added
 */
var GramListener=function(){
	this.init.apply(this,arguments);
};
GramListener.prototype={

	// an array of GramElement
	elements:null,

	// private, use for the event system
	_listeners:null,

	//max number of element hold in the store
	maxElement:null,

	url:null,

	pollTime:null,


	init:function(options){
		options=options||{};
		this.maxElement=options.maxElement||20;
		this.pollTime=options.pollTime||1000;
		this.url=options.url;
		var fake=options.fake||this.url==null; // if no url is provided fall back to fake listener

		this._listeners={};

		this.elements=[];

		
		if(fake){
			this.initFakeAdd(options);
			return;
		}else{
			this.picAll();
			this.pollLoop();
		}

	},

	/**
	 * @Description use a timeout to push random element every ~5 second
	 * @Description is more or less the same behavior we expect to have with actual server
	 */
	initFakeAdd:function(options){

		options=options||{};

		var imagesPool=options.fakeImages
		||
		[	// some random pics from the deep internet ...
			"http://www.allisonandbusby.com/info/wp-content/uploads/2010/05/a-happy-martin-edwards.jpg", //happy martin!
			"http://svtjosse.perso.sfr.fr/activites/comportementhtml/marmotte.jpg",
			"http://users.belgacom.net/marmotte/WJ_Marm02_fichiers/image004.jpg",
			"http://www.fond-ecran-image.com/galerie-membre/marmotte/chiens-de-prairie.jpg",
			"http://leconte-sylvain.hpsam.info/album/galleries/animaux/marmotte-lauvitel-01979.jpg",
			"http://www.marmottine.net/wp-content/uploads/2011/03/marmotte.jpg",
			"http://www.linternaute.com/nature-animaux/magazine/photo/50-moments-insolites-de-la-vie-animale/image/gouter-marmotte-270949.jpg",
			"http://www.dinosoria.com/mammifere/marmotte-1.jpg",
		];

		// random lat lng around nancy , fr
		var getRandomLat=function(){
			return 48.685 + ( Math.random() - 0.5 ) * 0.1;
		};
		var getRandomLng=function(){
			return 6.18 + ( Math.random() - 0.5 ) * 0.1;
		};

		var index=0;

		var generateFakeElement=function(){

			index=( index+1 )%imagesPool.length;

			var imageUrl=imagesPool[ index ];
			var lat=getRandomLat();
			var lng=getRandomLng();

			// find a random word in the url
			var words=imageUrl.match( /[A-z0-9]*/g );
			for(var i=0;i<words.length;i++)
				if(words[i].length==0)
					words.splice(i--,1);

			var label=words[ Math.floor( Math.random()*words.length ) ];

			this.addElement(new GramElement(
				imageUrl,
				lat,
				lng,
				label
			));

			window.setTimeout( 
				$.proxy(generateFakeElement,this) , 
				this.elements.length < this.maxElement*0.5 ? 		// is the store already well filled
				10 : 												// nop, get another element soon
				Math.floor( Math.random() * 5000 + 1000 )			// yes, get another element in few seconds
			);
		};

		generateFakeElement.call(this);

	},
	pollLoop:function(){

		var lasts=1;

		var success=function(response){

		};
		var error=function(response){

		};
		var hhr=$.ajax(
			this.url+"/get?nb_pic="+lasts,
			{
				type:'GET',
				dataType:'jsonp',
				success:success,
				error:error,
				timeout:5000,
			}
		);

		window.setTimeout( $.proxy(this.pollLoop,this),this.pollTime );
	},
	picAll:function(){
		var success=function(response){

		};
		var error=function(response){

		};
		var hhr=$.ajax(
			this.url+"/get?nb_pic="+this.maxElement,
			{
				type:'GET',
				dataType:'jsonp',
				success:success,
				error:error,
				timeout:5000,
			}
		);
	},
	picLast:function(){

	},
	addElement:function(gramElement){
		this.elements.unshift( gramElement );
		this.trigger("add",gramElement );

		while(this.elements.length>this.maxElement){
			var removed=this.elements.splice(this.elements.length-1,1)[0];
			this.trigger("remove",removed );
		}

		this.trigger("change");
	},
	trigger:function(event){
		if( !this._listeners[event] )
			return
		var args=[];
		for(var i=1;i<arguments.length;i++)
			args.push(arguments[i]);
		for(var i=0;i<this._listeners[event].length;i++)
			this._listeners[event][i].apply(this,args);
	},
	on:function(event,fn){
		if( !this._listeners[event] )
			this._listeners[event]=[];
		this._listeners[event].push(fn);
	},
	off:function(event,fn){
		if( !this._listeners[event] )
			return
		var i=this._listeners[event].length;
		while(i--)
			if(this._listeners[event][i]==fn)
				this._listeners[event].splice(i,1);
	},


};

(function($){

	var googleApiKey="AIzaSyBMU_Uuqf8WevUvNoRw3hONVjr8K_q5aIw";

	var GramMarker;

	var canvasEnable=!true;


	var initGoogleMapsElements=function(){ //because we need the google api set up, delay this
		var markerTemplate=[
		'<div class="gram-marker small">',
			'<div>',
				'<div class="gram-marker-photo"></div>', 
				'<div class="gram-marker-label"></div>',
			'</div>',
			'<div class="gram-marker-tic"></div>',
		'</div>',
		].join("");

	GramMarker=function (){
		this.init.apply(this,arguments);
	};
	GramMarker.prototype = new google.maps.OverlayView();
	$.extend( GramMarker.prototype , {

		gramElement:null,		

		$el:null,				// the html element

		$eventLayer:null,		// the html element which is placed in the event layer, will receive and delegate user event

		$shadow:null,			// the shadow element

		isfocus:null,			// true if the element is large

		image:null,				// buffer

		latlng:null,

		_keylistener:null,		// an object passed in param to remove an event

		init:function( gramElement , map , onChange ){

			this.gramElement=gramElement;

			this.$el=$( markerTemplate );

			this.image=$("<img>")
			.css("display","none")
			.appendTo( $("body") );

			this.render();

			this.isfocus=false;


			// the polar coord
			this.latlng=new google.maps.LatLng( gramElement.pos.lat , gramElement.pos.lng );

			

			// Explicitly call setMap() on this overlay
			this.setMap(map);


			// bind event
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

			// css anim
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
			
			// dimension of the thumbnail
			var th_w=50*3,
				th_h=38*3;

			this.isfocus=true;

			this.$el.removeClass("small");
			
			

			if(canvasEnable){
				this.$el.find(".gram-marker-photo")
				.empty()
			}else{
				this.$el.find('.gram-marker-photo img')
				.css({ 'width' : th_w+"px" , 'height' : th_h+"px" })
				.attr( "width" , th_w ).attr( "height" , th_h )
			}

			this.draw();

			// listen to a click outside the box
			// lose the focus when this happend
			this.keylistener = this.map.addListener('click',$.proxy(function(e){
				this.unfocus();
				e.stop();
			},this));
		},

		unfocus:function(){
			
			this.isfocus=false;

			this.$el.addClass("small");
			
			this.draw();

			// remove the listener
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

			// dimension of the thumbnail
			var th_w=50,
				th_h=38;


			if(canvasEnable){
				// load the buffer image
				this.image
				.on("load",$.proxy(function(){

					// cache the reduced thumbnail
					var $canvas=$("<canvas>")
					.css({ 'width' : th_w+"px" , 'height' : th_h+"px" })
					.attr( "width" , th_w ).attr( "height" , th_h );

					var ctx=$canvas.get(0).getContext("2d");

					ctx.drawImage( this.image.get(0) ,   0 , 0 , th_w , th_h   );

					this.$el.find('.gram-marker-photo')
					.empty()
					.append( $canvas );
					/*
					$("body")
					.append( $canvas );
					*/

				},this))
				.attr("src" , this.gramElement.imageUrl )
				
			}else{

				var $img=$("<img>")
				.css({ 'width' : th_w+"px" , 'height' : th_h+"px" })
				.attr( "width" , th_w ).attr( "height" , th_h )
				.attr( "src" , this.gramElement.imageUrl );


				this.$el.find('.gram-marker-photo')
				.empty()
				.append( $img );

				this.image
				.attr("src" , this.gramElement.imageUrl )
			}


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
 			p.y+=-h+14;

			
  			this.$el.css({ 
				'top':  p.y+"px" ,
				'left': p.x+"px",
				'z-index':z
			})
			this.$eventLayer.css({ 
				'width':  w+"px",
				'height': h+"px",
				'top':    p.y+"px" ,
				'left':   p.x+"px",
				'z-index':z
			})
			this.$shadow.css({ 
				'top':  (p.y+38)+"px" ,
				'left': (p.x+w/2-5)+"px",
			})
		},

		onRemove : function() {
		  if(this.isfocus)
		  	google.maps.event.removeListener( this.keylistener );
		  this.$el.detach();
		  this.$eventLayer.detach();
		  this.$shadow.detach();
		  this.image.remove();
		},
	});
	};
	

	function GramMap($el,options){
		this.$el=$el;
		this.state="load";
		this.gramListener=options.gramListener;
		this.maxElement=options.maxElement==null?100:options.maxElement;
		this.onChange=options.onChange;


		this.markers=[];

		var initMap=function(){
	        this.map = new google.maps.Map( $el.get(0) , {
	 		  'center': new google.maps.LatLng(48.685, 6.18),
	          'zoom': 12,
	          'mapTypeId': google.maps.MapTypeId.ROADMAP
	        });
	        if( this.gramListener ){
	        	this.gramListener.on("add",$.proxy(this.addOne,this));
	        	this.gramListener.on("remove",$.proxy(this.removeOne,this));
	        	this.render();
        	}
	        
	    };

        this.loadApi( $.proxy(initMap,this) );		// load google api, when its ready, call initMap

       

	};
	GramMap.prototype={

		$el:null,

		map:null,

		gramListener:null,

		state:null,

		onchange:null,

		maxElement:null,

		markers:null,		// array of GramMarker ( need to hold them to remove them )


		loadApi:function( onloaded ){
			
			// actually it's not working
			initGoogleMapsElements();
			onloaded();
			return;

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
			
			
			//var $scr=$('<script>')
			//.attr('type',"text/javascript")

			var $scr=$('#google-maps-api')
			.attr('src',"https://maps.googleapis.com/maps/api/js?key="+googleApiKey+"&sensor=true")
			
			$scr.get(0).onload=function(e){
				$(e.target).attr('data-loaded',true);
				//initGoogleMapsElements();
				//onloaded();
				var fn=window.onload;
				window.onload=function(){
					fn();
				}
			}

			
			window.setTimeout(function(){
				$scr.appendTo($('head'));
			},0);
		},

		render:function(){

			this.removeAll();

			var elements=this.gramListener.elements;

			for(var i=0;i<elements.length;i++)
				this.addOne(elements[i]);

			return this;
		},

		addOne:function(gramElement){
			var marker = new GramMarker(
			    gramElement,
			    this.map
			);
			this.markers.push(marker);
			while(this.markers.length>this.maxElement)
				this.removeOne( this.markers[0].gramElement );
		},

		removeOne:function(gramElement){
			var i=this.markers.length;
			while(i--)
				if(this.markers[i].gramElement==gramElement){
					this.markers[i].setMap(null); //remove from the map
					this.markers.splice(i,1);
				}
		},

		removeAll:function(){
			var i=this.markers.length;
			while(i--)
				this.markers[i].setMap(null); //remove from the map
			this.markers=[];
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
		this.maxElement=options.maxElement==null?1000:options.maxElement;

        if( this.gramListener ){
        	this.gramListener.on("add",$.proxy(this.addOne,this));
        	this.gramListener.on("remove",$.proxy(this.removeOne,this));
        }

        this.gramElementViews=[];
	};
	GramList.prototype={

		$el:null,

		onchange:null,

		gramListener:null,

		gramElementViews:null,

		maxElement:null,

		render:function(){

			this.removeAll();

			var elements=this.gramListener.elements;

			for(var i=0;i<elements.length;i++)
				this.addOne(elements[i]);

			return this;
		},

		addOne:function(gramElement){

			var el=new GramElementView(gramElement);

			this.gramElementViews.push( el );

			this.$el.elegantContainer('append', el.$el );

			while(this.gramElementViews.length>this.maxElement)
				this.removeOne( this.gramElementViews[0].gramElement );
		},

		removeOne:function(gramElement){
			var i=this.gramElementViews.length;
			while(i--)
				if(this.gramElementViews[i].gramElement==gramElement){
					this.$el.elegantContainer('remove', this.gramElementViews[i].$el );
					this.gramElementViews.splice(i,1);
				}
		},

		removeAll:function(){
			var i=this.gramElementViews.length;
			while(i--)
				this.$el.elegantContainer('remove', this.gramElementViews[i].$el );
			this.gramElementViews=[];
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









/**
 * a jQuery plugin that fill an container with element of the same size,
 * element will be added with a cool transition
 * use <jquery element>.elegantContainer() to set up
 *     <jquery element>.elegantContainer('append',<jquery element>) to add an element to the container
 *     <jquery element>.elegantContainer('remove',<jquery element>) to remove an element from the container
 */
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
			if(qResize)
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
		remove:function( $el ){
			var i=this.q.length;
			while(i--)
				if(this.q[i].$el==$el)
					this.q.splice(i,1)[0].$el.remove();
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

			var ncol=Math.max( Math.floor( ( cw - margin )/( ew + margin ) ) , 1 );

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
				if(options=="remove")
					$el.data('elegantContainer').remove(args[1]);
			}
		});
		return this;
	};

})($);
















