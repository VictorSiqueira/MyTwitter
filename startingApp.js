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

var getFollowingList = function(){
	GetUsers.getFollowingList(client, 'VSiqueira268', function(user){
		//console.log(user.screen_name);
		if(user.screen_name!=='VSiqueira268'){
			//DataBase.saveMyFollowers(user)
		}
	})
}

var getFollowersList = function(){
	GetUsers.getList(client, 'VSiqueira268', function(user){
		DataBase.updateMyFollowers(user)
	})
}

var getFollowersFromDB = function(){
	DataBase.getAllMyFollowers(function(list){
		console.log('function')
		for(item in list){
			console.log(list[item].verified +" = "+ list[item].following)
			if(!list[item].verified && !list[item].following_back && nameOut(list[item].screen_name)){
				console.log('entrou')
				FollowFunctions.unfollowUser(client, list[item], function(user){
					console.log(user.screen_name)
					DataBase.deleteMyFollowers(user, function(){
						//console.log(JSON.stringify(result))
					})
				})
			}
		}
	})
}

var nameOut = function(name){
	var ok = true
	switch (name){
		case 'caju_sz':
		case 'PatoPapao':
		case 'starswithnames':
			ok = false
	}
	return ok
}

getFollowingList()