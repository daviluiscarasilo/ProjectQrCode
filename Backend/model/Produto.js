const mongoose = require('mongoose')
//Criando o schema Categoria

const ProdutoSchema = mongoose.Schema({
    numeroIdentificacao: { type: String, unique:true },
    descricao: { type: String},
    preco: {type:Number},
    atributos: {type:String},
    negocio : {type:String},
    status: { type:String, enum: ['ativo','inativo'], default:'ativo'},
},{timestamps:true})

module.exports = mongoose.model('produto',ProdutoSchema)