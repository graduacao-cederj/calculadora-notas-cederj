// Obtém os elementos HTML necessários
const form = document.getElementById("form"); // Formulário principal
const erro = document.getElementById("erro"); // Área de exibição de erros
const ap3Container = document.getElementById("ap3-container"); // Container da nota AP3
const limparBtn = document.getElementById("limpar"); // Botão de limpar

// Lista de campos que o formulário usa
const campos = ["ad1", "ap1", "ad2", "ap2", "ap3"];

// Função principal chamada a cada alteração no formulário
const handler = async function () {
    erro.textContent = ""; // Limpa mensagens de erro anteriores

    // Monta o objeto "data" com os valores dos campos
    const data = {};
    for (const nome of campos) {
        const val = form.elements[nome].value;
        data[nome] = val === "" ? null : parseFloat(val); // Converte string para número ou null
    }

    // Verifica se os pares AD1+AP1 e AD2+AP2 estão preenchidos
    const filledAD1AP1 = data.ad1 !== null && data.ap1 !== null;
    const filledAD2AP2 = data.ad2 !== null && data.ap2 !== null;

    try {
        // Envia os dados para o backend
        const res = await fetch("/avaliar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json(); // Converte a resposta para JSON

        // Se houve erro de validação, exibe a mensagem
        if (!res.ok) {
            erro.textContent = json.detail || "Erro de validação.";
            return;
        }

        // Exibe nota necessária em N2, se aplicável
        document.getElementById("n2-necessaria").textContent =
            filledAD1AP1 && !filledAD2AP2 ? json.nota_necessaria_n2.toFixed(2) :
                filledAD1AP1 && filledAD2AP2 ? "0.00" : "-";

        // Exibe nota necessária em AP3, se aplicável
        document.getElementById("ap3-necessaria").textContent =
            filledAD1AP1 && filledAD2AP2 && json.nf < 6 && data.ap3 === null
                ? json.nota_necessaria_ap3.toFixed(2)
                : (json.nf < 6 && data.ap3 !== null) ? "0.00" : "-";

        // Exibe nota final calculada
        document.getElementById("nf").textContent = json.nf !== null ? json.nf.toFixed(2) : "-";

        // Exibe o status do aluno
        document.getElementById("status").textContent =
            json.aprovado === true ? "Aprovado" : "Reprovado";

        // Mostra o campo AP3 se necessário
        ap3Container.style.display =
            filledAD1AP1 && filledAD2AP2 && json.nf < 6 ? "block" : "none";

    } catch (e) {
        erro.textContent = "Erro de rede ou servidor indisponível."; // Falha na requisição
    }
};

// Define o handler como função a ser chamada quando algo é digitado
form.oninput = handler;

// Lógica para o botão "Limpar"
limparBtn.onclick = function () {
    form.oninput = null; // Desativa temporariamente o handler
    form.reset(); // Reseta todos os campos

    // Garante que os valores fiquem visivelmente limpos
    campos.forEach((nome) => {
        if (form.elements[nome]) {
            form.elements[nome].value = "";
        }
    });

    // Limpa todos os elementos de saída
    document.getElementById("n2-necessaria").textContent = "-";
    document.getElementById("ap3-necessaria").textContent = "-";
    document.getElementById("nf").textContent = "-";
    document.getElementById("status").textContent = "-";
    erro.textContent = "";
    ap3Container.style.display = "none";

    // Reativa o handler após a próxima digitação real do usuário
    const reativar = () => {
        form.oninput = handler;
        form.removeEventListener("input", reativar);
    };
    form.addEventListener("input", reativar);
};
