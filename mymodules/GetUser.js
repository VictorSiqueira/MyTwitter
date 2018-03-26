var GetUsers = function () { };

var res_array = [];

function getUserInfo(client, id_list) {
    return client.get('users/lookup', {
            "user_id": id_list
        }).then(function(data) {
            res_array.push(data);
        })
        .catch(function(error) {
            throw error;
        })
}

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
            promises_arr.push(getUserInfo(client, data.ids.slice(i * 100, i * 100 + 100).join(",")));
        }
        
        if (remainder != 0) {
            promises_arr.push(getUserInfo(client, data.ids.slice(requestNum * 100, requestNum * 100 + 100).join(",")));
        }

        // ENTENDER COMO FUNCIONA ESSE PROMISSE
        Promise.all(promises_arr)
            .then(function() {
                for (var i in res_array) {
                    for (var j in res_array[i]) {
                        var user = res_array[i][j];
                        /*console.log(user.id + " - " +
                            user.name + " - " +
                            user.screen_name + " - " +
                            user.followers_count + " - " +
                            user.friends_count)*/
                        callback(user)
                    }
                }
            })
            .catch(console.error);
    });
}

module.exports = new GetUsers();