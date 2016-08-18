app.directive('glPlay', [function() {
  return {
	    restrict: 'EA',
	    replace: true,
	    scope: {
	      player: '=player',
	      index:'=index'
	    },
	    template: '<button class="btn btn-info">play</button></div>',
	    link: function(scope , iElement , iAttrs , controller) {
	    	scope.player.src(scope.player.data[scope.player.index].src+'/'+scope.player.data[scope.player.index].filename)
	    	iElement.on('click',function(){
	    		scope.player.play();
	    	});
	    }
  }
}]);
//时豆-----------------------
app.directive('glProgressDot', ["$document",function($document) {
  return {
	    restrict: 'EA',
	    replace: true,
	    scope: {
	      player: '=player',
	    },
	    template: '<span class="gl-drag-dot gl-position-abs"></span>',
	    link: function(scope , iElement , iAttrs , controller){
	    			var abc;
	    			//console.log(scope)
	    			scope.$watch('player.dotPos',function(newvalue,oldvalue){
							if(iElement.position().left >= (iElement.parent().width() - iElement.width())){
								iElement.css({"left":(iElement.parent().width() - iElement.width())});
							}
						},true);
	    			iElement.on({
	    				'mousedown':function(){
	    					scope.player.dotMouseDown=false;
	    					$(document).on({
	    						'mousemove':function(e){
		    						console.log(angular.element('.glProgressContainer').offset())
		    						iElement.css({"left":(e.pageX-3-angular.element('.glProgressContainer').offset().left)});
		    						angular.element(".glProgressProgressBar").css({"width":(e.pageX- 3 - angular.element(".glProgressContainer").offset().left)});
		    						if(iElement.position().left < 3){
		    							iElement.css({"left":0});
		    							angular.element(".glProgressProgressBar").css({"width":0});
		    						}else if(iElement.position().left > iElement.parent().width() - iElement.width()){
		    							iElement.css({"left":(iElement.parent().width() - iElement.width())});
		    							angular.element(".glProgressProgressBar").css({"width":(iElement.parent().width())});
		    						}
		    						abc = parseInt((iElement.position().left/(iElement.parent().width() - iElement.width()))*scope.player.PlayerTotalTime());
		    						return false;	
	    						},
	    							'mouseup':function(){
					    				scope.player.PlayerTime(abc);
					    				scope.player.PlayerPlay();
					    				scope.player.dotMouseDown=true;
					    				//这么做是为了不让点击时候出发事件
											$(document).off("mousemove");
											$(document).off("mouseup");
											return false
	    						}
	    					});
	    					return false;
	    			}
	    			});
	    			$(document).on("mouseup",function(){
	    				//这么做是为了不让点击时候出发事件
							$(document).off("mousemove");
							scope.player.dotMouseDown=true;
							//$(document).off("mouseup");
							return false
						});
	    }
  }
}]);
//时轴
app.directive('glProgress', [function() {
  return {
	    restrict: 'E',
	    replace: true,
	    scope: {
	      player: '=player',
	    },
	    templateUrl:'./tmp/progress/progress.html',
	    link: function(scope , iElement , iAttrs , controller){
	    	var bbc;
	    	angular.element('.glProgressClick').on('click',function(e){
	    		 bbc = parseInt(((e.pageX- angular.element(".glProgressContainer").offset().left)/angular.element('.glProgressClick').width())*scope.player.PlayerTotalTime());
	    		 scope.player.PlayerTime(bbc);
	    		 scope.player.PlayerPlay();
	    	})
	    }
  }
}]);


