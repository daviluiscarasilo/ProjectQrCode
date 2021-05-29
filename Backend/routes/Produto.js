// API REST dos Produtos
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Produto = require('../model/Produto')


/*****************************
 * GET /produtos/
 * Listar todos os produtos
 ****************************/

router.get("/", async(req, res) => {
    try{
        const produtos = await Produto.find()
        res.json(produtos)
    }catch (err){
        res.status(500).send({
            errors: [{message: 'Não foi possível obter os produtos!'}]
        })
    }
})

/*****************************
 * GET /produtos/:id
 * Listar o produto pelo id
 *****************************/
router.get('/:id', async(req, res)=>{
    try{
       const produto = await Produto.findById(req.params.id)
       res.json(produto)
    } catch (err){
      res.status(500).send({
       errors: [{message: `Não foi possível obter o produto com o id ${req.params.id}`}]
      })
    }
})

/*****************************
 * POST /produtos/
 * Inclui um novo produto
 ****************************/
const validaproduto = [
    check('numeroIdentificacao','Número de identificação do produto é obrigatório').notEmpty(),
    check('descricao','Descrição do produto é obrigatório').notEmpty(),
    check('atributos','Atributos do produto é obrigatório').notEmpty(),
    check('negocio','Negócio do produto é obrigatório').notEmpty(),
    check('preco','Preço do produto é obrigatórioe precisa ser numérico').notEmpty().isNumeric(),
    check('status','Informe um status válido para produto').isIn(['ativo','inativo'])
]

router.post('/', validaproduto,
  async(req, res)=> {

      const errors = validationResult(req)

      if(!errors.isEmpty()){
          return res.status(400).json({
              errors: errors.array()
          })
      }

      //Verifica se o produto já existe
      const { numeroIdentificacao } = req.body

      let produto = await Produto.findOne({numeroIdentificacao})
      if(produto)
        return res.status(200).json({errors:[{message:'Já existe um produto com o número de identificação informado!'}]})
     try{
         let produto = new Produto(req.body)
         await produto.save()
         res.send(produto)
     } catch (err){
         return res.status(500).json({
             errors: [{message: `Erro ao salvar o produto: ${err.message}`}]
         })
     }      
  })

/*****************************
 * DELETE /produtos/:id
 * Apaga o produto pelo id informado
 ****************************/
router.delete("/:id", async(req, res) => {
    await Produto.findByIdAndRemove(req.params.id)
    .then(produto => {res.send(
        {message: `produto ${produto.numeroIdentificacao} removido com sucesso`}
        )
    }).catch(err => {
        return res.status(500).send(
            {errors: 
            [{message: `Não foi possível apagar o produto com o id ${req.params.id}`}]
            })
    })
})

/*******************************************
 * PUT /produtos
 * Altera os dados do produto informada
 *******************************************/
router.put('/', validaproduto,
async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body

    await Produto.findByIdAndUpdate(req.body._id, {
        $set: dados
    },{new: true})
    .then(produto => {
        res.send({message: `produto ${Produto.nome} alterado com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{
        message:`Não foi possível alterar o produto com o id ${req.body._id}`}]
        })
    })
})


module.exports = router
