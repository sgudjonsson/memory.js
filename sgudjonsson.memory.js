

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

// Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
// MIT License

// http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/

function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};

var sgudjonsson = sgudjonsson || {};

sgudjonsson.memory = (function() {

	var _private = {
		cards: [],
		maximumNumberOfSets: 3,
		events: new EventTarget()
	};

	var _methods = {

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

					_private.events.fire({ type: "match-found", target: { indexes: selected } });
				}
				else
					_private.events.fire({ type: "no-match-found", target: { indexes: selected } });

				_private.cards[selected[0]].isSelected = false;
				_private.cards[selected[1]].isSelected = false;
			}

			var dones = 0;
			for(var i = 0; i < _private.cards.length; i++) {
				if(_private.cards[i].isDone)
					dones++;
			}

			if(dones == _private.cards.length)
				_private.events.fire({ type: "game-won" });
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
				_methods.checkMemory();
			}
		}

	};

	return {
		create: function(numberOfSets) {
			_methods.loadCards(numberOfSets || _private.maximumNumberOfSets);
			_methods.shuffleCards();

			_private.events.fire({ type: "game-created", target: { cards: _private.cards }});
		},
		selectCard: function(index) {
			_methods.selectCardAtIndex(index);
		},
		events: _private.events
	}

})();