// imports das libs
const express = require("express");
const server = express();
// Dev
//const Pool = require('pg').Pool;
// Prod
const Pool = require('pg-pool');
const url = require('url');

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static(__dirname + "/public"))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configurando o banco de dados no heroku
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};
const db = new Pool(config);


// configurar a conexão com o banco local
// const db = new Pool({
//     user: 'postgres',
//     password: '0000',
//     host: 'localhost',
//     port: 5432,
//     database: 'doe',
// })


// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./",{
    express: server,
    noCache: true,
})


server.get("/", (req, res) => {
    const selectDonors = "SELECT * FROM donors";


    db.query(selectDonors, (err, result) =>{
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        return res.render("index.html", { donors })
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
    // const insertQuery = `INSERT INTO donors ("name", "email", "blood")
    // VALUES ('teste', 'teste@te.com', 'A+');`;
    const insertQuery = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`;
    
    const values = [name, email, blood];

    db.query(insertQuery, values, (err) => {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    });
})



server.listen(process.env.PORT || 3000, function() {
    console.log("iniciei o servidor.")
});