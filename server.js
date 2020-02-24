const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

// lista de doadores
const donors = [
    {
        name: "Diego Fernandes",
        blood: "AB+"
    },
    {
        name: "Cleiton Souza",
        blood: "B+"
    },
    {
        name: "Robson Marques",
        blood: "O+"
    },
    {
        name: "Lucas Pinho",
        blood: "A-"
    },
]

server.get("/", (req, res) => {
    return res.render("index.html", { donors })
})






server.listen(3000, function() {
    console.log("iniciei o servidor.")
});