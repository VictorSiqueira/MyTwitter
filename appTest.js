var express = require('express');
var app = express();
var server = app.listen(3000);
var events = require('events');

//API
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'xG8Prfdz2z8nsIaP8t5f4H0ET',
  consumer_secret: 'WDnLz9KLdzHHGAGKb48z7fbfZuamVA7tv39R6dp38BXUCm7cT9',
  access_token_key: '66762679-fnzkS2N33eB9B6V0NRt8CivHcdO4v75ZtCZJ8Jq2G',
  access_token_secret: 'WD8DKgKmrvGHSUmw880V0P6YLF7vY2jgOiITwkuRWqSQo'
});


//Listener
var eventEmitter = new events.EventEmitter();
eventEmitter.on('scream', function () {
  console.log('I hear a scream!');
});

server.listen(3000, function() {
  console.log('Servidor rodando!');
});


//checando limite de chamadas
client.get('application/rate_limit_status', function(error, res) {
  if (!error) {
  	console.log(res.resources);
  }else{
    console.log(error);
  }
});


///////////////REGRA DE NEGOCIO ////////////////
// 1 - pegar o nome de todos os seguidores que eu tenho 
// 2 - armazenar numa lista
// 3 - buscar seguidores de alguem
// 4 - verificar se o nome da sgunda listagem bate com a primeira e excluir
// 5 - verificar quantidade de seguidores seja o minimo solicitado
// 6 - disparar "seguir"

//pegando lista de seguidores de um usuario e paginas
var my_qtdUsers_number = 0
var my_qtdUsers_page = 0


var getMyFollowers_Numbers = function (){
	client.get('users/lookup', {screen_name: 'VSiqueira268'},  function(error, res) {
	  if (!error) {
	  	console.log('///////////////////// quantidade de seguidores --- '+ res[0].followers_count +'///////////////////////////////')
	  	my_qtdUsers_number = res[0].followers_count;
		my_qtdUsers_page = Math.ceil(my_qtdUsers_number / 200)
		getMyFollowers_Name();
	  }else{
	    console.log(error);
	  }
	});
}


var my_followers_name = [];
var nameIndex = 0;

var getMyFollowers_Name = function (){
	var cursor = -1;
	while(cursor <= my_qtdUsers_page -1){
		console.log(cursor);
		client.get('followers/list', {screen_name: 'VSiqueira268', count: 200, cursor: cursor},  function(error, tweets, res) {
		  if (!error) {
		  	console.log('/////////////////////// meus seguidores ///////////////////////////////')
		  	for(u in tweets.users){
		  	  	my_followers_name[nameIndex] = tweets.users[u].screen_name;
		  	  	nameIndex++;
		  	}
		  	console.log(tweets.users.length+": "+my_followers_name.length);
		  }else{
		    console.log(error);
		  }
		});
		cursor++;
	}
}


getMyFollowers_Numbers();

var getMyOthers_Name = function (){
	var cursor = -1;
	while(cursor <= my_qtdUsers_page -1){
		console.log(cursor);
		client.get('followers/list', {screen_name: 'VSiqueira268', count: 200, cursor: cursor},  function(error, tweets, res) {
		  if (!error) {
		  	console.log('/////////////////////// meus seguidores ///////////////////////////////')
		  	for(u in tweets.users){
		  	  	my_followers_name[nameIndex] = tweets.users[u].screen_name;
		  	  	nameIndex++;
		  	}
		  	console.log(tweets.users.length+": "+my_followers_name.length);
		  }else{
		    console.log(error);
		  }
		});
		cursor++;
	}
}

var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  // Verificamos a URL
  if (request.url === '/') {
    response.write('<h1>Página inicial</h1>');
    
  } else if (request.url === '/sobre'){
    response.write('<h1>Sobre</h1>');
  } else {
    response.write('<h1>Página não encontrada :(</h1>');
  }

  response.end();
});

server.listen(3000, function() {
  console.log('Servidor rodando!');
});