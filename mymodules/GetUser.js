var GetUsers = function () { };

var res_array_follow = [];
var res_array_unfollow = [];


GetUsers.prototype.getList = function(client, username, callback){
    client.get('followers/ids',{screen_name: username}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("total followers : " + data.ids.length);

        var requestNum = Math.floor(data.ids.length / 100);
        var remainder = data.ids.length % 100;
        var promises_arr = [];

        for (var i = 0; i < requestNum; i++) {
            promises_arr.push(getUserInfo(client, data.ids.slice(i * 100, i * 100 + 100).join(","), res_array_follow));
        }
        if (remainder != 0) {
            promises_arr.push(getUserInfo(client, data.ids.slice(requestNum * 100, requestNum * 100 + 100).join(","), res_array_follow));
        }

        // ENTENDER COMO FUNCIONA ESSE PROMISSE
        Promise.all(promises_arr)
            .then(function() {
                for (var i in res_array_follow) {
                    for (var j in res_array_follow[i]) {
                        var user = res_array_follow[i][j];
                        callback(user)
                    }
                }
            })
            .catch(console.error);
    });
}

index = 1
function getUserInfo(client, id_list, res_array) {
    return client.post('users/lookup', {
            "user_id": id_list
        }).then(function(data) {
            res_array.push(data);
        })
        .catch(function(error) {
            throw error;
        })
}

GetUsers.prototype.getFollowingList = function(client, username, callback){
    client.get('friends/ids',{screen_name: username}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("total following : " + data.ids.length);

        var requestNum = Math.floor(data.ids.length / 100);
        var remainder = data.ids.length % 100;
        var promises_arr = [];

        for (var i = 0; i < requestNum; i++) {
            promises_arr.push(getUserInfo(client, data.ids.slice(i * 100, i * 100 + 100).join(","), res_array_unfollow));
        }        
        if (remainder != 0) {
            promises_arr.push(getUserInfo(client, data.ids.slice(requestNum * 100, requestNum * 100 + 100).join(","), res_array_unfollow));
        }

        // ENTENDER COMO FUNCIONA ESSE PROMISSE
        Promise.all(promises_arr)
            .then(function() {
                console.log(res_array_unfollow[0].length)
                for (var i in res_array_unfollow) {
                    for (var j in res_array_unfollow[i]) {
                        var user = res_array_unfollow[i][j];
                        console.log(index)
                        callback(user)
                        index++
                    }
                }
            })
            .catch(console.error);
    });
}

module.exports = new GetUsers();