//active:class
document.addEventListener('touchstart',function(){},false);
var l={
	//get ID
	id:function(obj){
		return document.getElementById(obj);
	},
	//get querySelectorAll
	queryAll:function(obj1,obj2){
		if(arguments.length==1){//默认document
			return document.querySelectorAll(obj1);
		}else{//有父级
			return obj1.querySelectorAll(obj2);
		}
	},
	/*regexp*/
	re:{			
		email:	    /^[\_a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/i,              /*email*/
		ChinaName:	/^[\u4e00-\u9fa5]{2,10}$/,                                                       /*chinaName*/
		chiEhg:     /^[\u4e00-\u9fa5]{2,15}$/i,                                                      /*chinaEnglish*/
		pass:		/^[a-z0-9]{6,38}$/,                                                              /*pass(letter digital)*/
		plane:      /(0[1-9]\d{1,2}\-?)?[1-9]\d{6,7}/,                                               /*Landline*/
		tel:        /^[1][0-9]{10}$/,                                   						     /*tel*/
		company:    /^[\u2E80-\u9FFFa-z0-9\"\'\(\)\-\_]+$/i,                                         /*companyName*/
		number:     /^[0-9]+$/,                                                                      /*number*/
		address:    /^([\u2E80-\u9FFF]+[a-z0-9\u2E80-\u9FFF\(\)\_\-]*){4,40}$/i,                     /*address*/
	},
	/*support touch*/
	hastouch : "ontouchstart" in window?true:false,
	/*browser information*/
	browser:{
		versions:function(){
			var u = navigator.userAgent, app = navigator.appVersion;
			return {//移动终端浏览器版本信息
				trident: u.indexOf('Trident') > -1, //IE
				presto: u.indexOf('Presto') > -1, //opera
				webKit: u.indexOf('AppleWebKit') > -1, //apple、chrome
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //fireFox
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language:(navigator.browserLanguage||navigator.language).toLowerCase()
		/*
		document.writeln("语言版本: "+browser.language+'<br/>');
		document.writeln(" 是否为移动终端: "+browser.versions.mobile+'<br/>');
		document.writeln(" ios终端: "+browser.versions.ios+'<br/>');
		document.writeln(" android终端: "+browser.versions.android+'<br/>');
		document.writeln(" 是否为iPhone: "+browser.versions.iPhone+'<br/>');
		document.writeln(" 是否iPad: "+browser.versions.iPad+'<br/>');
		document.writeln(navigator.userAgent+'<br/>');
		*/
	},
	addEvent:function(obj,sEv,fn){
		obj.addEventListener(sEv,fn,false);
	},
	addReady:function(fn){
		document.addEventListener('DOMContentLoaded',function(){
			fn && fn();
		},false);
	},
	//获取绝对定位
	getPos:function(obj){
		var l=0;
		var t=0;
		while(obj){
			l+=obj.offsetLeft;
			t+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		return {left:l,top:t};
	},
	findArr:function(arr,n){
		for(var i=0;i<arr.length;i++){
			if(arr[i]==n){
				return true;
			}
		}
		return false;
	},
	//随机数
	rnd:function (n,m){
		return Math.random()*(m-n)+n;
	},
	//双位数
	toDou:function(n){
		return n<10?'0'+n:n;
	},
	//获取非行间样式
	getStyle:function(obj,attr){//attr 属性
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	},
	//是否是子集
	isChild:function(oParent,obj){
		while(obj){
			if(oParent==obj) return true;
			obj=obj.parentNode;
		}
		return false;
	},
	//碰撞检测
	collTest:function(obj1,obj2){
		var l1=l.getPos(obj1).left;
		var t1=l.getPos(obj1).top;
		var r1=l.getPos(obj1).left+obj1.offsetWidth;
		var b1=l.getPos(obj1).top+obj1.offsetHeight;
		
		var l2=l.getPos(obj2).left;
		var t2=l.getPos(obj2).top;
		var r2=l.getPos(obj2).left+obj2.offsetWidth;
		var b2=l.getPos(obj2).top+obj2.offsetHeight;
		
		if(r1<l2 || l1>r2 || b1<t2 || t1>b2){
			return false;
		}else{
			return true;
		}
	},
	//AJAX
	ajax:function(options){

		function json2url(data){
			var arr=[];
			for(var i in data){
				arr.push(i+'='+encodeURIComponent(data[i]));  // arr --> [a=15,b=20,c=25]
			}
			var sData=arr.join('&'); //sData --> a=15&b=20&c=25
			
			return sData;
		}
		//定义默认的东西
		options=options||{};
		options.type=options.type||'get';
		options.data=options.data||{};
		if(!options.async) options.async=false;
		
		function statusFn(){
			if(oAjax.readyState==4){
				if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
					options.success && options.success(oAjax.responseText); //成功
				}else{
					options.error && options.error(oAjax.status); //失败
				}
				options.complete && options.complete(); //无论成功失败都会执行的函数
				clearTimeout(timer);
			}
		}
		switch(options.type.toLowerCase()){  
			// get post jsonp
			case 'get':
			case 'post':
				//ajax
				options.data.t=Math.random();
				//创建
				if(window.XMLHttpRequest){
					var oAjax=new XMLHttpRequest(); //非IE6
				}else{
					var oAjax=new ActiveXObject('Microsoft.XMLHttp'); //IE6
				}
				//连接
				//发送
				if(options.type=='get'){
					//get
					oAjax.open('get' , options.url+'?'+json2url(options.data) , options.async);
					oAjax.send();
				}else{ 
					//post
					oAjax.open('post' , options.url , options.async);
					oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
					oAjax.send(json2url(options.data));
				}
				
				//接收
				if(options.async){//true 异步
					oAjax.onreadystatechange=function(){
						statusFn();
					};
				}else{//false 同步
					statusFn();
				}
				
				//额外定义一个时间
				if(options.timeout){
					var timer=setTimeout(function(){
						options.error && options.error();
						options.complete && options.complete();
						oAjax.onreadystatechange=null; //既然都超时了 也就不接收了
					},options.timeout);
				}
				break;
			case 'jsonp':
				//jsonp
				var fnName='jsonp_'+Math.random();
				fnName=fnName.replace('.','');
				
				options.data[options.cbname]=fnName;
				
				window[fnName]=function(){ //定义的回调函数
					clearTimeout(timer);
					
					options.success && options.success.apply(this,arguments);
					options.complete && options.complete();
					
					oHead.removeChild(oS);
				};
				
				var oS=document.createElement('script');
				oS.src=options.url+'?'+json2url(options.data);
				
				var oHead=document.getElementsByTagName('head')[0];
				oHead.appendChild(oS);
				
				if(options.timeout){
					setTimeout(function(){
						options.error && options.error();
						options.complete && options.complete();
						
						oHead.removeChild(oS);
						window[fnName]=null;
					},options.timeout);
				}
				break;
		}
	},
	//横竖屏处理展示
	widescreen:function(){	
		var oLandscape=document.getElementById('landscape');
		var oLandscapeImg=oLandscape.getElementsByTagName('img')[0];
		oLandscape.addEventListener(down,function(ev){
			ev.cancelBubble=true;
			ev.preventDefault();
		},false);
		window.onorientationchange=function(){;
			if(window.orientation==-90){
				oLandscape.classList.add('landscapeShow');
				oLandscapeImg.className='moveLeft';
			}else if(window.orientation==90){
				oLandscape.classList.add('landscapeShow');
				oLandscapeImg.className='moveRight';
			}else if(window.orientation==0 || window.orientation==180 || window.orientation==-180){
				oLandscape.classList.remove('landscapeShow');
				oLandscapeImg.className='';
			}
		};
	},
	//自定义弹框
	alertFn:function(str,fn){
		var alert_box=l.id('alert_box');
		var alert_cont=l.id('alert_cont');
		var alert_ts=l.id('alert_ts');
		var sure_btn=l.id('sure_btn');
		//只添加一次事件
		var bAdd=alert_box.getAttribute('bAdd');
		if(str){alert_ts.innerHTML=str;}
		
		//显示
		alert_box.style.display='block';
		alert_box.style.width=alert_box.offsetWidth+'px';
		alert_box.classList.add('alert_boxShow');
		
		if(bAdd=='false'){
			alert_box.setAttribute('bAdd','true');
			
			//阻止默认事件
			alert_box.addEventListener(down,function(ev){
				ev.cancelBubble=true;
				ev.preventDefault();
			},false);
			
			//确定按钮
			sure_btn.addEventListener(up,function(ev){
				setTimeout(function(){
					alert_box.style.display='none';
					alert_box.classList.remove('alert_boxShow');
					fn && fn();
				},120);//防止隐藏太快 误点input加的
				ev.cancelBubble=true;
				ev.preventDefault();
			},false);
		}	
	},
	//loading
	loading:function(options){
		var oLoadShadowBox=l.id('loadShadowBox');
		var oTextLoad=l.id('textLoad');
		
		if(oTextLoad){
			setTimeout(function(){
				oTextLoad.classList.add('textLoadMove');
			},500);
		}
		
		var bLoad=false;
		
		//定义一个默认的时间
		if(!options.timer && options.timer!=0){
			options.timer=1500;
		}else{
			options.timer=options.timer;
		}
		
		/*if(oLoadShadowBox){
			oLoadShadowBox.addEventListener(down,function(ev){
				console.log(1)
				ev.cancelBubble=true;
				ev.preventDefault();
			},false);
		}*/
		
		//定义一个最大的时间
		timer=setTimeout(function(){
			bLoad=true;
		},5000);
		
		var aImg=null;
		var succ=0;//成功
		var erro=0;//失败
		
		if(options.imgArr=='img'){//获取所有img标签
			aImg=document.getElementsByTagName('img');
		}else{//获取 class
			aImg=document.getElementsByClassName(options.imgArr);
		}
		
		if(!options.bgArr){//没传bgArr的数组
			
			if(aImg.length>0){//获取到了Image
				for(var i=0;i<aImg.length;i++){
					createImgFn(aImg[i].src,aImg.length);
				}		
			}else{//没有length
				hasload('none');
			}
			
		}else{//传了bgArr数组
			
			var bgArr2=options.bgArr;
			for(var i=0;i<aImg.length;i++){
				bgArr2.push(aImg[i].src);
			}
			for(var i=0;i<bgArr2.length;i++){
				createImgFn(bgArr2[i],bgArr2.length);
			}
			
		}
		
		function createImgFn(obj,obj2){
			var oImg=new Image();
			oImg.onload=function(){
				succ++;				
				if(obj2==succ){
					hasload('none');
				}
				
			};
			
			oImg.onerror=function(){
				erro++;
				if(obj2==(succ+erro)){
					hasload('none');
					options.error && options.error();
				}
			};
			
			oImg.src=obj;
		}
		
		function loadHideFn(){
			oLoadShadowBox.classList.add('loadHide');
			oLoadShadowBox.removeEventListener('webkitTransitionEnd',loadHideFn,false);
		}
		
		function hasload(obj){
			if(oLoadShadowBox){
				if(obj=='none'){
					if(bLoad){//5秒钟以上了
						oLoadShadowBox.classList.add('loadOp');
						oLoadShadowBox.addEventListener('webkitTransitionEnd',loadHideFn,false);
						options.success && options.success();
					}else{//5秒钟以内
						setTimeout(function(){
							clearTimeout(timer);
							oLoadShadowBox.classList.add('loadOp');
							oLoadShadowBox.addEventListener('webkitTransitionEnd',loadHideFn,false);
							options.success && options.success();
						},options.timer);
					}
				}
			}
		}
	}
};
var down = l.hastouch?"touchstart":"mousedown";
var move = l.hastouch?"touchmove":"mousemove";
var up =  l.hastouch?"touchend":"mouseup";