# ngrams
nodejs module for [searching by Ngram](https://en.wikipedia.org/wiki/N-gram) similarity of characters. An emitation of the [python](https://pythonhosted.org/ngram/ngram.html) NGram module

[![npm package](https://nodei.co/npm/ngram-search.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ngram-search/)

## basic usage:

```javascript
var NGrams = require('ngram-search');
var n = new NGrams()    //default N=3 (size of ngram) w=1 (warp, use greater than 1 to increase the similarity of shorter string pairs)
n.add("spam");          //add single items
n.add(["span", "eg"]);  //or an array of items
console.log(n.search("spa"));   // second argument is optional - threshold - return only items with similarity greater than threshold. default is 0
/*
will output an array of items with similarity greater than threshold ordered by similarity
//[{
    item: "spam",
    similarity: 0.375
}, {
    item: "span",
    similarity: 0.375
}]
*/
```
## more usage examples
```javascript
var n = new NGrams(2);  //create ngrams of size 2
n.pad("word");           //returns " word " padding is of size N-1
n.split("ab");
/*
returns the ngrams of the item "ab" after padding
[
  [' ', 'a'],
  ['a', 'b'],
  ['b', ' ']
]
*/

n.getSharedNgrams("abe", "abc");
/*
returns all the ngrams that both items share:
[
  [' ', 'a'],
  ['a', 'b']
]
*/
n.getCountSharedNgrams("abe", "abc");    // returns 2
n.getStatsSharedNgrams("abe", "abc");
/*
returns
{ 
  all: 8,         //count of all ngrams in both items
  same: 2,        //ngrams sahred by both items
  distinct: 6,    //count of distinct ngrams in total
  diff: 4         //count of unique ngrams - which do not appear in both items
}
*/
n.compare("abe","abc");         //third argument is warp - optional, default is 1 
/*
returns 0.3333333333333333
formula is: ((distinct ^ warp)-(diff ^ warp))/(distinct^warp)
*/
```
for more use cases look at test.js
