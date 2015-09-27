# Benchmark.js
A simple script to hook to a/multiple object's function which capture their execution time recursively

# Sample Usage

function Person() {}

Person.prototype.spellMyName = function() {<br />
	return this.getMyName();<br />
}<br />

Person.prototype.getMyName = function() {<br />
	return 'ZeroX Lim';<br />
}<br />

// can be multiple object/prototype, then it will generate all stack for those <br />
// hook under the same benchmark object<br />
var benchmark = new Benchmark( Person.prototype );

var person = new Person();<br />
person.spellMyName();<br />

# Sample log
-> [spellMyName] 0.2880ms(100.0000%)<br />
\t\t[getMyName] 0.0950ms(32.9861%)<br />