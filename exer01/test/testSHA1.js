var sha1 = require("sha1");

var str = "123123"; // 601f1889667efaebb33b8c12572835da3f027f78

str = "a"; // 86f7e437faa5a7fce15d1ddcb9eaeaea377667b8  eee411109a229046154bc9d75265a9ccb23a3a9c

var result = sha1(sha1(str));

console.log(result);