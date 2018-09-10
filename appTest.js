var express = require('express');
var app = express();
var server = app.listen(3000);
var events = require('events');
var DataBase = require('./mymodules/DataBase.js')


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
var checkLimit = function(){
	client.get('application/rate_limit_status', function(error, res) {
		if (!error) {
			console.log(res.resources);
		}else{
			console.log(error);
		}
	});
}


///////////////REGRA DE NEGOCIO ////////////////
// 1 - pegar o nome de todos os seguidores que eu tenho 
// 2 - armazenar numa lista
// 3 - buscar seguidores de alguem
// 4 - verificar se o nome da sgunda listagem bate com a primeira e excluir
// 5 - verificar quantidade de seguidores seja o minimo solicitado
// 6 - disparar "seguir"

//pegando lista de seguidores de um usuario e paginas
var myfollowers_number = 0
var	myfollowing_number = 0
var	myfollowers_page = 0
var	myfollowing_page = 0
var my_followers_name = [];
var myfollowing_name = [];
var nameIndex = 0;
var myScreenName = "VSiqueira268"

/////////////// MY CALL

var getMyDataDetails = function (){
	getUserDetail(myScreenName, function(error, res) {
		if (!error) {
			myfollowers_number = res[0].followers_count;
			myfollowing_number = res[0].friends_count;
			myfollowers_page = Math.ceil(myfollowers_number / 200)
			myfollowing_page = Math.ceil(myfollowing_number / 200)
			console.log('///////////////////// quantidade de seguidores --- '+ myfollowers_number +'////////////////')
			console.log('///////////////////// quantidade de paginas --- '+ myfollowers_page +'////////////////');
			console.log('///////////////////// quantidade de seguindo --- '+ myfollowing_number +'////////////////')
			console.log('///////////////////// quantidade de paginas --- '+ myfollowing_page +'////////////////');
			console.log(filterUsers(res[0]))
		}else{
			console.log(error);
		}
	})
}

var getMyFollowers =  function(){
	getFollowers(-1, myScreenName, function(data){
		iterateThroughResult(data, "user", function(user){
			DataBase.saveUser(user, "user", true)
		})
	})
}

////////// FUNCTIONS 

var getUserDetail = function (userName, callback){
	client.get('users/lookup', {screen_name: userName}, function(error, res){
		callback(error, res)
	});
}

var getFollowers = function(cursor, screenName, callback){
	client.get('followers/list',{screen_name: screenName, cursor: cursor, count: 200}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }else{
	        callback(data)
	        getFollowers(data.next_cursor, screenName, callback)
        }
    });
}

var getFollowing = function(cursor, screenName){
	client.get('friends/list',{screen_name: screenName, cursor: cursor, count: 200}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }else{
        	iterateThroughResult(data, "following_users")
        	getFollowing(data.next_cursor, screenName)
        }  
    });
}

var iterateThroughResult = function(data, tableName, callback){
	console.log("////////////////////////" );
	for(n in data.users){
    	console.log("calores : " +  data.users[n].id);
    	callback(data.users[n]);
    	/*if(filterUsers(data.users[n])){
    		getUserDetail(data.users[n].screen_name, function(error, res){
    			for(){

    			}
    		})
    	}*/
    }
}

var filterUsers = function(user){
	/* nao salvar se 
	- ja sigo, 
	- se for verificado, 
	- se estiver suspenso,
	- se eu ja tiver enviado uma solicitacao
	- se tiver menos de 50 seguidores
	- se tiver uma quantidade de seguidos inferior a metade de seguidores
	- tiver uma postagem maior que 3 meses
	- nao ser perfil protegido*/
	if(user.following
		|| user.verified
		|| user.suspended
		|| user.follow_request_sent
		|| user.followers_count < 50
		|| (user.friends_count < (user.followers_count/2))
		|| threeMonthsunavailable(user)
		|| user.protected){
		return false
	}
	return true
}

var threeMonthsunavailable = function(user){
	if(user.status!=undefined){
		var date1 = new Date(user.status.created_at);
		var date2 = new Date();
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		if(diffDays > 90){
			return true
		}else {
			return false
		}
	}else{
		return false
	}
}

getMyFollowers()