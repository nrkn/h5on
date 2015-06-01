(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  'use strict';
  
  function H5on( document ){
    function createEl( tag, val, key ){
      var el = document.createElement( 'js-' + tag );
      if( key !== undefined ){
        el.setAttribute( 'data-key', key );
      }
      if( val !== undefined ){
        el.textContent = val;
      }
      return el;
    }
     
    function toEl( obj, key ){
      obj = JSON.parse( JSON.stringify( obj ) );
      
      var type = typeof obj;
      
      if( type === 'number' ) return createEl( 'number', obj, key );
      if( type === 'string' ) return createEl( 'string', obj, key );
      if( type === 'boolean' ) return createEl( 'boolean', obj, key );
      if( !obj ) return createEl( 'null', undefined, key );
      
      if( Array.isArray( obj ) ){
        var el = createEl( 'array', undefined, key );
        obj.forEach( function( child ){
          el.appendChild( toEl( child ) );
        });
        return el;
      }
      
      if( obj.tagName ){
        var el = document.createElement( obj.tagName );
        
        if( el.attributes ){
          for( key in el.attributes ){
            el.setAttribute( key, el.attributes[ key ] );
          }
        }
        
        if( Array.isArray( el.children ) ){
          el.children.forEach( function( child ){
            el.appendChild( toEl( child ) );
          });
        }
        
        return el;
      }
      
      var el = createEl( 'object', undefined, key );
      
      Object.keys( obj ).forEach( function( key ){
        el.appendChild( toEl( obj[ key ], key ) );
      });
      
      return el;
    }
     
    function toObj( el ){
      if( el.nodeType === 3 ) return el.textContent;
      
      var tag = el.tagName.toLowerCase();
      
      if( tag === 'js-number' ) return el.textContent * 1;
      if( tag === 'js-string' ) return el.textContent;
      if( tag === 'js-boolean' ) return el.textContent.trim().toLowerCase() === 'true';
      if( tag === 'js-null' ) return null;
      
      if( tag === 'js-array' ){
        var arr = [];
        for( var i = 0; i < el.childNodes.length; i++ ){
          arr.push( toObj( el.childNodes[ i ] ) );
        }
        return arr;
      }
      
      var obj = {};
      
      if( tag === 'js-object' ){
        var missingKeyIndex = 0;
        for( var i = 0; i < el.childNodes.length; i++ ){
          var child = el.childNodes[ i ];
          if( !child.hasAttribute( 'data-key' ) ){
            child.setAttribute( 'data-key', 'h5-missing-key-' + missingKeyIndex++ );
          }
          obj[ child.getAttribute( 'data-key' ) ] = toObj( child );
        }
        return obj;
      }
      
      obj.tagName = el.tagName;
      
      if( el.attributes.length ){
        obj.attributes = {};
        for( var i = 0; i < el.attributes.length; i++ ){
          var attr = el.attributes[ i ];
          obj.attributes[ attr.nodeName ] = attr.nodeValue;
        }
      }
      
      if( el.childNodes.length ){
        obj.children = [];
        for( var i = 0; i < el.childNodes.length; i++ ){
          obj.children.push( toObj( el.childNodes[ i ] ) );
        }
      }
      
      return obj;
    }
    
    return {
      toEl: toEl,
      toObj: toObj
    };
  }
  
  if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ){
    module.exports = H5on;
  } else {
    window.h5on = H5on( window.document );
  }
})();  
},{}],2:[function(require,module,exports){
(function( $, document ){
  'use strict';
  
  var h5on = require( '../h5on' )( document );
  
  $.h5on = function( obj, key ){ 
    return $( h5on.toEl( obj, key ) );
  };
   
  $.fn.h5on = function(){
    var $this = $( this );
    if( $this.length === 1 && $this.is( 'js-object, js-array, js-number, js-string, js-boolean, js-null' ) ) return h5on.toObj( $this[ 0 ] );
    
    var result = [];
    $.each( this, function( i, value ){
      result.push( h5on.toObj( value ) );
    });
    return result;
  }
   
  var comparers = {
    eq: function( a, b ){
      return a == b;
    },
    lte: function( a, b ){
      return a <= b;
    },
    lt: function( a, b ){
      return a < b;
    },
    gte: function( a, b ){
      return a >= b;
    },
    gt: function( a, b ){
      return a > b;
    }
  };
   
  function compare( el, value, operator ){
    var $el = $( el );
    
    if( $el.is( 'js-number, js-string, js-boolean, js-null' ) ){
      var elValue = h5on.toObj( el );
      
      value = JSON.parse( value );
      
      if( $.type( comparers[ operator ] ) === 'function' ){
        return comparers[ operator ]( elValue, value );
      }
    }
    
    return false;
  };
   
  $.extend( $.expr[ ':' ], {
    valEq: function( el, i, args ){
      return compare( el, args[ 3 ], 'eq' );
    },
    valLte: function( el, i, args ){
      return compare( el, args[ 3 ], 'lte' );
    },
    valLt: function( el, i, args ){
      return compare( el, args[ 3 ], 'lt' );
    },
    valGte: function( el, i, args ){
      return compare( el, args[ 3 ], 'gte' );
    },
    valGt: function( el, i, args ){
      return compare( el, args[ 3 ], 'gt' );
    }
  });
})( jQuery, window.document );
},{"../h5on":1}]},{},[2]);
