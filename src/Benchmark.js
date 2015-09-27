/**
* The MIT License (MIT)
* 
* Copyright (c) 2015 ZeroX Lim
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
 
function Benchmark( scopeReplace ) {

    if ( !( this instanceof Benchmark) ) {
        var obj = function (  ) { };
        obj.prototype = Benchmark.prototype;
        return Benchmark.apply( new obj() , arguments );
    }

    this.ignore = false;
    this.isEnable = true;
    var i;

    var argLength = arguments.length;

    for ( var j = 0; j < argLength; ++j) {
        scopeReplace = arguments[j];
        for( i in scopeReplace ) {
            if ( scopeReplace.hasOwnProperty( i ) ) {
                this.attachObserver( scopeReplace, i );
            }
        }

        var proto = Object.getPrototypeOf( scopeReplace );
        for ( i in proto ) {
            this.attachObserver( scopeReplace, i );
        }
    }

}

Benchmark.prototype.attachObserver = function( scopeReplace, methodName ) {
    var self = this;
    var attr = scopeReplace[ methodName ];
    if ( typeof( attr ) === 'function' ) {
        scopeReplace[ methodName ] = function () {
            if ( self.ignore !== true && self.isEnable === true ) {
                self._start( methodName );
            } else {
                //console.log( methodName + ' is ignored !!!' );
            }
            var result = attr.apply( this, arguments );
            if ( self.ignore !== true && self.isEnable === true )
                self._end();

            return result;
        };
    }
};

Benchmark.prototype.setEnable = function( isEnable ) {
    this.isEnable = isEnable;
};

Benchmark.prototype.mute = function() {
    this.ignore = true;
};

Benchmark.prototype.unmute = function() {
    this.ignore = false;
};

Benchmark.prototype._start = function( methodName ) {

    var parent = this.current;
    this.current = {
        methodName: methodName,
        startTime: performance.now().toFixed( 4 ),
        subChild: [],
        parent: parent
    };

    if ( parent )
        parent.subChild.push( this.current );
};

Benchmark.prototype._end = function( methodName ) {

    this.current.endTime = performance.now().toFixed( 4 );

    if ( this.current.parent == undefined ) {
        this._printStackTime( );
        this.current = undefined;
    } else {
        this.current = this.current.parent;
    }
};

Benchmark.prototype._printStackTime = function ( ) {

    var current = this.current;

    var tab = '\t';
    var indexStack = [ 0 ];
    function getLastIndex() { return indexStack[ indexStack.length - 1 ]; }
    function increaseStack() {
        tab += '\t';
        indexStack[ indexStack.length - 1 ] = getLastIndex() + 1;
        indexStack.push( 0 );
    }
    function decreaseStack() {
        tab = tab.substring( 0, tab.length - 1 );
        indexStack.pop();
    }

    var totalTime = current.endTime - current.startTime;
    var currentTime = ( current.endTime - current.startTime ).toFixed( 4 );
    console.log( '-> [' + current.methodName + '] ' + currentTime + 'ms(' + (( currentTime / totalTime ) * 100).toFixed( 4 ) + '%)' );

    while( indexStack.length > 0 ) {
        var lastIndex = getLastIndex();
        if ( current.subChild.length > lastIndex ) {
            current = current.subChild[ lastIndex ];
            currentTime = ( current.endTime - current.startTime ).toFixed( 4 );
            console.log( tab + ' [' + current.methodName + '] ' + currentTime + 'ms(' + (( currentTime / totalTime ) * 100).toFixed( 4 ) + '%)' );
            increaseStack();
        } else {
            current = current.parent;
            decreaseStack();
        }
    }
};

// For node js usage
//if ( module != undefined )
//    module.exports = Benchmark;