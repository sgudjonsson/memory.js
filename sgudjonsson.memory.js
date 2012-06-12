

// based on http://stackoverflow.com/a/962890/90670
Array.prototype.shuffle = function() {
	var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }

    return this;
};

var sgudjonsson = sgudjonsson || {};

sgudjonsson.memory = (function() {

	var _private = {
		cards: [],
		maximumNumberOfSets: 10,
		eventListeners: {}
	};

	var _methods = {

		// Basic game logic

		checkMemory: function() {

			var selected = [];
			for(var i = 0; i < _private.cards.length; i++) {
				if(_private.cards[i].isSelected)
					selected.push(i);
			}

			if(selected.length == 2)
			{
				if(_private.cards[selected[0]].key == _private.cards[selected[1]].key)
				{
					_private.cards[selected[0]].isDone = true;
					_private.cards[selected[1]].isDone = true;

					_methods.fire({ type: "match-found", target: { indexes: selected } });
				}
				else
					_methods.fire({ type: "no-match-found", target: { indexes: selected } });

				_private.cards[selected[0]].isSelected = false;
				_private.cards[selected[1]].isSelected = false;
			}

			var dones = 0;
			for(var i = 0; i < _private.cards.length; i++) {
				if(_private.cards[i].isDone)
					dones++;
			}

			if(dones == _private.cards.length)
				_methods.fire({ type: "game-won" });
		},

		shuffleCards: function() {
			_private.cards.shuffle()
		},

		loadCards: function(numberOfSets) {
			_private.cards = [];
			numberOfSets = Math.min(numberOfSets, _private.maximumNumberOfSets);

			for(var i = 0; i < numberOfSets; i++) {
				_private.cards.push({
					key: i,
					isSelected: false,
					isDone: false
				});

				_private.cards.push({
					key: i,
					isSelected: false,
					isDone: false
				});
			}
		},

		selectCardAtIndex: function(index) {
			if(index >= _private.cards.length || index < 0)
				throw "Index is out of range. Max index is " + (_private.cards.length - 1);

			if(!_private.cards[index].isSelected && !_private.cards[index].isDone) {
				_private.cards[index].isSelected = true;
				_methods.fire({ type: "card-selected", target: { card: _private.cards[index] }});
				_methods.checkMemory();
			}
		},


		// Event listeners

		addListener: function(type, listener) {
			if (typeof _private.eventListeners[type] == "undefined"){
	            _private.eventListeners[type] = [];
	        }

	        _private.eventListeners[type].push(listener);
		},

		removeListener: function(type, listener){
	        if (_private.eventListeners[type] instanceof Array){
	            var listeners = _private.eventListeners[type];
	            for (var i=0, len=listeners.length; i < len; i++){
	                if (listeners[i] === listener){
	                    listeners.splice(i, 1);
	                    break;
	                }
	            }
	        }
	    },

	    fire: function(event){
	        if (typeof event == "string")
	            event = { type: event };
	        if (!event.target)
	            event.target = {};

	        if (!event.type)
	            throw "Event object missing 'type' property.";

	        if (_private.eventListeners[event.type] instanceof Array){
	            var listeners = _private.eventListeners[event.type];
	            for (var i=0, len=listeners.length; i < len; i++){
	                listeners[i].call(this, event);
	            }
	        }
	    }
	};

	return {
		create: function(numberOfSets) {
			_methods.loadCards(numberOfSets || _private.maximumNumberOfSets);
			_methods.shuffleCards();

			_methods.fire({ type: "game-created", target: { cards: _private.cards }});
		},
		selectCard: function(index) {
			_methods.selectCardAtIndex(index);
		},
		addListener: function(type, listener) {
			_methods.addListener(type, listener);
		}
	}

})();