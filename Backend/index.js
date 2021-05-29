const express = require('express')
require('dotenv').config() //Carrega as variáveis de ambiente
const InicializaMongoServer = require('./config/db')
InicializaMongoServer() //Inicializamos o MongoDB
//Definindo as rotas do nosso backend
const rotasProduto = require('./routes/Produto')
//Inicializamos o nosso app a partir da biblioteca express
const app = express()
//Removendo o x-powered-by por segurança
app.disable('x-powered-by')

//Porta default do Backend
const PORT = process.env.PORT || 4000

//Middleware do Express
app.use(function(req, res, next){
    //Em produção, remova o * e atualize com o domínio/ip do seu app
    res.setHeader('Access-Control-Allow-Origin', '*')
    //Cabeçalhos que serão permitidos
    res.setHeader('Access-Control-Allow-Headers','*')
    //Ex: res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, access-token')
    //Métodos que serão permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    next()
})
//Definimos que o backend fará o parse do JSON
app.use(express.json())

//Definimos a nossa primeira rota
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API 100% funcional!👏',
        versao: '1.0.0'
    })
})

app.use("/produtos", rotasProduto)



//Rota para tratar erros 404 (deve ser a última sempre!)
app.use(function(req, res){
    res.status(404).json({
        mensagem: `A rota ${req.originalUrl} não existe!`
    })
})

app.listen(PORT, (req, res) => {
    console.log(`💻 API Web rodando na porta ${PORT}`)
}
)