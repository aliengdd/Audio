app.factory("audio",["$document",function($document){
	var audio = $document[0].createElement("audio");
	audio.loop= false;
	audio.volume = 0.4;
	audio.muted = false;
	return audio
}]);
app.factory("player",["audio","$rootScope","data","$filter",function(audio,$rootScope,data,$filter){
	var player ={
		playing:false,
		pasuing:false,
		ready:false,
		progress : null,
	   	progressBar : null,
	    data:[],
	    normalList:[],
	    randomList:[],
	    randomIndex:0,
	    index:0,
	    dotMouseDown:true,
	    playMode:[{index:1,name:"顺序播放"},{index:2,name:"列表循环"},{index:3,name:"单曲循环"},{index:4,name:"随机播放"}],
	    playModeState:0,
	    volume:parseInt(audio.volume*100),
	    PlayerGetMuted:function(){
	    	return audio.muted;
	    },
	    PlayerSrc:function(obj){
	    	audio.src=obj;
	    },
		//播放
		PlayerPlay:function(){
			if(player.ready = true){
				audio.play();
				player.playing=true;
				player.pasuing = false;
			}
		},
		//停止
		PlayerStop:function(){
				player.playing = false;
				player.pasuing = false;
				audio.pause();
				audio.currentTime = 0;
		},
		//暂停
		PlayerPasue:function(){
				player.pasuing = true;
				audio.pause();
		},
		//设置快进快退秒
		PlayerSpeed:function(obj){
			audio.currentTime = audio.currentTime + obj;		
		},
		//设置某一秒
		PlayerTime:function(obj){
			audio.currentTime = obj;
		},
		//获取总时间
		PlayerTotalTime:function(){
			return audio.duration;
		},
		//获取声音大小
		PlayerGetVolume:function(){
			return audio.volume;
		},
		//播放模式
		PlayerMode:function(){
			player.playModeState++;
			if(player.playModeState > player.playMode.length -1 ){
				player.playModeState = 0;
			}
			switch(player.playMode[player.playModeState].index){
				case 1:
					audio.loop = false;
				break;
				
				case 2:
					audio.loop = false;
				break;
				
				case 3:
					audio.loop = true;
				break;
				
				case 4:
					audio.loop = false;
					var guole = [];
					for(var i =0;i < player.data.length;i++){
						do{
							var obj = Math.round(Math.random()*(player.data.length-1));
						}while(guole.indexOf(obj) != -1)
						guole.push(obj);
					}
					player.randomList = angular.copy(guole);
					console.log(player.randomList)
				break;
			}
		},
		//下一首
		PlayerNext:function(){
			switch(player.playMode[player.playModeState].index){
				case 1:
					player.index ++;
					if( player.index == player.data.length ){
						player.PlayerStop();
						player.index = player.data.length -1;
					}else{
						player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
						player.PlayerPlay();
					}
				break;
				
				case 2:
					if( player.index == player.data.length-1){
						player.index = 0;
					}else{
						player.index ++;
					}
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
				
				case 3:
					if( player.index == player.data.length-1){
						player.index = 0;
					}else{
						player.index ++;
					}
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
				
				case 4:
					//首先通过这首歌的index找到randomIndex的位置
					player.randomIndex=player.randomList.indexOf(player.index);
					//通过这首歌的位置，判断下首歌的位置
					if(player.randomIndex == player.randomList.length -1){
						player.randomIndex =0;
					}else{
						player.randomIndex++
					}
					//这首歌的通过randomIndex找这首歌的index
					player.index = player.randomList[player.randomIndex];
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
			}
		},
		//选择到第几首
		PlayerChoice:function(obj){
			if(!player.playing){
				player.index = obj;
				player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
				player.PlayerPlay();
			}else{
				if(player.index == obj){
					if(player.pasuing){
						player.PlayerPlay();
					}else{
						player.PlayerPasue();
					}
				}else{
					player.index = obj;
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				}
			}
		},
		//上一首
		PlayerPrev:function(){
			switch(player.playMode[player.playModeState].index){
				case 1:
					player.index --;
					if( player.index < 0 ){
						player.PlayerStop();
						player.index = 0;
					}else{
						player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
						player.PlayerPlay();
					}
				break;
				
				case 2:
					if( player.index == 0){
						player.index = player.data.length-1;
					}else{
						player.index --;
					}
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
				
				case 3:
					if( player.index == 0){
						player.index = player.data.length-1;
					}else{
						player.index --;
					}
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
				
				case 4:
					//首先通过这首歌的index找到randomIndex的位置
					player.randomIndex=player.randomList.indexOf(player.index);
					//通过这首歌的位置，判断下首歌的位置
					if(player.randomIndex == 0){
						player.randomIndex =player.randomList.length -1;
					}else{
						player.randomIndex--
					}
					//这首歌的通过randomIndex找这首歌的index
					player.index = player.randomList[player.randomIndex];
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
			}
		},
		//补位
		timeFormat:function(obj,value){
			//只有为数是多少位，非法默认为2位；即（0-10); obj:数字,value:位数；
			//数值
			var val = 10;
			//位数
			var ws=2;
			//数字转字符串
			var reobj =(''+obj);
			if(value && angular.isNumber(value) && value >= 2){
				val = Math.pow(10,value-1);
				ws = value;
			}
			//补0
			if(obj <val){
				for(var i=ws;i>=1;i=ws - reobj.length){
					reobj='0'+reobj;
				}
				return reobj;
			}else{
				return reobj;
			}
		},
		//设置声音大小
		PlayerVolume:function(obj){
			var guole = audio.volume;
				guole = guole + (obj);
				if(guole < 0.01){
					guole = 0;
				}
				if(guole > 1){
					guole = 1;
				}
				audio.volume = guole;
		},
		PlayerDragVolume:function(obj){
			audio.volume = obj;
		},
		//静音
		PlayerMuted:function(){
				audio.muted = !audio.muted;
		}
	};
	//结束时
	audio.addEventListener('ended', function() {
		$rootScope.$apply(function(){
			switch(player.playMode[player.playModeState].index){
				case 1:
					player.index ++;
					if( player.index == player.data.length ){
						player.PlayerStop();
						player.index = player.data.length -1;
					}else{
						player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
						player.PlayerPlay();
					}
				break;
				
				case 2:
					if( player.index == player.data.length-1){
						player.index = 0;
					}else{
						player.index ++;
					}
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
				
				case 3:
				break;
				
				case 4:
					//首先通过这首歌的index找到randomIndex的位置
					player.randomIndex=player.randomList.indexOf(player.index);
					//通过这首歌的位置，判断下首歌的位置
					if(player.randomIndex == player.randomList.length -1){
						player.randomIndex =0;
					}else{
						player.randomIndex++
					}
					//这首歌的通过randomIndex找这首歌的index
					player.index = player.randomList[player.randomIndex];
					player.PlayerSrc(player.data[player.index].src+'/'+player.data[player.index].filename);
					player.PlayerPlay();
				break;
			}
		});
		console.log('ended')
	});
	//时间变化时
	audio.addEventListener('timeupdate', function(evt) {
	    $rootScope.$apply(function() {
	      //播放时间
	      player.progress = player.timeFormat(parseInt(parseInt(audio.currentTime)/60),2)+':'+player.timeFormat(parseInt(audio.currentTime)%60,2);
	      //播放百分比
	      player.progressBar = $filter('number')(audio.currentTime / audio.duration * 100,0);
	      //dot的位置
	      if(player.dotMouseDown){
	     	 player.dotPos = $filter('number')(audio.currentTime / audio.duration * 100,2);
	      }
	    });
 	});
 	//媒体可以播放时
 	audio.addEventListener('canplay', function(evt) {
	    player.ready = true;
	    player.duration = player.timeFormat(parseInt(parseInt(audio.duration)/60),2)+':'+player.timeFormat(parseInt(audio.duration)%60,2);
	});
	//媒体播放时
	audio.addEventListener('play', function(evt) {
	    console.log('play');
	});
	//声音改变时
	audio.addEventListener('volumechange', function(evt) {
		$rootScope.$apply(function() {
			player.volume = parseInt(audio.volume * 100);
		});
	});
	
	return player;
}]);

app.factory("JB",[function(){
		//var OsObject = "";
	   if(navigator.userAgent.indexOf("MSIE")>0) {  
			return "MSIE";  
	   }  
	   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){  
			return "Firefox";  
	   }  
	   if(isSafari=navigator.userAgent.indexOf("Safari")>0) {  
			return "Safari";  
	   }   
	   if(isCamino=navigator.userAgent.indexOf("Camino")>0){  
			return "Camino";  
	   }  
	   if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){  
			return "Gecko";  
	   }  
}]);

