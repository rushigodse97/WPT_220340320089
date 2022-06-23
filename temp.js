let db = {
	host: 'localhost',
	user: 'root',
	password: 'cdac',
	database: 'godse',
	port: 3306
};

const mysql = require("mysql2");
const conn = mysql.createConnection(db);


const express = require('express');
const app = express();

app.listen(8081, function () {
	console.log("server listening at port 8081...");
});


app.use(express.static('abc'));

app.get('/getAllItems', function (req, res) {

	conn.query('select * from book', [],
		(err, rows) => {
			res.send(rows);
		});
});

app.get('/addItems', function (req, res) {

	let input = { bookid: req.query.bookid, bookname: req.query.bookname, price: req.query.price };

	//for checking the condition  1st select query is taken and in that insert query taken to insert a book
	//and books added successfully if bookid not present

	conn.query('select bookid from book', [],
		(err, rows) => {

			let output = true;

			for (let i = 0; i < rows.length; i++) {
				if (rows[i].bookid == input.bookid) {
					output = false;
					break;
				}
			}
			//Condition cheked for bookid 
			if (output == true) {
				conn.query('insert into book values(?,?,?)', [input.bookid, input.bookname, input.price],
					(err, rows) => {
						if (err) {
							console.log(err);
						} else {
							if (rows.affectedRows > 0) {
								output = true;
							}
						}
						res.send(output);
					});
			} else {
				res.send(output);
			}
		});

});



