var express = require('express');
var app = express();
var server = app.listen(3000);
var events = require('events');
var DataBase = require('./mymodules/DataBase.js')
var FollowFunctions = require('./mymodules/FollowFunctions.js');

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
var listFromDB = []
var followIndex = 0;

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

var getUsersFromDB = function(callback){
	listFromDB = [];
	DataBase.getAllUsers(function(list){
		listFromDB = list;
		callback();
	})
}

////////// OTHER USERS

var getAndCompareFollowers = function(){
	getUsersFromDB(function(){
		getFollowersFromOtherUser();
	})
}

var getFollowersFromOtherUser =  function(){
	getFollowers(-1, "StoneDYooDa", function(data){
		iterateThroughResult(data, "user", function(user){
			var exists = false
			for(l in listFromDB){
				if(listFromDB[l].id == user.id){
					exists = true;
				}
			}
			if(!exists){
				DataBase.saveUser(user, "user", false)
			}
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

var followUser =  function(user, callback){
	FollowFunctions.followUser(client, user, function(user){
		//deleteUserAfterFollow(user)
		callback(user);
	})
}

var iterateThroughResult = function(data, tableName, callback){
	console.log("////////////////////////" );
	for(n in data.users){
    	console.log("calores : " +  data.users[n].id);
    	callback(data.users[n]);
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


/*getUsersFromDB(function(){
	getFollowersFromOtherUser();
})*/


DataBase.getWhoIDontFollowYet(function(results){
	listFromDB = results;
	while(followIndex < 50){
		console.log(listFromDB[followIndex])
		if(listFromDB[followIndex]!=undefined){
			followUser(listFromDB[followIndex], function(user){
				if(user!=undefined){
					DataBase.updateWhoIFollowed(user, function(){
						console.log(user.id+" | "+user.following)
					})
				}
			})
			followIndex++;
		}else{
			break;
		}
	}
})
/*
var dummie = { id: 66762679,
    id_str: '66762679',
    name: 'Victor Siqueira',
    screen_name: 'VSiqueira268',
    location: 'Brasil',
    description: 'Youtube: https://t.co/663lEhQsX1\nTwitch:\nhttps://t.co/qzLkWRwrHP',
    url: null,
    entities: { description: [Object] },
    protected: false,
    followers_count: 796,
    friends_count: 463,
    listed_count: 1,
    created_at: 'Tue Aug 18 18:48:34 +0000 2009',
    favourites_count: 275,
    utc_offset: null,
    time_zone: null,
    geo_enabled: true,
    verified: false,
    statuses_count: 438,
    lang: 'en',
    status:
     { created_at: 'Wed Sep 05 17:42:05 +0000 2018',
       id: 1037395455280341000,
       id_str: '1037395455280340994',
       text: 'eles falam como se quem ta assistindo fosse doente mental, WTF https://t.co/RpDEDaPIQx',
       truncated: false,
       entities: [Object],
       source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
       in_reply_to_status_id: null,
       in_reply_to_status_id_str: null,
       in_reply_to_user_id: null,
       in_reply_to_user_id_str: null,
       in_reply_to_screen_name: null,
       geo: null,
       coordinates: null,
       place: null,
       contributors: null,
       is_quote_status: true,
       quoted_status_id: 1037394492662468600,
       quoted_status_id_str: '1037394492662468608',
       retweet_count: 0,
       favorite_count: 0,
       favorited: false,
       retweeted: false,
       possibly_sensitive: false,
       lang: 'pt' },
    contributors_enabled: false,
    is_translator: false,
    is_translation_enabled: false,
    profile_background_color: 'FFFFFF',
    profile_background_image_url: 'http://abs.twimg.com/images/themes/theme9/bg.gif',
    profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme9/bg.gif',
    profile_background_tile: true,
    profile_image_url: 'http://pbs.twimg.com/profile_images/882046888467349504/g7Z60qm6_normal.jpg',
    profile_image_url_https: 'https://pbs.twimg.com/profile_images/882046888467349504/g7Z60qm6_normal.jpg',
    profile_banner_url: 'https://pbs.twimg.com/profile_banners/66762679/1501555366',
    profile_link_color: 'FF691F',
    profile_sidebar_border_color: 'FF3300',
    profile_sidebar_fill_color: '252429',
    profile_text_color: 'CCCACC',
    profile_use_background_image: true,
    has_extended_profile: false,
    default_profile: false,
    default_profile_image: false,
    following: false,
    follow_request_sent: false,
    notifications: false,
    translator_type: 'none',
    suspended: false,
    needs_phone_verification: false };

    DataBase.saveUser(dummie, "user", false)*/