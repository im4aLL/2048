'use strict';

var Game = function(){
    this.grid = [4, 4];

    this.gridZone = {
        a1: { digit: 0, isAbleMarge: true },
        a2: { digit: 0, isAbleMarge: true },
        a3: { digit: 0, isAbleMarge: true },
        a4: { digit: 0, isAbleMarge: true },
        b1: { digit: 0, isAbleMarge: true },
        b2: { digit: 0, isAbleMarge: true },
        b3: { digit: 0, isAbleMarge: true },
        b4: { digit: 0, isAbleMarge: true },
        c1: { digit: 0, isAbleMarge: true },
        c2: { digit: 0, isAbleMarge: true },
        c3: { digit: 0, isAbleMarge: true },
        c4: { digit: 0, isAbleMarge: true },
        d1: { digit: 0, isAbleMarge: true },
        d2: { digit: 0, isAbleMarge: true },
        d3: { digit: 0, isAbleMarge: true },
        d4: { digit: 0, isAbleMarge: true }
    };

    this.gridZoneKeys = _.keys(this.gridZone);
    this.moved = false;
    this.score = 0;

    this.winValue = 2048;
    this.changing = false;
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
    this.resetKeyValues();
    this.generateGrid();
    this.generateNblock();
    this.watchKeyboard();
};

Game.prototype.resetKeyValues = function(){
    this.blockKey = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };
};

Game.prototype.checkGameOver = function(){
    if(this.blockKey.left === true && this.blockKey.right === true && this.blockKey.top === true && this.blockKey.bottom === true) {
        $('.puzzle--game--note').removeClass('is-hidden');
    }
};

Game.prototype.checkWin = function(){
    var self = this;

    _.each(self.gridZone, function(value, key){
        if(self.gridZone[key].digit === self.winValue) {
            $('.puzzle--game--note').removeClass('is-hidden').html('Congratulation! You won :) <br> <small>Reload the browser to play again!</small>');
        }
    });
};

Game.prototype.generateNblock = function(n){
    var self = this;
    n = typeof n !== 'undefined' ? n : 2;
    var nBlocks = _.sample(this.gridZoneKeys, n);

    var html = '';
    for(var i = 0; i < n; i++) {
        var value = 2;

        html += '<div class="puzzle--game--tiles--item '+nBlocks[i]+' is-'+value+'">'+ value +'</div>';
        self.gridZone[nBlocks[i]].digit = value;
    }

    $('.puzzle--game--tiles').append(html);
};

Game.prototype.watchKeyboard = function(){
    var self = this;

    $('html').keydown(function(e){
        if(e.which >= 38 && e.which <=40 ){
            e.preventDefault();
        }

        switch(e.which) {
        case 39:
            self.keyHandler('right');
            break;

        case 37:
            self.keyHandler('left');
            break;

        case 38:
            self.keyHandler('top');
            break;

        case 40:
            self.keyHandler('bottom');
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

Game.prototype.keysHasNotValue = function(){
    var keys = _.mapObject(this.gridZone, function(val) {
        return val.digit > 0;
    });

    var filteredKey = [];
    _.mapObject(keys, function(val, key) {
        if(val === false) {
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

Game.prototype.keyHandler = function(direction){
    var self = this;

    if(self.changing === true) {
        return;
    }

    self.changing = true;
    var gridBlocks = this.keysHasValue();
    var generateNewBlock = false;

    var grid;
    if(direction === 'top' || direction === 'bottom') {
        grid = this.getGridKeysByColumn();
    }
    else if(direction === 'left' || direction === 'right') {
        grid = this.getGridKeysByRow();
    }


    if(direction === 'left' || direction === 'top') {
        _.each(grid, function(value, key){
            grid[key].reverse();
        });
    }
    else if(direction === 'right' || direction === 'bottom') {
        gridBlocks.reverse();
    }

    _.each(gridBlocks, function(block){

        var newBlock = block;
        var newBlockVal = self.gridZone[block].digit;
        var isMarge = false;

        _.each(grid, function(rowArray){
            isMarge = false;

            var indexOfBlock = _.indexOf(rowArray, block);
            if(indexOfBlock !== -1) {

                for(var i = indexOfBlock; i < 4; i++) {
                    if(i > indexOfBlock) {

                        if(self.gridZone[rowArray[i]].digit === 0) {
                            newBlock = rowArray[i];
                            generateNewBlock = true;
                        }
                        else if( self.gridZone[rowArray[i]].digit !== self.gridZone[block].digit ){
                            return;
                        }
                        else if( self.gridZone[rowArray[i]].digit === self.gridZone[block].digit && self.gridZone[rowArray[i]].isAbleMarge === true ) {
                            newBlock = rowArray[i];
                            newBlockVal += newBlockVal;
                            isMarge = true;
                            generateNewBlock = true;

                            if(newBlockVal > 0) {
                                self.updateScore(newBlockVal);
                            }
                        }
                    }
                }

            }

            if(isMarge === true) {
                self.gridZone[block].digit = 0;
                self.gridZone[newBlock].isAbleMarge = false;
            }

        });

        self.change({
            old: { tile: block, val: 0 },
            new: { tile: newBlock, val: newBlockVal }
        });

    });


    self.resetMergeValue();

    if(self.moved === true) {
        self.generateNewTile();
    }
    else {
        self.blockKey[direction] = true;
    }

    self.checkGameOver();
    self.checkWin();
    self.changing = false;
};

Game.prototype.resetMergeValue = function(){
    var self = this;

    _.each(self.gridZone, function(val, key){
        self.gridZone[key].isAbleMarge = true;
    });
};

Game.prototype.change = function(obj){
    var self = this;

    if(obj.old.tile === obj.new.tile) {
        return;
    }

    // if marge happened
    if($('.puzzle--game--tiles--item.'+obj.new.tile).length > 0) {
        $('.puzzle--game--tiles--item.'+obj.new.tile).remove();
    }

    // updating class & value
    $('.puzzle--game--tiles--item.'+obj.old.tile).removeClass(obj.old.tile).addClass(obj.new.tile).addClass('is-'+obj.new.val).html(obj.new.val);

    // change value
    self.gridZone[obj.old.tile].digit = obj.old.val;
    self.gridZone[obj.new.tile].digit = obj.new.val;

    self.moved = true;
};

Game.prototype.generateNewTile = function(){
    var self = this;
    var newTile = _.sample(self.keysHasNotValue());

    var value = 2;
    setTimeout(function(){
        $('.puzzle--game--tiles').append('<div class="puzzle--game--tiles--item '+newTile+' is-'+value+'">'+ value +'</div>');
    }, 250);
    self.gridZone[newTile].digit = value;
    self.moved = false;
    self.resetKeyValues();
};

Game.prototype.updateScore = function(value){
    var self = this;

    self.score += value;
    $('.score--total--text').html(self.score);
};


jQuery(document).ready(function() {
    var game = new Game();
    game.start();
});

'use strict';

jQuery(document).ready(function($) {
    $('html').addClass('js');
});
