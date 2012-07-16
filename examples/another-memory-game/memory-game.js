
var sgudjonsson = sgudjonsson || {};


if(!sgudjonsson.memory)
	throw "Missing required file 'sgudjonsson.memory-0.1.js'.";

if(!jQuery)
	throw "jQuery is required!";

var memoryGame = (function($) {

	var _private = {
			base: undefined,
			selected: [],
			games: [4,4,6,6,6,8,8,8,8,10,10,10,10,10],
			gameIndex: -1
		};

	var _methods = {
		secondsToTime: function(totalSeconds) {

			var pad = function pad(number, length) {
			    var str = '' + number;
			    while (str.length < length) {
			        str = '0' + str;
			    }
			    return str;
			};

		    var hours = Math.floor(totalSeconds / (60 * 60));
		   
		    var divisor_for_minutes = totalSeconds % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
		 
		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		   
		   	var text = "";
		   	if(hours > 0)
		   		text = pad(hours, 2) + ":";

		   	text += pad(minutes, 2) + ":"+ pad(seconds, 2);

		    var obj = {
		        hours: hours,
		        minutes: minutes,
		        seconds: seconds,
		        formatted: text
		    };
		    return obj;
		},
		play: function() {
			sgudjonsson.memory.create(_private.games[_private.gameIndex]);
			$("#debugger").find(".level").text(_private.gameIndex);
		}
	};

	return {
		next: function() {
			_private.gameIndex++;
			if(_private.gameIndex >= _private.games.length)
				_private.gameIndex = 0;

			_methods.play();
		},
		prev: function() {
			_private.gameIndex--;
			if(_private.gameIndex < 0)
				_private.gameIndex = (_private.games.length - 1);

			_methods.play()
		},
		load: function(elm) {
			_private.base = elm;

			sgudjonsson.memory.addListener("game-created", function(e) {

				$(_private.base)
					.empty()
					.addClass("memory-ui")
					.append("<div class='board'>")
					.append("<div class='actions'>");

				var $board = $(_private.base).find(".board");
				$board.addClass("cards"+ e.target.cards.length);

				//$board.append("<div class='timer'>")

				var blanksAt = [];
				if(e.target.cards.length == 8)
					blanksAt.push(4);


				for(var i = 0; i < e.target.cards.length; i++) {
					if(blanksAt.indexOf(i) > -1)
						$board.append("<div class='blank'>&nbsp;</div>");

					$board.append("<div class='card' data-index='"+ i +"'><span>"+ e.target.cards[i].key +"</span></div>");
				}

				var $actions = $(_private.base).find(".actions");

				$actions.append("<button id='action-game-prev'>Prev</button>");
				$actions.append("<button id='action-game-menu'>Menu</button>");
				$actions.append("<button id='action-game-next'>Next</button>");
			});

			sgudjonsson.memory.addListener("match-found", function(e) {
				for(var i = 0; i < e.target.indexes.length; i++) {
					$(_private.base).find(".card").eq(e.target.indexes[i]).addClass("done");
				}
			});

			sgudjonsson.memory.addListener("no-match-found", function(e) {
				for(var i = 0; i < e.target.indexes.length; i++) {
					$(_private.base).find(".card").eq(e.target.indexes[i])
						.addClass("no-match");
				}
			});

			sgudjonsson.memory.addListener("timer", function(e) {
				var totalSeconds = Math.floor(e.target.elapsed / 1000);
				var time = _methods.secondsToTime(totalSeconds);
				//$(_private.base).find(".timer").text(time.formatted);
				$("#debugger").find(".timer").text(time.formatted);
			})

			sgudjonsson.memory.addListener("game-won", function(e) {
			})

			$(".card", _private.base).live("click", function(e) {

				var d = $(this).data();
				if(_private.selected.indexOf(d.index) == -1 && !$(this).hasClass("done")) {

					if(_private.selected.length == 2) {
						$(_private.base).find(".card").removeClass("selected");
						_private.selected = [];
					}

					$(_private.base).find(".card").removeClass("no-match");
					$(this).addClass("selected");
					var selected = sgudjonsson.memory.selectCard(d.index);

					_private.selected.push(d.index)
				}
			});
		}
	}

})(jQuery);