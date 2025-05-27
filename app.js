const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const pathToDb = path.join(__dirname, 'banco', 'banco.db');

if (!fs.existsSync(pathToDb)) {
  console.error('❌ Banco de dados não encontrado em:', pathToDb);
} else {
  console.log('✅ Banco de dados localizado com sucesso em:', pathToDb);
}

const db = new sqlite3.Database(pathToDb, (err) => {
  if (err) {
    console.error('Erro ao abrir banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite!');
    db.get('SELECT name FROM sqlite_master WHERE type="table"', (err, row) => {
      if (err) {
        console.error('Erro na query:', err.message);
      } else {
        console.log('Tabela encontrada no banco:', row ? row.name : 'Nenhuma tabela');
      }
    });
  }
});

const authRoutes = require('./banco/routes/auth');
const questaoRoutes = require('./banco/routes/questoes');
const salaRoutes = require('./banco/routes/salas');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas específicas para outras páginas HTML
app.get('/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

app.get('/forgot-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/questoes', questaoRoutes);
app.use('/api/salas', salaRoutes);

// Usar porta definida pelo Render ou padrão 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