//音豆------------------------------------------------------------------------------------
app.directive('glVolumeDot', ["$document","JB","$timeout",function($document,JB,$timeout) {
  return {
	    restrict: 'EA',
	    replace: true,
	    scope: {
	      player: '=player',
	      showvolume:'=showvolume'
	    },
	    template: '<span class="gl-position-abs gl-white gl-volume-dot"></span>',//
	    link: function(scope , iElement , iAttrs , controller){
	    			iElement.css({'top':(1-scope.player.PlayerGetVolume())*angular.element('.glVolumeProgress').height() + angular.element('.glVolumeProgress').position().top });
	    			if(iElement.position().top > angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height()){
	    					iElement.css({"top":(angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height())});
	    			}
	    			var abc;
	    			var bbc;
	    			iElement.on({
	    				'mousedown':function($event){
	    					$(document).on({
	    						'mousemove':function(e){
		    						//e.pageY y坐标
		    						iElement.css({"top":(e.pageY-5-(angular.element('.glVolumeContainer').offset().top))});
		    						if(iElement.position().top < angular.element('.glVolumeProgress').position().top){
		    							iElement.css({"top":angular.element('.glVolumeProgress').position().top});
		    						}else if(iElement.position().top > angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height()){
		    							iElement.css({"top":(angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height())});
		    						}
										abc = 1-(iElement.position().top - angular.element('.glVolumeProgress').position().top)/(angular.element('.glVolumeProgress').height()-iElement.width());
										scope.player.PlayerDragVolume(abc);
										$event.stopPropagation();
		    						return false;	
	    						},
	    							'mouseup':function($event){
					    				//这么做是为了不让点击时候出发事件
											$(document).off("mousemove");
											$(document).off("mouseup");
											$event.stopPropagation(); 
	    						}
	    					});
	    					return false;
	    			}
	    			});
	    			
	    			iElement.parent().on('click',function($event){

	    				$event.stopPropagation(); 
	    			})
	    			
	    			$(document).on("mouseup",function($event){
	    				//这么做是为了不让点击时候出发事件
							$(document).off("mousemove");
							$event.stopPropagation(); 
							return false
						});
						//
						angular.element('.glWai').on('click',function($event){
								scope.$apply(function(){
									scope.showvolume = false;
								})
							$event.stopPropagation(); 
							return false
						}); 
						//
						if(JB == 'Firefox'){
								document.addEventListener('DOMMouseScroll',function(event){
									if(scope.showvolume){
										if(event.detail > 0){
												bbc = -0.05;
										}else if(event.detail < 0){
												bbc = 0.05;
										}
										scope.player.PlayerVolume(bbc);
										iElement.css({'top':(1-scope.player.PlayerGetVolume())*angular.element('.glVolumeProgress').height() + angular.element('.glVolumeProgress').position().top });
										if(iElement.position().top > angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height()){
		    					iElement.css({"top":(angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height())});
		    					}
								}else{
									
								}
							});
						}else{
								$document.on("mousewheel",function(event){
									if(scope.showvolume){
										event = event || window.event;
								   		if(event.originalEvent.wheelDelta < 0){
								   			bbc = -0.05;
								   		}else if(event.originalEvent.wheelDelta > 0){
								   			bbc = 0.05;
								   		}
								   		scope.player.PlayerVolume(bbc);
								   		iElement.css({'top':(1-scope.player.PlayerGetVolume())*angular.element('.glVolumeProgress').height() + angular.element('.glVolumeProgress').position().top });
								   		if(iElement.position().top > angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height()){
	    							iElement.css({"top":(angular.element('.glVolumeProgress').position().top + angular.element('.glVolumeProgress').height() - iElement.height())});
	    						}
								}else{
									
								}
							});
						}
						
	    }
  }
}]);

