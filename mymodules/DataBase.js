var DataBase = function () { };

var mySql = require('mysql');

var con = mySql.createPool({
  host: "localhost",
  port:'3306',
  user: "root",
  password: "",
  connectionLimit : 10,
  database: 'Twitter'
});

DataBase.prototype.initDatabase = function(){
	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	  con.query("CREATE DATABASE Twitter", function (err, result) {
	    if (err) throw err;
	    console.log("Database created");
	  });
	});
}

DataBase.prototype.saveUser = function(user){
	const sql = "INSERT INTO user(id, name, screen_name, followers, following, verified) VALUES ?";
	const values =[[user.id, user.name.replace(/[^\w\s]/gi, ''), user.screen_name, user.followers_count, user.following,user.verified]]
	/*con.query(sql, [values], function (error, results, fields){
    	if(error) return console.log(error);
    	console.log('adicionou registros!');
    	con.release();//fecha a conexão
   });*/
  con.getConnection(function(err, connection) {
    connection.query(sql, [values], function (error, results, fields) {
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

DataBase.prototype.getAllUsers = function(callback){
  const sql = "Select * FROM user";
  con.getConnection(function(err, connection) {
    connection.query(sql, function (error, results, fields) {
      callback(results)
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

DataBase.prototype.deleteUser = function(user, callback){
  //const sql = "DELETE FROM user WHERE id = "+user.id;
  const sql = "DELETE FROM user WHERE screen_name = '"+user.screen_name+"'";
  con.getConnection(function(err, connection) {
    connection.query(sql, function (error, results, fields) {
      callback(results)
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}


DataBase.prototype.saveMyFollowers = function(user){
  const sql = "INSERT INTO follower(id, name, screen_name, followers, following, verified) VALUES ?";
  const values =[[user.id, user.name.replace(/[^\w\s]/gi, ''), user.screen_name, user.followers_count, user.following,user.verified]]
  con.getConnection(function(err, connection) {
    connection.query(sql, [values], function (error, results, fields) {
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}


////////////////////////////////////////////////////////////////////

DataBase.prototype.updateMyFollowers = function(user){
  const sql = "UPDATE follower SET "+ 
                "id = "+user.id+" , name = '"+user.name.replace(/[^\w\s]/gi, '')+"', "+
                "screen_name = '"+user.screen_name+"', followers = "+ user.followers_count+", "+
                "following = "+user.following+", verified = "+user.verified+", "+
                "following_back = true WHERE id =  "+user.id+"";
  /*const values =[[user.id, user.name.replace(/[^\w\s]/gi, ''), 
                  user.screen_name, user.followers_count,
                  user.following,user.verified,
                  user.id]]*/
                  console.log(sql)
  con.getConnection(function(err, connection) {
    connection.query(sql, /*[values],*/ function (error, results, fields) {
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

DataBase.prototype.getAllMyFollowers = function(callback){
  const sql = "Select * FROM follower";
  con.getConnection(function(err, connection) {
    connection.query(sql, function (error, results, fields) {
      callback(results)
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

DataBase.prototype.deleteMyFollowers = function(user, callback){
  const sql = "DELETE FROM follower WHERE id = "+user.id;
  con.getConnection(function(err, connection) {
    connection.query(sql, function (error, results, fields) {
      callback(results)
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

module.exports = new DataBase();
