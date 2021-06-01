import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Toast from 'react-bootstrap/Toast'

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { BACKEND } from '../constants'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { MdSave, MdModeEdit, MdDelete, MdCancel } from 'react-icons/md'
import { FaQrcode } from 'react-icons/fa'
import { isNumberLiteral } from '@babel/types'
var QRCode = require('qrcode.react');


const Home = () => {

    const valorInicial = {

        "status": "ativo",
        "numeroIdentificacao": "",
        "descricao": "",
        "preco": 0,
        "atributos": "",
        "negocio": "",
    }

    const [produto, setProduto] = useState(valorInicial)
    const [produtos, setProdutos] = useState([])
    const [carregandoprodutos, setCarregandoprodutos] = useState(false)
    const [salvandoprodutos, setSalvandoprodutos] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)

    const [aviso, setAviso] = useState('')
    const [erros, setErros] = useState({})

    const { numeroIdentificacao, descricao, preco, atributos, negocio, status } = produto

    async function obterprodutos() {
        setCarregandoprodutos(true)
        let url = `${BACKEND}/produtos`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setProdutos(data)
                console.log(data)
            })
            .catch(function (error) {
                console.error(`Erro ao obter as produtos: ${error.message}`)
            })
        setCarregandoprodutos(false)

    }

    useEffect(() => {
        document.title = 'Cadastro de produtos'
        obterprodutos()
    }, [])

    const validaErrosproduto = () => {
        const re = /^[0-9\b]+$/;

        const novosErros = {}
        //Validação de Código identificação
        if (!numeroIdentificacao || numeroIdentificacao === '') novosErros.numeroIdentificacao = 'O código de identificação não pode ser vazio'
        else if (numeroIdentificacao.length > 20) novosErros.numeroIdentificacao = 'O código de identificação informado é muito longo'
        else if (numeroIdentificacao.length < 5) novosErros.numeroIdentificacao = 'O código de identificação informado é muito curto'

        //Validação de Descrição
        if (!descricao || descricao === '') novosErros.descricao = 'A descrição não pode ser vazia'
        else if (descricao.length > 300) novosErros.descricao = 'A descrição informada é muito longa'

        //Validação de Atributos
        if (!atributos || atributos === '') novosErros.atributos = 'O atributo não pode ser vazio'
        else if (atributos.length > 300) novosErros.atributos = 'O atributo  informado é muito longo'


        //Validação de Negocio
        if (!negocio || negocio === '') novosErros.negocio = 'O negócio não pode ser vazio'
        else if (negocio.length > 300) novosErros.negocio = 'O negócio  informado é muito longo'
        debugger;
        //Validação de Negocio
        if (!preco || preco === '') novosErros.preco = 'O preço não pode ser vazio'
        else if (!re.test((preco + "").replaceAll(".", ""))) novosErros.preco = 'O preço  informado precisa ser numérico'
        else if ((preco + "").split(".").length > 2) novosErros.preco = 'O preço  informado precisa ser numérico'
        return novosErros
    }

    const alteraDadosproduto = e => {
        setProduto({ ...produto, [e.target.name]: e.target.value })


        setErros({})
    }

    async function salvarproduto(e) {
        e.preventDefault() // evita que a página seja recarregada  
        const novosErros = validaErrosproduto()
        //Existe algum erro no array?
        if (Object.keys(novosErros).length > 0) {
            //Sim, temos erros!
            setErros(novosErros)
        } else {
            const metodo = produto.hasOwnProperty('_id') ? 'PUT' : 'POST'
            produto.status = (produto.status === true || produto.status === 'ativo') ? 'ativo' : 'inativo'
            setSalvandoprodutos(true)
            let url = `${BACKEND}/produtos`
            await fetch(url, {
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            }).then(response => response.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro salvo com sucesso') : setAviso('')
                    setProduto(valorInicial) //limpa a tela
                    obterprodutos()
                }).catch(function (error) {
                    console.error(`Erro ao salvar a produto: ${error.message}`)
                })
            setSalvandoprodutos(false)
        }
    }

    async function excluirproduto() {
        let url = `${BACKEND}/produtos/${produto._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                data.message ? setAviso(data.message) : setAviso('')
                setProduto(valorInicial)
                obterprodutos()
            })
            .catch(function (error) {
                console.error(`Erro ao excluir a produto: ${error.message}`)
            })
    }

    function QrcodeAlert(produto) {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            didOpen: () => {
                // `MySwal` is a subclass of `Swal`
                //   with all the same instance & static methods
                MySwal.clickConfirm()
            }
        }).then(() => {
            var qrCodeValue = (produto.numeroIdentificacao + "\n"
                + produto.descricao + "\n"
                + produto.preco + "\n"
                + produto.atributos + "\n"
                + produto.negocio + "\n"
                + produto.status + "\n") + "";
            return MySwal.fire(<QRCode value={qrCodeValue}/>)
            
        })
    }

    return (
        <>
            <Container fluid className="p-0">
                <Cabecalho />
                <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <Col xs={12} lg={12}>
                        <b>
                            <h3 className="text-center"> Gerenciamento de Itens</h3>
                        </b>
                    </Col>
                </Row>
                <Form method="post">
                    <Form.Group as={Row} controlId="descricao">
                        <Form.Label column xs={2} lg={2} className="titulosFormulario">Descrição:</Form.Label>
                        <Col xs={9} lg={9} >
                            <Form.Control
                                className="camposFormulario"
                                name="descricao"
                                placeholder="Ex: 78983574100015"
                                onChange={alteraDadosproduto}
                                value={descricao}
                                isInvalid={!!erros.descricao}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.descricao}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="atributos">
                        <Form.Label column xs={2} lg={2} className="titulosFormulario">Atributos:</Form.Label>
                        <Col xs={9} lg={9} >
                            <Form.Control
                                className="camposFormulario"
                                name="atributos"
                                placeholder="Ex: Tamanho; Altura; Comprimento; peso"
                                onChange={alteraDadosproduto}
                                value={atributos}
                                isInvalid={!!erros.atributos}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.atributos}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="negocio">
                        <Form.Label column xs={2} lg={2} className="titulosFormulario">Negócio:</Form.Label>
                        <Col xs={9} lg={9} >
                            <Form.Control
                                className="camposFormulario"
                                name="negocio"
                                placeholder="Ex: Tamanho do estoque, frequência de reposição, pedido mínimo"
                                onChange={alteraDadosproduto}
                                value={negocio}
                                isInvalid={!!erros.negocio}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.negocio}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="preco">
                        <Form.Label column xs={2} lg={2} className="titulosFormulario">Preço:</Form.Label>
                        <Col xs={2} lg={2} >
                            <Form.Control
                                className="camposFormulario"
                                name="preco"
                                placeholder="Ex: 19,90"
                                onChange={alteraDadosproduto}
                                value={preco}
                                isInvalid={!!erros.preco}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.preco}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="numeroIdentificacao">
                        <Form.Label column xs={2} lg={2} className="titulosFormulario">Código Identificação:</Form.Label>
                        <Col xs={2} lg={2} >
                            <Form.Control
                                className="camposFormulario"
                                name="numeroIdentificacao"
                                placeholder="Ex: 78983574100015"
                                onChange={alteraDadosproduto}
                                value={numeroIdentificacao}
                                isInvalid={!!erros.numeroIdentificacao}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.numeroIdentificacao}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="status">
                        <Col xs={2} lg={2} className="offset-lg-2 offset-xs-2">
                            <Form.Check type="checkbox" label="Ativo" name="status"
                                onChange={(e) => setProduto({ ...produto, [e.target.name]: e.target.checked })}
                                checked={status} />
                        </Col>
                    </Form.Group>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col xs={4} lg={4} className="offset-lg-8 offset-xs-8">
                            <Button style={{ marginRight: "30px" }} variant="primary" type="submit" title="Salvar o registro"
                                onClick={(e) => salvarproduto(e)}>
                                {salvandoprodutos
                                    ? <Spinner animation="border" size="sm" />
                                    : <MdSave />
                                }
                                Salvar
                            </Button>
                            &nbsp;
                            <Button variant="danger" type="button" title="Cancelar"
                                onClick={() => setProduto(valorInicial)}>
                                <MdCancel /> Cancelar
                            </Button>
                        </Col>
                    </Row>

                </Form>
                <Row>
                    <Col xs={12} lg={12}>
                        {/* Listagem das produtos */}
                        {carregandoprodutos &&
                            <>
                                <Spinner animation="border" size="sm" />
                                <Spinner animation="grow" variant="info" />
                                <p>Aguarde, enquanto as produtos são carregados...</p>
                            </>
                        }
                        <Table className="text-center" striped bordered hover>
                            <thead>
                                <tr className="relatorio text-dark">
                                    <th>Código Identificacao</th>
                                    <th>Descrição</th>
                                    <th>Preço</th>
                                    <th>Atributos</th>
                                    <th>Negocio</th>
                                    <th>Status</th>
                                    <th>Data Criação</th>
                                    <th>Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.numeroIdentificacao}</td>
                                        <td>{item.descricao}</td>
                                        <td>{item.preco}</td>
                                        <td>{item.atributos}</td>
                                        <td>{item.negocio}</td>
                                        <td>{item.status}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button variant="outline-primary" title="Editar o registro"
                                                onClick={() => {setProduto(item);window.scrollTo(0, 0)}}>
                                                <MdModeEdit />
                                            </Button>
                                            &nbsp;
                                            <Button variant="outline-danger" title="Apagar o registro"
                                                onClick={() => {
                                                    setProduto(item)
                                                    setConfirmaExclusao(true)
                                                }} >
                                                <MdDelete />
                                            </Button>
                                            &nbsp;
                                            <Button variant="outline-success" type="button" title="QRCode"

                                                onClick={() => QrcodeAlert(item)}>
                                                <FaQrcode /> QRCode
                                              </Button>

                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-dark text-light">
                                    <td colSpan="3">Total de Registros:</td>
                                    <td>{produtos.length}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <Modal animation={false} show={confirmaExclusao} onHide={() => setConfirmaExclusao(false)}>
                    <Modal.Header>
                        <Modal.Title>Confirmação da Exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirma a exclusão da produto selecionado?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setConfirmaExclusao(!confirmaExclusao)}>
                            ❌Cancelar
                            </Button>
                        <Button variant="success"
                            onClick={() => {
                                setConfirmaExclusao(!confirmaExclusao)
                                excluirproduto()
                            }}>
                            ✔️Confirmar
                            </Button>
                    </Modal.Footer>
                </Modal>

                <Toast
                    onClose={() => setAviso('')}
                    show={aviso.length > 0}
                    animation={false}
                    delay={4000}
                    autohide
                    className="bg-success"
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}>
                    <Toast.Header>Aviso</Toast.Header>
                    <Toast.Body className="text-light">{aviso}</Toast.Body>
                </Toast>

                <Rodape />
            </Container>
        </>
    )
}

export default Home