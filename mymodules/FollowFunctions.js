//API
//https://developer.twitter.com/en/docs/basics/rate-limits
var FollowFunctions = function () { };

FollowFunctions.prototype.followUser = function (client, user, callback){
	if(user!=undefined){
		client.post('friendships/create', {user_id: user.id}/*{screen_name : user.screen_name}*/,  function(error, res) {
		  if (!error) {
		  	console.log('seguiu '+res.screen_name);
		  	callback(res)
		  }else{
		    console.log(error);
		  }
		});
	}
}

FollowFunctions.prototype.unfollowUser = function (client, user, callback){
	if(user!=undefined){
		client.post('friendships/destroy', {user_id: user.id},  function(error, res) {
		  if (!error) {
		  	console.log('deseguiu '+user.screen_name);
		  	callback(user)
		  }else{
		    console.log(error);
		  }
		});
	}
		
}

module.exports = new FollowFunctions();


