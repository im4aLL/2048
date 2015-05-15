'use strict';

var Game = function(){
    this.grid = [4, 4];

    this.gridZone = {
        a1: { digit: 0 },
        a2: { digit: 0 },
        a3: { digit: 0 },
        a4: { digit: 0 },
        b1: { digit: 0 },
        b2: { digit: 0 },
        b3: { digit: 0 },
        b4: { digit: 0 },
        c1: { digit: 0 },
        c2: { digit: 0 },
        c3: { digit: 0 },
        c4: { digit: 0 },
        d1: { digit: 0 },
        d2: { digit: 0 },
        d3: { digit: 0 },
        d4: { digit: 0 }
    };

    this.gridZoneKeys = _.keys(this.gridZone);
};

Game.prototype.generateGrid = function(){
    var self = this;

    var gridHtml = '';
    for( var i = 0; i < self.grid[0]; i++) {
        gridHtml += new Array(self.grid[1] + 1).join('<div class="puzzle--game--node"></div>');
    }

    $('.puzzle--game').prepend(gridHtml);
};

Game.prototype.start = function(){
    this.generateGrid();
    this.generateFirstTwoBlock();
    this.watchKeyboard();
};

Game.prototype.generateFirstTwoBlock = function(){
    var firstTwoBlocks = _.sample(this.gridZoneKeys, 2);
    var html = '<div class="puzzle--game--tiles--item '+firstTwoBlocks[0]+'">2</div><div class="puzzle--game--tiles--item '+firstTwoBlocks[1]+'">2</div>';
    $('.puzzle--game--tiles').html(html);

    this.gridZone[firstTwoBlocks[0]].digit = 2;
    this.gridZone[firstTwoBlocks[1]].digit = 2;
};

Game.prototype.watchKeyboard = function(){
    var self = this;

    $('html').keydown(function(e){
        if(e.which >= 38 && e.which <=40 ){
            e.preventDefault();
        }

        switch(e.which) {
        case 39:
            self.rightKeyHandler();
            break;

        case 37:
            console.log('left');
            break;

        case 38:
            console.log('top');
            break;

        case 40:
            console.log('bottom');
            break;
        }
    });
};

Game.prototype.keysHasValue = function(){
    var keys = _.mapObject(this.gridZone, function(val) {
        return val.digit > 0;
    });

    var filteredKey = [];
    _.mapObject(keys, function(val, key) {
        if(val === true) {
            filteredKey.push(key);
        }
    });

    return filteredKey;
};

Game.prototype.getGridKeysByColumn = function(){
    var splittedArray = _.groupBy(this.gridZoneKeys, function(val, index){
        return Math.floor(index / 4);
    });

    return splittedArray;
};

Game.prototype.getGridKeysByRow = function(){
    var splittedArray = {};
    var splittedArrayByColumn = this.getGridKeysByColumn();

    for(var i = 0; i < 4; i++) {
        splittedArray[i] = [splittedArrayByColumn[0][i], splittedArrayByColumn[1][i], splittedArrayByColumn[2][i], splittedArrayByColumn[3][i]];
    }

    return splittedArray;
};

Game.prototype.rightKeyHandler = function(){
    var grid = this.getGridKeysByRow();
    var gridBlocks = this.keysHasValue();

    console.log( grid );

    _.each(gridBlocks, function(block){
        console.log(block);
    });
};

jQuery(document).ready(function() {
    var game = new Game();
    game.start();
});
