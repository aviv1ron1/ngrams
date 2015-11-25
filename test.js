var should = require('should');

var NGrams = require('./ngrams.js');

////test ctor

var n = new NGrams()
should.exist(n);
should(function() {
    return new NGrams(0)
}).throw(new Error("n must be greater than 0"));

should(function() {
    return new NGrams(-1)
}).throw(new Error("n must be greater than 0"));

should(function() {
    return new NGrams("1a")
}).throw(new Error("n must be greater than 0"));

//// test add

n.add("abc");
n.add("bcd");
n.getItems().should.eql(["abc", "bcd"]);

n.add(["xxx", "yyy"]);
n.getItems().should.eql(["abc", "bcd", "xxx", "yyy"]);

//// test clear

n.clear();
n.getItems().should.eql([]);

////test pad

n.pad("a").should.equal("  a  ");

////test duplicate

var orig = ['a', 'b', 'c'];

var dup = n.duplicate(orig);
dup.should.eql(['a', 'b', 'c']);
should(dup == orig).equal(false);

////test duplicate and shift left

var dasl = new Array(3);
dasl[0] = 'b';
dasl[1] = 'c';

n.duplicateAndShiftLeft(['a', 'b', 'c']).should.eql(dasl);

////test split

n.split("abcd").should.eql({
    item: "abcd",
    split: [
        [' ', ' ', 'a'],
        [' ', 'a', 'b'],
        ['a', 'b', 'c'],
        ['b', 'c', 'd'],
        ['c', 'd', ' '],
        ['d', ' ', ' ']
    ]
});

////test arrEqual

n.arrEqual(['a', 'b', ' '], ['a', 'b', ' ']).should.equal(true);
n.arrEqual(['a', 'b', ' '], ['a', 'b', 'c']).should.equal(false);

////test get shared ngrams

var shared = n.getSharedNgrams("abe", "abcd");

should(shared.length).equal(2);
shared.should.eql([
    [' ', ' ', 'a'],
    [' ', 'a', 'b']
]);

should(n.getCountSharedNgrams("abe", "abcd")).equal(2);

should(n.getStatsSharedNgrams("abe", "abcd")).eql({
    all: 11,
    same: 2,
    distinct: 9,
    diff: 7
});

//// test getNgramSimilarity

n.getNgramSimilarity({
    all: 15,
    same: 5,
    distinct: 10,
    diff: 5
}).should.equal(0.5);

n.getNgramSimilarity({
    all: 15,
    same: 5,
    distinct: 10,
    diff: 5
}, 2).should.equal(0.75);

n.getNgramSimilarity({
    all: 15,
    same: 5,
    distinct: 10,
    diff: 5
}, 3).should.equal(0.875);


n.getNgramSimilarity({
    all: 6,
    same: 2,
    distinct: 4,
    diff: 2
}, 2).should.equal(0.75);


n.getNgramSimilarity({
    all: 7,
    same: 3,
    distinct: 4,
    diff: 1
}).should.equal(0.75);

//// test ngram compare

n.compare('spa', 'spam').should.equal(0.375);
n.compare('ham', 'bam').should.equal(0.25);
n.compare('hamster', 'amsterdam').should.equal(0.25);

var n2 = new NGrams(2);
n2.compare('spam', 'pam').should.equal(0.5);

var n1 = new NGrams(1);
n1.compare('ham', 'ams').should.equal(0.5);

var n6 = new NGrams(6);
n6.compare('hamster', 'amsterdam').should.equal(0.04);

//// test search
///A
//1
n.clear();
n.add(["spam", "span", "eg"]);
n.search("spa").should.eql([{
    item: "spam",
    similarity: 0.375
}, {
    item: "span",
    similarity: 0.375
}]);
//2
n.search("m").should.eql([{
    item: "spam",
    similarity: 0.125
}]);

//3
n.search("eg").should.eql([{
    item: "eg",
    similarity: 1
}]);

///B
n.clear();
n.add(["aspama", "bspamz", "spano"]);
n.search("spa").should.eql([{
    item: "spano",
    similarity: 1 / 3
}, {
    item: "aspama",
    similarity: 1 / 5.5
}, {
    item: "bspamz",
    similarity: 1 / 12
}]);

n.search("spa", 1 / 4).should.eql([{
    item: "spano",
    similarity: 1 / 3
}]);

//// test getMaxNgram

n.getMaxNgram("spa").should.eql({
    item: "spano",
    similarity: 1 / 3
});

console.log("tests done");
