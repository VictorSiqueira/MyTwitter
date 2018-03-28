var http = require('http');
var Twitter = require('twitter');
//var FileWriter = require('./mymodules/FileWriter.js');
var FollowFunctions = require('./mymodules/FollowFunctions.js');
var GetUsers = require('./mymodules/GetUser.js')
var DataBase = require('./mymodules/DataBase.js')

var client = new Twitter({
  consumer_key: 'xG8Prfdz2z8nsIaP8t5f4H0ET',
  consumer_secret: 'WDnLz9KLdzHHGAGKb48z7fbfZuamVA7tv39R6dp38BXUCm7cT9',
  access_token_key: '66762679-fnzkS2N33eB9B6V0NRt8CivHcdO4v75ZtCZJ8Jq2G',
  access_token_secret: 'WD8DKgKmrvGHSUmw880V0P6YLF7vY2jgOiITwkuRWqSQo'
});


//https://github.com/mysqljs/mysql

var followLimit = 1;
var hour = 0


var seguirUsuariosFiltrados = function(list){
	for(item in list){
		if(item <= followLimit){
			if(list[item].screen_name!='VSiqueira268'
				&& !list[item].following){
				FollowFunctions.followUser(client, list[item], function(user){
					deleteUserAfterFollow(user)
				})
			}
		}else{
			break;
		}
	}
}

var deleteUserAfterFollow = function(user){
	DataBase.deleteUser(user, function(result){
		console.log(JSON.stringify(result))
	})
}

var followAgendado = function(){
	console.log(new Date())
	if(hour!=12&&hour!=11&&hour!=23&&hour!=24){
		DataBase.getAllUsers(seguirUsuariosFiltrados)
		console.log(hour)
	}else if(hour==12){
		console.log('limpa')
	}else if(hour==24){
		console.log('limpa e reseta')
		hour = 0
	}
	hour++
	setTimeout(function(){
		followAgendado()
	}, 3600000, 'funky');
}
	
//followAgendado()
DataBase.getAllUsers(seguirUsuariosFiltrados)