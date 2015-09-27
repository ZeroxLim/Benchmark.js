# Benchmark.js
A simple script to hook to a/multiple object's function which capture their execution time recursively

# Sample Usage

function Person() {
}

Person.prototype.spellMyName = function() {
	return this.getMyName();
}

Person.prototype.getMyName = function() {
	return 'ZeroX Lim';
}

// can be multiple object/prototype, then it will generate all stack for those 
// hook under the same benchmark object
var benchmark = new Benchmark( Person.prototype );

var person = new Person();
person.spellMyName();

# Sample log
-> [spellMyName] 0.2880ms(100.0000%)
 	  [getMyName] 0.0950ms(32.9861%)