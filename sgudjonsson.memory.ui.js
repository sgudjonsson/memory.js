
var sgudjonsson = sgudjonsson || {};


if(!sgudjonsson.memory)
	throw "Missing required file 'sgudjonsson.memory.js'.";

if(!jQuery)
	throw "jQuery is required!";

sgudjonsson.memory.ui = (function($) {

	var _private = {
		base: undefined
	};

	return {
		load: function(elm) {
			_private.base = elm;

			sgudjonsson.memory.events.addListener("game-created", function(e) {
				$(_private.base).empty().append("<ul>");
				var $ul = $(_private.base).find("ul");

				for(var i = 0; i < e.target.cards.length; i++) {
					$ul.append("<li data-index='"+ i +"'>"+ e.target.cards[i].key +"</li>");
				}

				console.log($ul);
			});

			$("li", _private.base).live("click", function(e) {
				console.log($(this).data());
			});
		}
	}

})(jQuery);