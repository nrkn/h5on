![H5ON](h5on.png?raw=true)

HTML5 Object Notation

H5ON is an object notation, like JSON, for representing objects in HTML5.

This working prototype is implemented as a jQuery plugin and is less than 1KB minified and gzipped.

It was created as a thought experiment with two goals in mind:

1. Traverse an object graph using jQuery or document.querySelector
2. The notation itself should be human readable when rendered by a layout engine 

As this is a thought experiment, please realise that there are many alternative ways to traverse an object graph, many much saner than this one.

Despite that, you can do some interesting and powerful things with this approach.

Why would you want to traverse an object graph with jQuery/document.querySelector?

JSON data is an object graph - the DOM is an object graph. 
Many developers are already familiar with using selectors to traverse and manipulate the DOM. 
By representing an object graph as HTML5 custom elements, you can apply the same techniques you use on the DOM with any data.
The plugin takes a plain (JSON-serializable) JavaScript object as data, and returns H5ON, which is made up of ordinary jQuery objects which can be traversed and manipulated as usual, and can be placed in a document for viewing.
Calling the H5ON function again on these jQuery objects converts them back to a plain JavaScript object.

In addition, H5ON also maps non-H5ON elements to and from JavaScript objects so that you can mix H5ON and ordinary DOM elements.

Example - find all objects in the graph which have a property named "weight":

var myData = getDataFromSomewhere();
var $h5Data = $( myData ).h5on();
var $h5WithWeights = $h5Data.find( 'js-object[data-keys~="weight"]' );
var withWeight = $h5WithWeights.h5on();

What do you mean by human readable?

When we say "human readable", we mean as rendered by a browser's layout engine.
The notation for H5ON is more verbose than would be necessary if it were just a data transport mechanism.
This is because is richly decorated with attributes and wrapper elements. 
The purpose of this is twofold:

1. Simpler selectors when traversing
2. Displayed meaningfully when rendered

Syntax

Like JSON, possible values are:

* number
* string
* boolean
* array
* object
* null

Primitive Literals

The primitive values are number, string and boolean. The notation for these is:

<h5-{{type}} data-value="{{value}}">{{value}}</h5-{{type}}>

This duplication of the value (in both an attribute and as a text node) is a good example of favouring verbosity over compactness to make the data easy to traverse and display.

Number

<h5-number data-value="42">42</h5-number>

String

<h5-string data-value="Hello World">Hello World</h5-number>

Boolean

<h5-boolean data-value="false">false</h5-boolean>

Array

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

Each array item is wrapped in an <h5-item> element, much like an ordinary list <ul><li> etc. Again, this is for ease of selection and display.

Object

<h5-object data-keys="name age hobby">
  <h5-property>
    <h5-key>name</h5-key>
    <h5-value>Akosua</h5-value>
  </h5-property>
  <h5-property>
    <h5-key>age</h5-key>
    <h5-value>39</h5-value>
  </h5-property>
  <h5-property>
    <h5-key>hobby</h5-key>
    <h5-value>Hunting zombies</h5-value>
  </h5-property>
</h5-object>

An object consists of any number of properties, each of which is a key-value pair.

Null

<h5-null />
