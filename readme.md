![H5ON](h5on.png?raw=true)

# H5ON (HTML5 Object Notation)

H5ON is an object notation, like [JSON](http://json.org), for representing objects as [HTML5](http://www.w3.org/TR/html5/) elements.

This [working prototype](h5on.js) is implemented as a [jQuery](https://jquery.com/) plugin and is less than 1KB minified and gzipped.

It came out of a thought experiment with two goals in mind:

1. Traverse a JavaScript object graph using jQuery
2. The notation itself is rendered by layout engines in a human readable format

As this is the fruit of a thought experiment, please be aware that there are many alternative ways to traverse object graphs, and that for the most part they are much saner than this one. You have been warned!

Despite that caveat, you can do some interesting and powerful things using this approach. jQuery is a sophisticated traversal library and contains a lot of useful ways to search and filter data.

#Table of Contents

1. [Usage](#usage)
  1. [Convert an object to H5ON](#convert-an-object-to-h5on)
  2. [Place H5ON in the DOM for viewing](#place-h5on-in-the-dom-for-viewing)
  3. [Traverse H5ON using selectors](#traverse-h5on-using-selectors)
  4. [Convert H5ON to an object](#convert-h5on-to-an-object)
  5. [Manipulation](#manipulation)
  6. [Mixing HTML and H5ON](#mixing-html-and-h5on)
2. [Demos and Examples](#demos-and-examples)
  1. [Demos](#demos)
  2. [Selector Examples](#selector-examples)
3. [Why would you want to traverse an object graph with jQuery?](#why-would-you-want-to-traverse-an-object-graph-with-jquery)
  1. [Example - find all objects in the graph which have a property named “Weight”:](#example---find-all-objects-in-the-graph-which-have-a-property-named-weight)
4. [What do you mean by human readable?](#what-do-you-mean-by-human-readable)
  1. [Example of browser rendering, using H5ON generated by the input from the previous example and h5on.css:](#example-of-browser-rendering-using-h5on-generated-by-the-input-from-the-previous-example-and-h5oncss)
5. [Syntax](#syntax)
  1. [Primitive Literals](#primitive-literals)
  2. [Number](#number)
  3. [String](#string)
  4. [Boolean](#boolean)
  5. [Array](#array)
  6. [Object](#object)
  7. [Null](#null)
6. [Status](#status)
7. [License](#license)

## Usage

###Convert an object to H5ON

```javascript
var person = {
  name: 'Akosua',
  age: 39
};
var $person = $.h5on( person );
```

###Place H5ON in the DOM for viewing

```javascript
$( 'body' ).append( $person );
```

It's recommended that you use CSS (such as the included h5on.css) to style H5ON elements, otherwise the browser won't know how to render them and it'll come out as a mess of plain text.

###Traverse H5ON using selectors

```javascript
var $age = $person.find( '[data-key="age"]' );
```

###Convert H5ON to an object

```javascript
var age = $age.h5on();
```

### Manipulation

You can manipulate the H5ON DOM in the same way you would the standard DOM, using jQuery.

You can create new H5ON elements however you like (provided the syntax is correct), but the easiest way to create them is to use the static helper:

```javascript
var $age = $.h5on( 39 );
```

The plugin expects you to respect the [H5ON syntax](#syntax) and performs no error checking. 

When creating a property for an object, pass the key as the second argument to the static helper:

```javascript
$someH5Object.append( $.h5on( 39, 'age' ) );
```

###Mixing HTML and H5ON

The H5ON DOM can contain arbitrary HTML at any point. HTML is converted to and from JavaScript objects using the following syntax:

```javascript
var heading = {
  "tagName": "h1",
  "attr": {
    "style": "color: red;"
  },
  "children": [
    "Hello World"
  ]
};
```

The ``children`` array can contain any mixture of text nodes (as strings), element nodes structured as per above, and H5ON elements - other node types such as comments are not currently supported (pull request welcome!).

## Demos and Examples

### Demos

1. [Interactive selector demo](http://h5on.org/demo.html)
2. [Visual H5ON editor demo](http://h5on.org/editor.html)

### Selector Examples

#### Find all of a specific type
```javascript
//strings
var $strings = $( 'js-string' );

//objects
var $objects = $( 'js-object' );

//etc.
```

#### Find all objects that have a certain key
```javascript
var $withWeights = $( 'js-object:has( > [data-key="Weight"] )' );
```

#### Find all objects with a certain key value pair
```javascript
var $containers = $( 'js-object:has( > [data-key="Type"]:valEq( "Container" ) )' );
```

#### Find all objects that contain a certain type
```javascript
var $withArrays = $( 'js-object:has( > js-array )' );
```

#### Custom selector expressions

The plugin has the following custom selector expressions:

```css
:valEq( value )
:valLte( value )
:valLt( value )
:valGte( value )
:valGt( value )
```

For example:

```javascript
var $lightObjects = $( 'js-object:has( > [data-key="Weight"]:valLt( 500 ) )' )
```

## Why would you want to traverse an object graph with jQuery?

JSON data is an object graph - the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) is an object graph. 
Many developers are already familiar with using [selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors) to traverse and manipulate the DOM. 
By representing an object graph as [HTML5 custom elements](http://www.w3.org/TR/custom-elements/), you can apply the same techniques you use on the DOM with any data.
The plugin takes a plain (JSON-serializable) JavaScript object as data, and returns H5ON, which is composed of ordinary DOM elements wrapped in a jQuery object which can be traversed and manipulated as usual, and can be placed in a document for viewing.
Calling the H5ON function again on these jQuery objects converts them back to a plain JavaScript object.

In addition, H5ON also maps non-H5ON elements to and from JavaScript objects so that you can mix H5ON and ordinary DOM elements.

### Example - find all objects in the graph which have a property named "Weight":

#### Input
```javascript
{
  "Name": "Akosua",
  "Occupation": "Zombie Hunter",
  "Is Infected": false,
  "Equipment": [
    {
      "Name": "Backpack",
      "Type": "Container",
      "Capacity": 40000,
      "Weight": 2000,
      "Contents": [
        {
          "Name": "Water Bottle",
          "Type": "Container",
          "Capacity": 1000,
          "Weight": 0.2,
          "Contents": [
            {
              "Name": "Water",
              "Weight": 365.9
            }
          ]
        },
        {
          "Name": "Necronomicon",
          "Type": "Book",
          "Weight": 0.87
        }
      ]
    },    
    {
      "Name": "Katana",
      "Type": "Weapon",
      "Class": "Edged",
      "Damage": {
        "Base": "4d6",
        "Modifier": -2
      },
      "Weight": 1200
    }
  ]
}
```

#### JavaScript
```javascript
//convert a JavaScript object to H5ON
var $h5Data = $.h5on( input );
//find all objects in the object graph with a key matching "Weight"
var $h5WithWeights = $h5Data.find( 'js-object:has( > [data-key]="Weight" )' );
//convert the H5ON back to a JavaScript object
var output = $h5WithWeights.h5on();
```

Or, in one line:

```javascript
var output = $.h5on( input ).find( 'js-object:has( > [data-key]="Weight" )' ).h5on();
```

#### Output
```javascript
[
  {
    "Name": "Backpack",
    "Type": "Container",
    "Capacity": 40000,
    "Weight": 2000,
    "Contents": [
      {
        "Name": "Water Bottle",
        "Type": "Container",
        "Capacity": 1000,
        "Weight": 0.2,
        "Contents": [
          {
            "Name": "Water",
            "Weight": 365.9
          }
        ]
      },
      {
        "Name": "Necronomicon",
        "Type": "Book",
        "Weight": 0.87
      }
    ]
  },
  {
    "Name": "Water Bottle",
    "Type": "Container",
    "Capacity": 1000,
    "Weight": 0.2,
    "Contents": [
      {
        "Name": "Water",
        "Weight": 365.9
      }
    ]
  },
  {
    "Name": "Water",
    "Weight": 365.9
  },
  {
    "Name": "Necronomicon",
    "Type": "Book",
    "Weight": 0.87
  },
  {
    "Name": "Katana",
    "Type": "Weapon",
    "Class": "Edged",
    "Damage": {
      "Base": "4d6",
      "Modifier": -2
    },
    "Weight": 1200
  }
]
```

## What do you mean by human readable?

When we say "human readable", we primarily mean as rendered by a browser's layout engine.
 
### Example of browser rendering, using H5ON generated by the input from the previous example and [h5on.css](h5on.css), themed with [Solarized Light]( http://ethanschoonover.com/solarized ):

#### Browser rendering
![H5ON](view.png?raw=true)

#### Generated H5ON
```html
<js-object>
  <js-string data-key="Name">Akosua</js-string>
  <js-string data-key="Occupation">Zombie Hunter</js-string>
  <js-boolean data-key="Is Infected">false</js-boolean>
  <js-array data-key="Equipment">
    <js-object>
      <js-string data-key="Name">Backpack</js-string>
      <js-string data-key="Type">Container</js-string>
      <js-number data-key="Capacity">40000</js-number>
      <js-number data-key="Weight">2000</js-number>
      <js-array data-key="Contents">
        <js-object>
          <js-string data-key="Name">Water Bottle</js-string>
          <js-string data-key="Type">Container</js-string>
          <js-number data-key="Capacity">1000</js-number>
          <js-number data-key="Weight">0.2</js-number>
          <js-array data-key="Contents">
            <js-object>
              <js-string data-key="Name">Water</js-string>
              <js-number data-key="Weight">365.9</js-number>
            </js-object>
          </js-array>
        </js-object>
        <js-object>
          <js-string data-key="Name">Necronomicon</js-string>
          <js-string data-key="Type">Book</js-string>
          <js-number data-key="Weight">0.87</js-number>
        </js-object>
      </js-array>
    </js-object>
    <js-object>
      <js-string data-key="Name">Katana</js-string>
      <js-string data-key="Type">Weapon</js-string>
      <js-string data-key="Class">Edged</js-string>
      <js-object data-key="Damage">
        <js-string data-key="Base">4d6</js-string>
        <js-number data-key="Modifier">-2</js-number>
      </js-object>
      <js-number data-key="Weight">1200</js-number>
    </js-object>
  </js-array>
</js-object>
```

## Syntax

Like JSON, possible values are:

* number
* string
* boolean
* array
* object
* null

### Primitive Literals

The primitive values are number, string and boolean. The notation for these is:

```html
<js-{{type}}>{{value}}</js-{{type}}>
```

When converting back to an object, the plugin expects this element to contain a single text node only, and the text content of that node is converted to the expected type. No error checking is performed!

### Number

#### H5ON
```html
<js-number>42</js-number>
```

#### JSON
```javascript
42
```

### String

#### H5ON
```html
<js-string>Hello World</js-string>
```

#### JSON
```javascript
"Hello World"
```

### Boolean

#### H5ON
```html
<js-boolean>false</js-boolean>
```

#### JSON
```javascript
false
```

### Array

#### H5ON
```html
<js-array>
  <js-number>42</js-number>
  <js-string>Hello World</js-string>
  <js-boolean>false</js-boolean>
</h5-array>
```

#### JSON
```javascript
[ 42, "Hello World", false ]
```

When converting back to an object each direct child of the js-array element is considered to be an array element. An array can contain any other value.

### Object

#### H5ON
```html
<js-object>
  <js-string data-key="name">Akosua</js-string>    
  <js-number data-key="age">39</js-number>
  <js-string data-key="hobby">Hunting zombies</js-string>
</js-object>
```

#### JSON
```javascript
{
  "name": "Akosua",
  "age": 39,
  "hobby": "Hunting zombies"
}
```

When converting an H5ON object back to a JavaScript object, every direct child of the js-object element is considered to be a property on the JS object. Each direct child should have an attribute `data-key` and this will be used as the key on the resulting object. If the attribute is missing an autogenerated key will be used.

### Null

#### H5ON
```html
<js-null />
```

#### JSON
```javascript
null
```

## Status

Working prototype - usable, shows what it can do, demonstrates the concept, imperfect. Pull requests welcomed, if it's a simple and obvious bug fix go ahead, but for anything more major please open an issue to discuss first.

## License

The MIT License (MIT)

Copyright (c) 2015 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
