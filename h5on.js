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