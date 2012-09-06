all: way.js
	@head -n 6 way.js > way.min.js
	@uglifyjs --no-copyright way.js >> way.min.js
