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
