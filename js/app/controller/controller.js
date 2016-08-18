app.controller("mm",["$scope","player","data","fdata","$location","$filter",function($scope,player,data,fdata,$location,$filter){
	$location.url('/list'); 
	$scope.player = player;
	$scope.data = data;
	$scope.player.data = $scope.data;
	
	$scope.player.PlayerSrc($scope.player.data[$scope.player.index].src+'/'+$scope.player.data[$scope.player.index].filename);
	
	$scope.fdata = fdata;
	$scope.glClickValue=[];
	$scope.clickll=function(obj){
		if($scope.glClickValue[obj] == true){
			return true;
		}
			for(var i=0;i<$scope.data.length;i++){
				$scope.glClickValue[i] = false;
			}
			console.log(1)
			$scope.glClickValue[obj]=true;
	}
	
	$scope.glLeftClickValue=[true,false,false];
	$scope.clickleft=function(obj){
		if($scope.glLeftClickValue[obj] == true){
			return true;
		}
		for(var i=0;i<3;i++){
			$scope.glLeftClickValue[i] = false;
		}
		$scope.glLeftClickValue[obj]=true;
	}
	
	$scope.TwoDefaultHeight = document.body.clientHeight - 80-60;
	$scope.ThreeMiddleWidth = parseInt(document.body.clientWidth - 210-150-10);
	if($scope.ThreeMiddleWidth < 350){
		$scope.ThreeMiddleWidth = 350;
	}
	$scope.ThreePlayerProgressWidth = $scope.ThreeMiddleWidth - 70-70;
	$scope.TwoPlayerCols= document.body.clientWidth - 200;
	$scope.TwoPlayerTableHeight = $scope.TwoDefaultHeight - 40;
	window.onresize = function () {
		$scope.$apply(function(){
			$scope.TwoDefaultHeight = document.body.clientHeight - 80-60;
			$scope.TwoPlayerCols= document.body.clientWidth - 200;
			$scope.TwoPlayerTableHeight = $scope.TwoDefaultHeight - 40;
			$scope.ThreeMiddleWidth = parseInt(document.body.clientWidth - 210-150-10);
			if($scope.ThreeMiddleWidth < 350){
				$scope.ThreeMiddleWidth = 350;
			}
			$scope.ThreePlayerProgressWidth = $scope.ThreeMiddleWidth - 70-70;
		});
	}
	
	//排序
	function sortBy(array, key) {
	    return array.sort(function(a, b) {
	        var x = a['info'][key]; var y = b['info'][key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
	function sortByR(array, key) {
	    return array.sort(function(a, b) {
	        var y = a['info'][key]; var x = b['info'][key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
	$scope.orderguo=function(obj,str){
		if($scope.orderType){
			sortBy($scope.data, str);
			$scope.orderType=false;
		}else{
			sortByR($scope.data,str);
			$scope.orderType=true;
		}
		angular.forEach($scope.data,function(item){
			//过滤规则
			if(item.sid == obj ){
				$scope.player.index = $scope.data.indexOf(item);
			}
		})
		for(var i=0;i<$scope.data.length;i++){
			$scope.glClickValue[i] = false;
		}
		//$scope.glClickValue[$scope.player.index] = true;
	}
	
}]);