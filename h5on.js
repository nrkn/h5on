(function( $ ){
  'use strict';
  
  $.extend({
    keys: function( obj ){
      var arr = [];
      
      $.each( obj, function( key ){ 
        arr.push( key ); 
      });
      
      return arr;
    }
  });

  $.fn.h5on = function( command ){
    if( command === 'reflow' ){
      var $farthest = $( this ).parents( 'h5-object, h5-array' ).last();      
      
      if( $farthest.length === 0 ) $farthest = $( this );
      
      var $new = $.h5on( $farthest.h5on() );
      
      $farthest.replaceWith( $new );
      
      return $new;
    }
    
    var arr = [];
    
    $.each( this, function( i, value ){
      arr.push( h5on( value ) );
    });
    
    if( arr.length === 1 ){
      return arr[ 0 ];
    }
    
    return arr;
  }

  $.h5on = h5on;
  
  function h5on( value, type ){
    if( value && value.jquery ){
      return toObj( value );
    }
    
    if( value instanceof HTMLElement ){
      return toObj( $( value ) );
    }
    
    //ensure json serializable
    value = JSON.parse( JSON.stringify( value ) );

    if( type === 'item' ){
      return arrayItem( value );
    }
    
    if( type === 'property' ){
      return property( value.key, value.value );
    }
    
    var $el = toEl( value );
    
    return $el;
  }
  
  function arrayItem( value ){
    var $item = elFromKey( 'item' );

    var $value = toEl( value );
    var type = $.type( value );
    
    $item.attr( 'data-type', type );
    
    if( isPrimitive( $value ) ){
      if( value === null ) value = 'null';
      $item.attr( 'data-value', value );
    }

    $item.append( $value );    
    
    return $item;
  }
  
  function property( key, value ){
    var $property = elFromKey( 'property' );
    var $h5key = elFromKey( 'key' );
    var $h5value = elFromKey( 'value' );
    var $value = toEl( value );
    var type = $.type( value );
    
    $property.attr( 'data-key', key );
    $h5value.attr( 'data-key', key );
    $property.attr( 'data-type', type );
    $h5value.attr( 'data-type', type );
    
    if( isPrimitive( $value ) ){
      if( value === null ) value = 'null';
      $property.attr( 'data-value', value );
      $h5value.attr( 'data-value', value );
    }
    
    $h5key.html( key );
    $h5value.html( $value );

    $property.append( $h5key );
    $property.append( $h5value );

    return $property;
  }
  
  function toEl( obj ){
    var $el;
    
    if( $.type( obj ) === 'null' ){
      $el = $( '<h5-null />' );
    }
    
    if( $.type( obj ) === 'number' ){
      $el = literalEl( 'number', obj );
    }
    
    if( $.type( obj ) === 'string' ){
      $el = literalEl( 'string', obj );
    }
    
    if( $.type( obj ) === 'boolean' ){
      $el = literalEl( 'boolean', obj );
    }
    
    if( $.type( obj ) === 'array' ){
      var $array = elFromKey( 'array' );
      $array.attr( 'data-length', obj.length );

      for( var i = 0; i < obj.length; i++ ){
        var value = obj[ i ];

        var $item = arrayItem( value );
        
        $item.attr( 'data-index', i );

        $array.append( $item );
      }
      
      $el = $array;
    }
        
    if( $.type( $el ) === 'undefined' && obj.tagName ){
      var $obj = $( '<' + obj.tagName + '></' + obj.tagName + '>' );
        
      if( obj.attr ){
        $obj.attr( obj.attr );  
      }
      
      if( $.type( obj.children ) === 'array'  ){
        $.each( obj.children, function( i, child ){
          if( $.type( child ) === 'string' ){
            $obj.append( child );
          } else {
            var $child = toEl( child );
            $obj.append( $child );
          }
        });
      }
      
      return $obj;
    }
    
    if( $.type( $el ) === 'undefined' ){          
      var $obj = elFromKey( 'object' );
      
      var keys = $.keys( obj );
      if( keys.length > 0 ){
        var keyAttr = $.map( keys, function( key ){              
          return key.replace( /\u0020/g, '_' );
        }).join( ' ' );
        
        $obj.attr( 'data-keys', keyAttr );
      }
      
      $.each( obj, function( key, value ){
        var $property = property( key, value );     
        $obj.append( $property );
      });
      
      $el = $obj;
    }
    
    return $el;
  }
  
  function toObj( $el ){
    if( $el.is( 'h5-number' ) ) return $el.text() * 1;
    
    if( $el.is( 'h5-string' ) ) return $el.text() + '';
    
    if( $el.is( 'h5-boolean' ) ) return $el.text().toLowerCase().trim() === 'true';
    
    if( $el.is( 'h5-array' ) ){
      var arr = [];
      
      $el.find( '> h5-item' ).each( function(){
        var $value = $( this ).find( '> *' );
        var child = toObj( $value );
        arr.push( child );
      });
      
      return arr;
    }
    
    if( $el.is( 'h5-object' ) ){
      var obj = {};
      
      $el.find( '> *' ).each( function( i, child ){
        var $property = $( child );
        var key = $property.find( '> h5-key' ).text();
        var $value = $property.find( '> h5-value > *' );
        
        obj[ key ] = toObj( $value );
      });
      
      return obj;
    }

    if( $el.is( 'h5-property' ) ){
      var key = toObj( $el.find( '> h5-key' ) );
      var value = toObj( $el.find( '> h5-value' ) );
      
      return { 
        key: key, 
        value: value
      };
    }

    if( $el.is( 'h5-value' ) ){
      var $value = $el.find( '> *' );
      
      return toObj( $value );
    }
    
    if( $el.is( 'h5-key' ) ){
      return $el.text();
    }    
    
    if( $el.is( 'h5-item' ) ){
      var $value = $el.find( '> *' );
      
      return toObj( $value );
    }
    
    if( $el.is( 'h5-null' ) ) return null;    
    
    if( $el.jquery ){
      if( $el.length === 0 ) return;
      
      if( $el.length > 1 ){
        var arr = [];
        
        $el.each( function(){
          var $child = $( this );
          arr.push( toObj( $child ) );
        });
        
        return arr;
      }
      
      var el = $el[ 0 ];
      var attr = {};
      
      $.each( el.attributes, function( i, attribute ){
        attr[ attribute.name ] = attribute.value;
      });
      
      var element = {
        tagName: el.tagName,
        attr: attr
      };
      
      var children = $el.contents();
      
      if( children.length > 0 ){        
        element.children = [];
        
        $.each( children, function( i, child ){
          if( child.nodeType === 3 ){
            element.children.push( child.textContent );
          } else {
            var $child = $( child );
            element.children.push( toObj( $child ) );
          }
        });
      }
      
      return element;
    }        
    
    //undefined
    return;
  };
  
  function isPrimitive( $el ){
    return $el.is( 'h5-null, h5-string, h5-number, h5-boolean' );
  }  
  
  function elFromKey( key ){
    return $( '<h5-' + key + '></h5-' + key + '>' );
  }
  
  function literalEl( key, value ){
    return elFromKey( key ).attr( 'data-value', value ).html( value + '' );
  }  
})( jQuery );      