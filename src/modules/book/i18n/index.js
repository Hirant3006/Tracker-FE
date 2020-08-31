var context = require.context('./', true, /\.js$/);
context.keys().forEach((filename)=>{
	if (filename === "./index.js") return; 
	context(filename);
});