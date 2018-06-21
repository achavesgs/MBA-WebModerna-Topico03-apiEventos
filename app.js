var express = require('express');
var load = require('express-load');
var cors = require('cors');

var app = express(); //utilizado para poder executar o conteudo da pasta models
var bodyParser = require('body-parser'); // ó o que permite ler as informações do formulário

app.use(cors()); //CROSS ORIGIN RESOURCES SHARING; canal de comunicação com ambiente externor... se nao tivesse, a porta seria bloqueada

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
global.db = mongoose.connect('mongodb://localhost:27017/neventos');

load('models').into(app);

var Evento = app.models.eventos;

//método do serviço
app.get('/', function (request, response) {
  response.send('Servidor no ar');
});

app.get('/eventos', function (request, response) { //função que faz a busca no BD e expoe em json
  Evento.find(function (erro, eventos) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(eventos);
    }
  });
});

app.get('/eventos/:id', function (request, response) {
  var id = request.params.id;
  console.log("id encontrado: " + id);
  Evento.findById(id, function (erro, evento) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(evento);
    }
  });
});

app.post('/eventos', function (request, response) { //se refere a um formuliario, mas nao necessariamente um html... qq um que forneca informações
  var descricao = request.body.descricao;
  var data = request.body.data.split('/');
  var responsavel = request.body.responsavel;

  //formato dd/MM/yyyy
  var objDate = new Date(data[2], data[1] - 1, data[0]);

  var evento = {
    'descricao': descricao,
    'data': objDate,
    'responsavel': responsavel
  };

  Evento.create(evento, function (erro, evento) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(evento);
    }
  });

});
app.put('/eventos', function (request, response) {
  var id = request.params.id;

  Evento.findById(id, function (erro, evento) {
    if (erro) {
      response.json(erro);
    }
    else {

      var evento_upd = evento;
      var data = request.body.data.split('/');
      var objDate = new Date(data[2], data[1] - 1, data[0]);

      evento_upd.descricao = request.body.descricao;
      evento_upd.data = objDate;
      evento_upd.responsavel = request.body.responsavel;

      evento_upd.save(function (erro, evento) {
        if (erro) {
          response.json(erro);
        }
        else {
          response.json(evento);
        }
      });
      response.json(evento);
    }
  });
  

});
app.delete('/eventos', function (request, response) {
  var id = request.params.id;

  Evento.remove(id, function (erro, evento) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.send('removido');
    }
  });
});



app.listen(3200, function () {
  console.log('ok');
});
