const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "data.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar com o banco de dados:", err);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

function initializeDatabase() {
    const setupScript = `
        CREATE TABLE IF NOT EXISTS entradas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            funcionario TEXT NOT NULL,
            contato TEXT NOT NULL,
            departamento TEXT NOT NULL,
            equipamento TEXT NOT NULL,
            tecnicoEntrada TEXT NOT NULL,
            dataEntrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS solucoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entrada_id INTEGER,
            solucao TEXT NOT NULL,
            tecnicoSolucao TEXT NOT NULL,
            dataSolucao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            contato TEXT NOT NULL,
            departamento TEXT NOT NULL,
            equipamento TEXT NOT NULL,
            FOREIGN KEY (entrada_id) REFERENCES entradas(id)
        );

        CREATE TABLE IF NOT EXISTS excluidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            funcionario TEXT NOT NULL,
            contato TEXT NOT NULL,
            departamento TEXT NOT NULL,
            equipamento TEXT NOT NULL,
            tecnicoEntrada TEXT NOT NULL,
            dataEntrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT NOT NULL DEFAULT 'solucionado'
        );
    `;

    db.exec(setupScript, (err) => {
        if (err) {
            console.error("Erro ao inicializar o banco de dados:", err);
        } else {
            console.log("Banco de dados inicializado com sucesso.");
        }
    });
}

module.exports = {
    db,
    initializeDatabase,
};
