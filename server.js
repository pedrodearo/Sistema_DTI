const express = require("express");
const cors = require("cors");
const { db, initializeDatabase } = require("./database/database.js");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

initializeDatabase();

app.get("/api/entrada", (req, res) => {
    db.all(`SELECT * FROM entradas`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post("/api/entrada", (req, res) => {
    const { funcionario, contato, departamento, equipamento, tecnicoEntrada } =
        req.body;
    db.run(
        `INSERT INTO entradas (funcionario, contato, departamento, equipamento, tecnicoEntrada)
         VALUES (?, ?, ?, ?, ?)`,
        [funcionario, contato, departamento, equipamento, tecnicoEntrada],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.post("/api/solucao", (req, res) => {
    const { entrada_id, solucao, tecnicoSolucao } = req.body;

    if (!entrada_id || !solucao || !tecnicoSolucao) {
        return res
            .status(400)
            .json({ error: "Campos obrigatórios não preenchidos" });
    }

    db.get(`SELECT * FROM entradas WHERE id = ?`, entrada_id, (err, entry) => {
        if (err || !entry) {
            return res.status(404).json({ error: "Entrada não encontrada" });
        }

        db.run(
            `INSERT INTO solucoes (entrada_id, solucao, tecnicoSolucao, contato, departamento, equipamento)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                entrada_id,
                solucao,
                tecnicoSolucao,
                entry.contato,
                entry.departamento,
                entry.equipamento,
            ],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.run(
                    `INSERT INTO excluidos (funcionario, contato, departamento, equipamento, tecnicoEntrada)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        entry.funcionario,
                        entry.contato,
                        entry.departamento,
                        entry.equipamento,
                        entry.tecnicoEntrada,
                    ],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        db.run(
                            `DELETE FROM entradas WHERE id = ?`,
                            entrada_id,
                            function (err) {
                                if (err) {
                                    return res
                                        .status(500)
                                        .json({ error: err.message });
                                }
                                res.status(201).json({
                                    message:
                                        "Solução cadastrada e entrada movida para excluídos com sucesso!",
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

app.get("/api/solucao", (req, res) => {
    db.all(`SELECT * FROM solucoes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get("/api/excluidos", (req, res) => {
    db.all(`SELECT * FROM excluidos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
