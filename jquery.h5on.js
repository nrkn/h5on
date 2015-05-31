(function( $ ){
  'use strict';
  
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
})( jQuery );