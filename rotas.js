const { Router } = require('express');

const controlePredios = require('./controllers/predios');

const rotas = new Router();

rotas.route('/predios').get(controlePredios.getPredios);
rotas.route('/predios').post(controlePredios.addPredio);
rotas.route('/predios').put(controlePredios.updatePredio);

rotas.route('/predios/:codigo').get(controlePredios.getPredioPorCodigo)
rotas.route('/predios/:codigo').delete(controlePredios.deletePredio);

module.exports = rotas;