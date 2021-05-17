# Installation
<pre>npm i my-fit-decodable-decorators</pre>

# Description
This package add typescript decorators to use the runtime controller : https://www.npmjs.com/package/decoders. The decoretors consider, that you don't want add more declaration of your class.

# Usage
## @decodable([options])
It's a class decorator. You have to use the @decodable() on the class that you want a control. This decorator can take an option parameter :
<pre>
method?: "object" | "exact" | "inexact"; That refer to the documentation of https://www.npmjs.com/package/decoders. Default : "exact"
</pre>

## @decodableAttribute([options])

## @decodableArrayAttribute(string: type)

## @decodableClassAttribute(new myClass)

## @validate()

## @params(new myClass)