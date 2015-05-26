![H5ON](h5on.png?raw=true)

# H5ON (HTML5 Object Notation)

H5ON is an object notation, like JSON, for representing objects in HTML5.

This working prototype is implemented as a jQuery plugin and is less than 1KB minified and gzipped.

It was created as a thought experiment with two goals in mind:

1. Traverse a JavaScript object graph using jQuery (specifically, a JSON-serializable object)
2. The notation itself is rendered by layout engines in a human readable format

As this is a thought experiment, please be aware that there are many alternative ways to traverse object graphs, and that for the most part they are much saner than this one. You have been warned!

Despite that caveat, you can do some interesting and powerful things using this approach.

## Why would you want to traverse an object graph with jQuery?

JSON data is an object graph - the DOM is an object graph. 
Many developers are already familiar with using selectors to traverse and manipulate the DOM. 
By representing an object graph as HTML5 custom elements, you can apply the same techniques you use on the DOM with any data.
The plugin takes a plain (JSON-serializable) JavaScript object as data, and returns H5ON, which is made up of ordinary jQuery objects which can be traversed and manipulated as usual, and can be placed in a document for viewing.
Calling the H5ON function again on these jQuery objects converts them back to a plain JavaScript object.

In addition, H5ON also maps non-H5ON elements to and from JavaScript objects so that you can mix H5ON and ordinary DOM elements.

### Example - find all objects in the graph which have a property named "weight":

```javascript
var myData = getDataFromSomewhere();
var $h5Data = $( myData ).h5on();
var $h5WithWeights = $h5Data.find( 'js-object[data-keys~="weight"]' );
var withWeight = $h5WithWeights.h5on();
```

## What do you mean by human readable?

When we say "human readable", we mean as rendered by a browser's layout engine.
The notation for H5ON is more verbose than would be necessary if it were just a data transport mechanism.
This is because is richly decorated with attributes and wrapper elements. 
The purpose of this is twofold:

1. Simpler selectors when traversing
2. Displayed meaningfully when rendered

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
<h5-{{type}} data-value="{{value}}">{{value}}</h5-{{type}}>
```

This duplication of the value (in both an attribute and as a text node) is a good example of favouring verbosity over compactness to make the data easy to traverse and display.

Note that the attributes are used only for ease of selection. When converting back to an object, the plugin expects this element to contain a single text node only, and the text content of that node is converted to the expected type. No error checking is performed!

### Number

```html
<h5-number data-value="42">42</h5-number>
```

### String

```html
<h5-string data-value="Hello World">Hello World</h5-number>
```

### Boolean

```html
<h5-boolean data-value="false">false</h5-boolean>
```

### Array

```html
<h5-array data-length="3">
  <h5-item data-index="0">
    <h5-number data-value="42">42</h5-number>
  </h5-item>
  <h5-item data-index="1">
    <h5-string data-value="Hello World">Hello World</h5-string>
  </h5-item>
  <h5-item data-index="2">
    <h1>This is an ordinary DOM element</h1>
  </h5-item>
</h5-array>
```

Each array item is wrapped in an <h5-item> element, much like an ordinary list (`<ul><li>` etc.) Again, this is for ease of selection and display.

The attributes are used for selection only - when converting back to an object, the plugin expects an `<h5-array>` to contain only `<h5-item>` elements. The `<h5-item>` element can contain any other element. No error checking is performed!

### Object

```html
<h5-object data-keys="name age hobby">
  <h5-property data-key="name">
    <h5-key>name</h5-key>
    <h5-value data-key="name">
      <h5-string data-value="Akosua">Akosua</h5-string>    
    </h5-value>
  </h5-property>
  <h5-property data-key="age">
    <h5-key>age</h5-key>
    <h5-value data-key="age">
      <h5-number data-value="39">39</h5-number>
    </h5-value>
  </h5-property>
  <h5-property data-key="hobby">
    <h5-key>hobby</h5-key>
    <h5-value data-key="hobby">
      <h5-string data-value="Hunting zombies">Hunting zombies</h5-string>
    </h5-value>
  </h5-property>
</h5-object>
```

An object consists of any number of properties, each of which is a key-value pair.

The attributes are used for selection only - when converting back to an object, the plugin expects an `<h5-object>` to contain only `<h5-property>` elements. Each `<h5-property>` element is expected to contain a single `<h5-key>` element and a single `<h5-value>` element. The plugin expected the `<h5-key>` element to contain a single text node and the text content of that node is used as the property's key. The `<h5-value>` element can contain anything. No error checking is performed!

Please note - the object has an attribute, `[data-keys]` which contains a whitespace separated list of keys. Because the list is whitespaced, any keys with a space in them will have their spaces converted to underscores. This allows the use of the [Attribute contains word selector](http://api.jquery.com/attribute-contains-word-selector/) to select all objects that have the requested property:

```javascript
var $objectsWithAWidth = $h5Object.find( 'js-object[data-keys~="width"]' );
```

### Null

```html
<h5-null />
```

## Status

Working prototype - usable, shows what it can do, demonstrates the concept, imperfect. Pull requests welcomed.

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