//音轴
app.directive('glVolume', [function() {
  return {
	    restrict: 'EA',
	    replace: true,
	    scope: {
	      player: '=player',
	      showvolume:'=showvolume'
	    },
	    templateUrl:'./tmp/volume/volume.html',
	    link: function(scope , iElement , iAttrs , controller){
	    }
  }
}]);
//喇叭------------------------------------------
app.directive('glTrumpet', ["$document",function($document) {
  return {
	    restrict: 'E',
	    replace: true,
	    scope: {
	      player: '=player',
	      showvolume:'=showvolume',
	    },
	    templateUrl:'./tmp/trumpet/trumpet.html',
	     link: function(scope , iElement , iAttrs , controller){
					     iElement.on('click',function($event){
					     		$event.stopPropagation();
					     });
	    }
  }
}]);
//播放时候的css动画
app.directive('glPlayerLoop', [function() {
  return {
	    restrict: 'E',
	    replace: true,
	    template:'<span class="guole"><i class="guole-i-one"></i><i class="guole-i-two"></i><i class="guole-i-three"></i><i class="guole-i-four"></i></span>'
  }
}]);
//这个是上一下、播放/暂停、下一首的按钮
app.directive('glPlayerButton', [function() {
  return {
	    restrict: 'E',
	    replace: true,
	    templateUrl:'./tmp/buttongroup/buttongroup.html'
  }
}]);
//播放模式的切换
app.directive('glPlayerMode', [function() {
  return {
	    restrict: 'E',
	    replace: true,
	    templateUrl:'./tmp/playermode/playermode.html'
  }
}]);
//playingList歌曲列别的拖拽排序
app.directive("guoPlayingListDrag",["$timeout",function($timeout){
	return {
			restrict:'ECAM',
			templateUrl:'./tmp/playinglist/li.html',
			replace:true,
			sceop:{
	      player: '=player',
	      item:'=item',
				data:'=data'
	    },
			link:function(scope , iElement , iAttrs , controller){
					scope.abc;
					iElement.on({
						'mousedown':function(){
							$('.guo-list-drag').remove();
							scope.timer=$timeout(function(){
								iElement.parent().append(angular.element('<div class="guo-list-drag"></div>'));
								$('.guo-list-drag').html('<span>'+scope.item.info.name+'<span> - <span>'+scope.item.info.singer+'<span><i class="fa fa-music" style="color:rgba(200,120,50,1);padding-left:15px;"><i>')
								$('.guo-list-drag').css({'top':iElement.offset().top-iElement.parent().offset().top});
								$(document).on('mousemove',function(e){
									$('.guo-list-drag').css({'top':parseInt((e.pageY-iElement.parent().offset().top)/40)*40});
									if($('.guo-list-drag').offset().top < iElement.parent().offset().top){
										$('.guo-list-drag').css({'top':'0px'});
									}else if($('.guo-list-drag').offset().top >iElement.parent().offset().top+iElement.parent().height()-iElement.height()){
										$('.guo-list-drag').css({'top':iElement.parent().height()-iElement.height()});
									}
									return false;
								});
								$(document).on('mouseup',function(e){
									$(document).off('mousemove')	
									$(document).off('mouseup')
									$('.guo-list-drag').remove();
									scope.$apply(function(){
										var abc = scope.data.indexOf(scope.item);
										var bbc = parseInt((e.pageY-iElement.parent().offset().top)/iElement.height());
										console.log('abc'+abc);
										console.log('bbc'+bbc);
										if(abc < bbc){
											scope.data.splice(bbc+1,0,scope.item);
											scope.data.splice(abc,1);
										}else if(abc > bbc){
											scope.data.splice(abc,1);
											scope.data.splice(bbc,0,scope.item);
										}
										//划分情况
										//1没开始播放
										if(scope.player.playing == false){
											scope.player.PlayerSrc(scope.player.data[scope.player.index].src+'/'+scope.player.data[scope.player.index].filename);
										}
										//2开始播放
										if(scope.player.playing == true){
											//拖拽的是正在播放的
											if(scope.player.index == abc){
													scope.player.index = bbc;
											}else if((abc < scope.player.index) &&( scope.player.index < bbc)){
												scope.player.index = scope.player.index - 1;
											}else if((bbc < scope.player.index) &&( scope.player.index < abc)){
												scope.player.index = scope.player.index + 1;
											}
											//拖拽没有播放的
										//	if(((scope.player.index < abc) && (scope.player.index < bbc)) || ((scope.player.index > abc) && (scope.player.index > bbc))){}
											
										
										//	if( abc > scope.player.index > bbc ){
										//		scope.player.index = scope.player.index + 1;
										//	}
											
										}
										
									})
								});
							},800);
							
						},
						'mouseup':function(){
							$(document).off('mouseup')
							$timeout.cancel(scope.timer);
							$('.guo-list-drag').remove();
							
						}
					});
					
					iElement.on("mousemove",function(){
						$timeout.cancel(scope.timer);
					});
			
			}
	}
}]);
//favorite歌曲列别的拖拽排序
app.directive("guoFavListDrag",["$timeout",function($timeout){
	return {
			restrict:'ECAM',
			templateUrl:'./tmp/favorite/li.html',
			replace:true,
			scope:{
				item:'=item',
				data:'=data'
			},
			link:function(scope , iElement , iAttrs , controller){
					scope.abc;
					iElement.on({
						'mousedown':function($event){
							scope.timer=$timeout(function(){
								iElement.parent().append(angular.element('<div class="guo-list-drag"></div>'));
								$('.guo-list-drag').html('<i class="fa fa-music" style="color:rgba(200,100,50,1)"><i><span>'+scope.item.info.name+'<span> - <span>'+scope.item.info.singer+'<span>')
								$('.guo-list-drag').css({'top':iElement.offset().top-iElement.parent().offset().top});
								$(document).on('mousemove',function(e){
									$('.guo-list-drag').css({'top':parseInt((e.pageY-iElement.parent().offset().top)/40)*40});
									if($('.guo-list-drag').offset().top < iElement.parent().offset().top){
										$('.guo-list-drag').css({'top':'0px'});
									}else if($('.guo-list-drag').offset().top >iElement.parent().offset().top+iElement.parent().height()-iElement.height()){
										$('.guo-list-drag').css({'top':iElement.parent().height()-iElement.height()});
									}
									return false;
								});
								$(document).on('mouseup',function(e){
									$(document).off('mousemove')	
									$(document).off('mouseup')
									$('.guo-list-drag').remove();
									scope.$apply(function(){
										var abc = scope.data.indexOf(scope.item);
										var bbc = parseInt((e.pageY-iElement.parent().offset().top)/iElement.height());
										if(abc < bbc){
											scope.data.splice(bbc+1,0,scope.item);
											scope.data.splice(abc,1);
										}else if(abc > bbc){
											scope.data.splice(abc,1);
											scope.data.splice(bbc,0,scope.item);
										}
										
									})
								});
							},800);
							$event.stopPropagation();
						},
						'mouseup':function($event){
							$(document).off('mouseup')
							$timeout.cancel(scope.timer);
							$event.stopPropagation();
						}
					});
					
					iElement.on("mousemove",function(){
						$timeout.cancel(scope.timer);
					});
			}
	}
}]);