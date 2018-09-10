var DataBase = function () { };

var mySql = require('mysql');

const con  = mySql.createPool({
    host: "localhost",
    port:'3306',
    user: "root",
    password: "",
    connectionLimit : 10,
    database: 'Twitter'
});

var initiateDatabase = function(){
  con.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE Twitter IF NOT EXISTS", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });
}

DataBase.prototype.initDatabase = function(){
	initiateDatabase()
}

DataBase.prototype.saveUser = function(user, tableName, isMyFollower){
  //initiateDatabase()
	const sql = "INSERT INTO "+tableName+"(id, name, screen_name, followers, following, verified, follow_me) VALUES ?";
	const values =[[user.id, user.name.replace(/[^\w\s]/gi, ''), user.screen_name, user.followers_count, user.following,user.verified, isMyFollower]]
  con.getConnection(function(err, connection) {
    connection.query(sql, [values], function (error, results, fields) {
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

DataBase.prototype.getAllUsers = function(callback){
  const sql = "Select * FROM user";
  con.getConnection(function(err, connection) {
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {//throw error;
        console.log("ERROR :"+error)
      }else{
        callback(results)
      }
    });
  })
}

////////////////////////////////////////////////////////////////////

DataBase.prototype.saveMyFollower = function(user){
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

DataBase.prototype.updateMyFollower = function(user){
  const sql = "UPDATE follower SET "+ 
                "id = "+user.id+" , name = '"+user.name.replace(/[^\w\s]/gi, '')+"', "+
                "screen_name = '"+user.screen_name+"', followers = "+ user.followers_count+", "+
                "following = "+user.following+", verified = "+user.verified+", "+
                "following_back = true WHERE id =  "+user.id+"";
                  console.log(sql)
  con.getConnection(function(err, connection) {
    connection.query(sql, /*[values],*/ function (error, results, fields) {
      connection.release();
      if (error) //throw error;
        console.log("ERROR :"+error)
    });
  })
}

DataBase.prototype.deleteMyFollower = function(user, callback){
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

module.exports = new DataBase();
