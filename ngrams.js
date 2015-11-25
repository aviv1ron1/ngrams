function isDefined(x) {
    return typeof x !== 'undefined' && x !== null;
}

function NGram(n, w) {
    if (isDefined(n)) {
        if (isNaN(n) || n < 1) {
            throw new Error("n must be a number greater than 0");
        }
    } else {
        //default
        n = 3;
    }
    this.n = n;
    this.len = n - 1;
    this.items = [];
    this.w = w;
}

NGram.prototype.duplicate = function(arr) {
    b = new Array(this.n);
    var i = this.n;
    while (i--) {
        b[i] = arr[i];
    }
    return b;
};

NGram.prototype.duplicateAndShiftLeft = function(arr) {
    b = new Array(this.n);
    var i = this.len;
    while (i--) {
        b[i] = arr[i + 1];
    }
    return b;
};

NGram.prototype.pad = function(word) {
    for (var i = 0; i < this.len; i++) {
        word = ' ' + word + ' ';
    };
    return word;
};

NGram.prototype.split = function(word) {
    var res = {
        item: word,
        split: []
    }

    word = this.pad(word);
    var arr = [];

    for (var i = 0; i < this.n; i++) {
        arr.push(word[i]);
    }

    res.split.push(arr);

    for (var i = this.n; i < word.length; i++) {
        arr = this.duplicateAndShiftLeft(arr);
        arr[this.len] = word[i];
        res.split.push(arr);
    };

    return res;
};

NGram.prototype.add = function(item) {
    if (Array.isArray(item)) {
        var self = this;
        item.forEach(function(w) {
            self.items.push(self.split(w));
        });
    } else {
        this.items.push(this.split(item));
    }
};

NGram.prototype.getItems = function() {
    var arr = [];
    this.items.forEach(function(i) {
        arr.push(i.item);
    });
    return arr;
};

NGram.prototype.clear = function() {
    this.items = [];
};

NGram.prototype.arrEqual = function(a, b) {
    for (var i = 0; i < this.n; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

NGram.prototype.getSharedNgramsFromArr = function(a, b) {
    var self = this;
    var res = [];
    a.forEach(function(ai) {
        for (var i = 0; i < b.length; i++) {
            if (self.arrEqual(ai, b[i])) {
                res.push(self.duplicate(ai));
                break;
            }
        }
    });
    return res;
};

NGram.prototype.getCountSharedNgramsFromArr = function(a, b) {
    var self = this;
    var res = 0;
    a.forEach(function(ai) {
        for (var i = 0; i < b.length; i++) {
            if (self.arrEqual(ai, b[i])) {
                res++;
                break;
            }
        }
    });
    return res;
};

NGram.prototype.getStatsSharedNgramsFromArr = function(a, b) {
    var self = this;
    var same = 0;
    a.forEach(function(ai) {
        for (var i = 0; i < b.length; i++) {
            if (self.arrEqual(ai, b[i])) {
                same++;
                break;
            }
        }
    });
    var all = a.length + b.length;
    var distinct = all - same;
    return {
        all: all,
        same: same,
        distinct: distinct,
        diff: distinct - same
    }
};

NGram.prototype.getSharedNgrams = function(a, b) {
    return this.getSharedNgramsFromArr(this.split(a).split, this.split(b).split)
};

NGram.prototype.getCountSharedNgrams = function(a, b) {
    return this.getCountSharedNgramsFromArr(this.split(a).split, this.split(b).split)
};

NGram.prototype.getStatsSharedNgrams = function(a, b) {
    return this.getStatsSharedNgramsFromArr(this.split(a).split, this.split(b).split)
};

NGram.prototype.getNgramSimilarity = function(stats, w) {
    if (isDefined(w)) {
        if (isNaN(w)) {
            throw new Error("w must be a number");
        }
    } else {
        w = 1;
    }
    var ae = Math.pow(stats.distinct, w);
    var de = Math.pow(stats.diff, w)
    return (ae - de) / ae;
};

NGram.prototype.compare = function(a, b, w) {
    return this.getNgramSimilarity(this.getStatsSharedNgrams(a, b), w);
};

function arraySort(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        var j = i,
            item = arr[j];
        for (; j > 0 && arr[j - 1].similarity < item.similarity; j--) {
            arr[j] = arr[j - 1];
        }
        arr[j] = item;
    }
    return arr;
};

NGram.prototype.search = function(query, threshold) {
    if (isDefined(threshold)) {
        if (isNaN(threshold)) {
            throw new Error("threshold must be a number between 0 to 1");
        }
    } else {
        threshold = 0;
    }
    var res = [];
    var querySplit = this.split(query);
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var stats = this.getStatsSharedNgramsFromArr(item.split, querySplit.split);
        var score = this.getNgramSimilarity(stats, this.w);
        if (score > threshold) {
            res.push({
                item: item.item,
                similarity: score
            });
        }
    }
    return arraySort(res);
};

module.exports = NGram;
