//API
//https://developer.twitter.com/en/docs/basics/rate-limits
var FollowFunctions = function () { };

FollowFunctions.prototype.followUser = function (client, user, callback){
	client.post('friendships/create', {user_id: user.id},  function(error, res) {
	  if (!error) {
	  	console.log('seguiu '+user.screen_name);
	  	callback()
	  }else{
	    console.log(error);
	  }
	});
}

FollowFunctions.prototype.unfollowUser = function (client, user, callback){
	client.post('friendships/destroy', {user_id: user.id},  function(error, res) {
	  if (!error) {
	  	console.log('deseguiu '+user.screen_name);
	  	callback(user)
	  }else{
	    console.log(error);
	  }
	});
}

module.exports = new FollowFunctions();


