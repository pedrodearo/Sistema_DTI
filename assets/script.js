let isSolutionMode = false;
const inputContainer = document.getElementById("inputContainer");
const solucaoButton = document.getElementById("solucaoButton");
const cadastrarButton = document.getElementById("cadastrarButton");
const concluidasButton = document.getElementById("concluidasButton");

const originalInputs = inputContainer.innerHTML;
let isConcluidasMode = false;
const tableDatabase = document.querySelector(".table_database");
const tableSolucoes = document.querySelector(".table_solucoes");

function toggleMode() {
    const title = document.querySelector(".right_title");
    const button = solucaoButton.querySelector("button");

    if (isSolutionMode) {
        title.textContent = "ENTRADA";
        button.textContent = "SOLUÇÃO";
        inputContainer.innerHTML = originalInputs;
    } else {
        title.textContent = "SOLUÇÃO";
        button.textContent = "ENTRADA";
        inputContainer.innerHTML = `
            <div class="box_info">
                <input type="text" required="" value="" id="idInput" autocomplete="off" />
                <label for="idInput">ID</label>
            </div>
            <div class="box_info">
                <input type="text" required="" value="" id="solucaoInput" autocomplete="off"/>
                <label for="solucaoInput">SOLUÇÃO</label>
            </div>
            <div class="box_info">
                <input type="text" required="" value="" id="tecnicoResponsavelSolucao" autocomplete="off"/>
                <label for="tecnicoResponsavelSolucao">TÉCNICO RESPONSÁVEL</label>
            </div>
        `;
    }
    isSolutionMode = !isSolutionMode;
}

function toggleConcluidas() {
    const title = document.querySelector(".left_title");
    const button = concluidasButton;

    if (!isConcluidasMode) {
        title.textContent = "CONCLUÍDAS";
        button.textContent = "PENDENTES";
        tableDatabase.style.display = "none";
        tableSolucoes.style.display = "block";
        fetchSolutions();
    } else {
        title.textContent = "PENDENTES";
        button.textContent = "CONCLUÍDAS";
        tableDatabase.style.display = "block";
        tableSolucoes.style.display = "none";
        fetchEntries();
    }

    isConcluidasMode = !isConcluidasMode;
}

async function registerData() {
    let response;

    if (isSolutionMode) {
        const id = document.getElementById("idInput").value;
        const solucao = document.getElementById("solucaoInput").value;
        const tecnicoSolucao = document.getElementById(
            "tecnicoResponsavelSolucao"
        ).value;

        if (!id || !solucao || !tecnicoSolucao) {
            alert(
                "Todos os campos devem ser preenchidos para cadastrar a solução."
            );
            return;
        }

        response = await fetch("http://localhost:3000/api/solucao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                entrada_id: id,
                solucao: solucao,
                tecnicoSolucao: tecnicoSolucao,
            }),
        });
    } else {
        const funcionario = document.getElementById("codigoFuncionario").value;
        const contato = document.getElementById("numeroContato").value;
        const departamento = document.getElementById("departamento").value;
        const equipamentos = document.getElementById("equipamentoInput").value;
        const tecnicoEntrada = document.getElementById(
            "tecnicoResponsavelEntrada"
        ).value;

        if (
            !funcionario ||
            !contato ||
            !departamento ||
            !equipamentos ||
            !tecnicoEntrada
        ) {
            alert(
                "Todos os campos devem ser preenchidos para cadastrar a entrada."
            );
            return;
        }

        response = await fetch("http://localhost:3000/api/entrada", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                funcionario: funcionario,
                contato: contato,
                departamento: departamento,
                equipamento: equipamentos,
                tecnicoEntrada: tecnicoEntrada,
            }),
        });
    }

    if (response.ok) {
        alert(`Cadastro realizado com sucesso!`);
        fetchEntries();
    } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar: ${errorData.error}`);
    }
}

async function fetchEntries() {
    try {
        const response = await fetch("http://localhost:3000/api/entrada");
        if (!response.ok) {
            throw new Error(`Erro ao buscar entradas: ${response.statusText}`);
        }
        const entries = await response.json();

        tableDatabase.innerHTML = "";

        entries.forEach((entry) => {
            const div = document.createElement("div");
            div.innerHTML = ` 
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">FUNCIONÁRIO</th>
                            <th scope="col">Nº DE CONTATO</th>
                            <th scope="col">DEPARTAMENTO</th>
                            <th scope="col">EQUIPAMENTO</th>
                            <th scope="col">TÉC. RESPONSÁVEL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${entry.id}</td>
                            <td>${entry.funcionario}</td>
                            <td>${entry.contato}</td>
                            <td>${entry.departamento}</td>
                            <td>${entry.equipamento}</td>
                            <td>${entry.tecnicoEntrada}</td>
                        </tr>
                    </tbody>
                </table>
            `;
            tableDatabase.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao buscar entradas:", error);
    }
}

async function fetchSolutions() {
    try {
        const response = await fetch("http://localhost:3000/api/solucao");
        if (!response.ok) {
            throw new Error(`Erro ao buscar soluções: ${response.statusText}`);
        }
        const solutions = await response.json();

        tableSolucoes.innerHTML = "";

        solutions.forEach((solution) => {
            const div = document.createElement("div");
            div.innerHTML = ` 
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">CONTATO</th>
                            <th scope="col">DEPARTAMENTO</th>
                            <th scope="col">EQUIPAMENTO</th>
                            <th scope="col">SOLUÇÃO</th>
                            <th scope="col">TÉC. RESPONSÁVEL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${solution.entrada_id}</td>
                            <td>${solution.contato}</td>
                            <td>${solution.departamento}</td>
                            <td>${solution.equipamento}</td>
                            <td>${solution.solucao}</td>
                            <td>${solution.tecnicoSolucao}</td>
                        </tr>
                    </tbody>
                </table>
            `;
            tableSolucoes.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao buscar soluções:", error);
    }
}

fetchEntries();

solucaoButton.addEventListener("click", toggleMode);
cadastrarButton.addEventListener("click", registerData);
concluidasButton.addEventListener("click", toggleConcluidas);
