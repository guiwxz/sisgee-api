const { pool } = require('../config');

const { request, response } = require('express');

const getPredios = (request, response) => {
  pool.query('SELECT * FROM predios order by codigo',
    (error, results) => {
      if (error)
        return response.status(400).json({ status: 'error', message: 'Erro ao consultar predio: ' + error })
    
      response.status(200).json(results.rows);
    }
  )
}

const addPredio = (request, response) => {
  const { nome, descricao, sigla } = request.body;
  pool.query(`
    INSERT INTO predios (nome, descricao, sigla) 
    VALUES ($1, $2, $3) 
    RETURNING codigo, nome, descricao, sigla
  `, 
    [nome, descricao, sigla],
    (error, results) => {
      if (error) {
        return response.status(400).json({
          status: 'error',
          message: 'Erro ao inserir predio: ' + error
        })
      }

      response.status(200).json({
        status: "success",
        message: "predio criado",
        objeto: results.rows[0]
      })
    }
    
  )
}

const updatePredio = (request, response) => {
  const { codigo, nome, descricao, sigla } = request.body;
  pool.query(`
    UPDATE predios SET nome=$1, descricao=$2, sigla=$3 
    WHERE codigo=$4 
    RETURNING codigo, nome, descricao, sigla
  `, 
    [nome, descricao, sigla, codigo],
    (error, results) => {
      if (error) {
        return response.status(400).json({
          status: 'error',
          message: 'Erro ao alterar o predio: ' + error
        })
      }

      response.status(200).json({
        status: "success",
        message: "predio alterado",
        objeto: results.rows[0]
      })
    }
    
  )
}

const deletePredio = (request, response) => {
  const codigo = parseInt(request.params.codigo);

  pool.query(`
    DELETE FROM predios 
    WHERE codigo=$1 
  `, 
    [codigo],
    (error, results) => {
      if (error || results.rowCount == 0) {
        return response.status(400).json({
          status: 'error',
          message: 'Erro ao remover o predio: ' + (error ? error : 'nao removeu nenhuma linha')
        })
      }

      response.status(200).json({
        status: "success",
        message: "predio removido",
      })
    }
    
  )
}

const getPredioPorCodigo = (request, response) => {
  const codigo = parseInt(request.params.codigo);

  pool.query(`
    SELECT * 
    FROM predios 
    WHERE codigo=$1 
  `, 
    [codigo],
    (error, results) => {
      if (error || results.rowCount == 0) {
        return response.status(400).json({
          status: 'error',
          message: 'Erro ao buscar predio: ' + error
        })
      }

      response.status(200).json({
        status: "success",
        message: "predio",
        objeto: results.rows[0]
      })
    }
    
  )
}

module.exports = {
  getPredios,
  addPredio,
  deletePredio,
  updatePredio,
  getPredioPorCodigo
}