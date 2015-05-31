function pretty( $el ){        
  var inline = {
    'js-string': true,
    'js-number': true,
    'js-boolean': true,
    'js-null': true
  };
  
  function print( $el, depth ){
    var result = '';
    $el.each( function(){
      var $current = $( this );  
      var el = $current[ 0 ];
      
      if( depth > 0 ){
        result += Array( depth * 2 + 1 ).join( ' ' );
      }
      
      if( el.nodeType === 3 ){
        result += el.textContent;
        if( depth > 0 ){
          result += '\n';
        }
        return;
      }
      
      var tag = el.tagName.toLowerCase();
      
      result += '<' + tag;
      if( el.attributes.length ){
        $.each( el.attributes, function( i, attribute ){
          result += ( ' ' + attribute.name + '="' + attribute.value + '"' );
        });
      }
      result += '>';
      if( !inline[ tag ] ){
        result += '\n';
      }
      $.each( $current.contents(), function( i, content ){
        result += print( $( content ), inline[ tag ] ? -1 : depth + 1 );
      });
      if( !inline[ tag ] ){
        result += Array( depth * 2 + 1 ).join( ' ' );
      }
      result += '</' + tag + '>\n'
    });
    return result;
  }
  
  return print( $el, 0 );
}  