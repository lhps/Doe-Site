const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static(__dirname + "/public"))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configurar a conexão com o banco
const Pool = require('pg').Pool;
// const db = new Pool({
//     user: 'postgres',
//     password: '0000',
//     host: 'localhost',
//     port: 5432,
//     database: 'doe',
// })
const db = new Pool({
    user: 'harxizrvdmfonl',
    password: '0000',
    host: '5119d3a8ce65579dcb2da0028d2460847c3e3e73439aac0b18bad4d1c9cf34ed',
    port: 5432,
    database: 'd5sktr1qeo95qu',
})

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./",{
    express: server,
    noCache: true,
})


server.get("/", (req, res) => {
    const selectDonors = "SELECT * FROM doe.donors";

    db.query(selectDonors, (err, result) =>{
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        return res.render("index", { donors })
    })

})

server.post("/", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados.
    const insertQuery = `INSERT INTO doe.donors ("name", "email", "blood")
    VALUES ('Lucas', 'teste@gmail.com', 'A+');`;
    // const insertQuery = `
    //     INSERT INTO donors ("name", "email", "blood")
    //     VALUES ($1, $2, $3)`;
    
    const values = [name, email, blood];

    db.query(insertQuery, values, (err) => {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    });
})



var port = process.env.PORT || 8080

server.listen(port, function() {
    console.log("iniciei o servidor.")
});