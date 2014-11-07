angular
	.module('everydayApp', ['ngRoute'])
	.config(function($routeProvider, $httpProvider) {
		$routeProvider.when('/:year/:month/:day', {
			templateUrl: function(params) {
				return params.year + '/' + params.month + '/' + params.day + '.html';
			},
			controller: 'everydayCtrl'
		}).when('/404/', {
			templateUrl: '404.html',
			controller: 'everydayCtrl'
		}).otherwise({
			redirectTo: function() {
				var today = new Date();
				return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
			}
		});
	})
	.controller('everydayCtrl', function($scope, $routeParams, $location, $http) {
		var calendar = $scope.calendar = {};
		var current = $scope.current = {};
		var exists = $scope.exists = {};
		$scope.notFound = false;
		$scope.loaindg = true;


		$scope.$on('$routeChangeSuccess', function() {
			$scope.loading = false;
			var cur = $location.path().split('/');
			current.year = calendar.year = cur[1];
			current.month = calendar.month = cur[2];
			current.day = calendar.day = cur[3];

			$scope.notFound = false;
			var codes = document.getElementsByTagName('code');
			for (var i = codes.length; i--;) {
				hljs.highlightBlock(codes[i]);
			}
		});

		$scope.$on('$routeChangeError', function() {
			$scope.notFound = true;
			$scope.loading = false;
		});

		$scope.jumpTo = function(day) {
			if (day && (current.year != calendar.year || current.month != calendar.month || current.day != day)) {
				current.year = calendar.year;
				current.month = calendar.month;
				current.day = calendar.day = day;
				$scope.loading = true;
				$location.path('/' + calendar.year + '/' + calendar.month + '/' + day);
			}
		};
		$scope.exist = function(curDay) {
			return exists && exists[calendar.year] && exists[calendar.year][calendar.month] && exists[calendar.year][calendar.month][curDay]
		}
		$scope.selected = function(curDay) {
			return current.year == calendar.year && current.month == calendar.month && current.day == curDay;
		}
		$scope.prevMonth = function() {
			var month = +calendar.month - 1;
			var year = +calendar.year;
			if (month === 0) {
				month += 12;
				year--;
			}
			calendar.month = month;
			calendar.year = year;
		}
		$scope.nextMonth = function() {
			var month = +calendar.month + 1;
			var year = +calendar.year;
			if (month === 13) {
				month -= 12;
				year++;
			}
			calendar.month = month;
			calendar.year = year;
		}

		$scope.getFirstDay = function(year, month) { //获取每个月第一天再星期几 
			var firstDay = new Date(year, month - 1, 1);
			return firstDay.getDay(); //getDay()方法来获取 
		}

		$scope.getMonthLen = function(year, month) { //获取当月总共有多少天 
			var nextMonth = new Date(year, month, 1); //获取下个月的第一天 
			nextMonth.setHours(nextMonth.getHours() - 3); //由于获取的天是0时,所以减去3小时则可以得出该月的天数 
			return nextMonth.getDate(); //返回当天日期 
		}

		$scope.$watchGroup(['calendar.year', 'calendar.month'], function(newValues, oldValues, scope) {
			var year = newValues[0];
			var month = newValues[1];
			var monthLen = scope.getMonthLen(year, month);
			var firstDay = scope.getFirstDay(year, month);
			var list = scope.calendar.list = [
				[]
			];

			var cur, row, col, i;
			for (i = firstDay; i--;) {
				list[0].push('');
			}
			for (i = 1; i <= monthLen; i++) { //循环写入每天的值进入TABLE中
				cur = i + firstDay - 1;
				row = Math.floor(cur / 7);
				col = cur % 7;
				list[row] = list[row] || [];
				list[row].push(i);
			}
		});

		$http.get('everyday.json').success(function(data) {
			exists = data;
		});


		var cur = $location.path().split('/');
		current.year = calendar.year = cur[1];
		current.month = calendar.month = cur[2];
		current.day = calendar.day = cur[3];
	});