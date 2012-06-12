
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
				$(_private.base)
					.empty()
					.addClass("memory-ui")
					.append("<ul>");

				var $ul = $(_private.base).find("ul");

				for(var i = 0; i < e.target.cards.length; i++) {
					$ul.append("<li data-index='"+ i +"'>"+ e.target.cards[i].key +"</li>");
				}
			});

			sgudjonsson.memory.events.addListener("match-found", function(e) {
				for(var i = 0; i < e.target.indexes.length; i++)
					$(_private.base).find("li").eq(e.target.indexes[i]).addClass("done");

				$(_private.base).find("li").removeClass("selected");
			});

			sgudjonsson.memory.events.addListener("no-match-found", function(e) {
				$(_private.base).find("li").removeClass("selected");
			});

			sgudjonsson.memory.events.addListener("game-won", function(e) {
				$(_private.base).empty().append("<div class='won'>You won!</div>");

				$(".won").live("click", function() {
					sgudjonsson.memory.create(Math.floor(Math.random() * 10) + 2);
				});
			})

			$("li", _private.base).live("click", function(e) {
				var d = $(this).data();
				$(this).addClass("selected");
				sgudjonsson.memory.selectCard(d.index);
			});
		}
	}

})(jQuery);