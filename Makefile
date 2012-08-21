all: way.js
	@curl -s -d output_info=compiled_code --data-urlencode "js_code@way.js" http://closure-compiler.appspot.com/compile > way.min.js
