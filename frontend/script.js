// Obtém os elementos HTML necessários
const form = document.getElementById("form");
const erro = document.getElementById("erro");
const ap3Container = document.getElementById("ap3-container");
const ad2Ap2Container = document.getElementById("ad2-ap2-container");
const limparBtn = document.getElementById("limpar");
const ap2Placeholder = document.getElementById("ap2");
const ap2Container = document.getElementById("ap2-necessaria-container");
const n1Item = document.getElementById("n1-item");
const n2Item = document.getElementById("n2-item");
const mediaItem = document.getElementById("media-item");
const n2NecessariaItem = document.getElementById("n2-necessaria-item");
const ap3NecessariaItem = document.getElementById("ap3-necessaria-item");

// Lista dos campos usados no formulário
const campos = ["ad1", "ap1", "ad2", "ap2", "ap3"];

// Função chamada sempre que o formulário é modificado
const handler = async function () {
    erro.classList.add("d-none");  // Esconde o erro inicialmente
    erro.textContent = "";  // Limpa o texto de erro

    // Monta o objeto de dados a partir dos campos do formulário
    const data = {};
    for (const nome of campos) {
        const val = form.elements[nome].value;
        data[nome] = val === "" ? null : parseFloat(val);
    }

    // Verifiva se os campos estão preenchidos
    const filledAD1AP1 = data.ad1 !== null && data.ap1 !== null;
    const filledAD2AP2 = data.ad2 !== null && data.ap2 !== null;

    // Exibe os campos AD2 e AP2 somente se AD1 e AP1 estiverem preenchidos
    ad2Ap2Container.style.display = filledAD1AP1 ? "block" : "none";

    try {
        // Envia os dados para o backend
        const res = await fetch("/avaliar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        // Se houve erro na resposta, exibe a mensagem de erro
        if (!res.ok) {
            erro.textContent = json.detail || "Erro de validação.";
            erro.classList.remove("d-none");
            return;
        }

        const n2Text =
            filledAD1AP1 && !filledAD2AP2 ? `Você precisa de ${json.nota_necessaria_n2.toFixed(2)}` :
                "Veja abaixo a nota necessária";
        const ap3Text =
            filledAD1AP1 && filledAD2AP2 && json.nf < 6 && data.ap3 === null
                ? `Você precisa de ${json.nota_necessaria_ap3.toFixed(2)}`
                : "Veja abaixo a nota necessária";

        form.elements["ad2"].placeholder = n2Text;
        form.elements["ap2"].placeholder = n2Text;
        form.elements["ap3"].placeholder = ap3Text;

        // N2 necessária
        if (filledAD1AP1 && !filledAD2AP2) {
            document.getElementById("n2-necessaria").textContent = json.nota_necessaria_n2.toFixed(2);
            n2NecessariaItem.style.display = "list-item";
        } else {
            n2NecessariaItem.style.display = "none";
        }

        // AP2 necessária
        const showAp2Hint = filledAD1AP1 && data.ad2 !== null && data.ap2 === null;
        if (showAp2Hint) {
            const notaAp2 = json.nota_necessaria_ap2.toFixed(2);
            ap2Container.style.display = "list-item";
            document.getElementById("ap2-necessaria").textContent = notaAp2;
            form.elements["ap2"].placeholder = `Você precisa de ${notaAp2}`;
        } else {
            ap2Container.style.display = "none";
        }

        // AP3 necessária
        if (filledAD1AP1 && filledAD2AP2 && json.nf < 6 && data.ap3 === null) {
            document.getElementById("ap3-necessaria").textContent = json.nota_necessaria_ap3.toFixed(2);
            ap3NecessariaItem.style.display = "list-item";
        } else {
            ap3NecessariaItem.style.display = "none";
        }

        // Exibe a nota final
        document.getElementById("nf").textContent = json.nf !== null ? json.nf.toFixed(2) : "-";

        // Atualiza o status de aprovação e adiciona animação
        const statusElem = document.getElementById("status");
        const classeCor = json.aprovado === true ? "text-success" : "text-danger";
        statusElem.textContent = json.aprovado === true ? "Aprovado" : "Reprovado";
        statusElem.classList.remove("text-success", "text-danger", "status-pulse");
        statusElem.classList.add(classeCor, "status-pulse");
        setTimeout(() => statusElem.classList.remove("status-pulse"), 600);

        // Exibe o container de AP3 se necessário
        ap3Container.style.display =
            filledAD1AP1 && filledAD2AP2 && json.nf < 6 ? "block" : "none";

        if (filledAD1AP1) {
            document.getElementById("n1").textContent = json.n1.toFixed(2);
            n1Item.style.display = "list-item";
        } else {
            document.getElementById("n1").textContent = "-";
            n1Item.style.display = "none";
        }

        if (filledAD2AP2) {
            document.getElementById("n2").textContent = json.n2.toFixed(2);
            document.getElementById("media").textContent = json.n.toFixed(2);
            n2Item.style.display = "list-item";
            mediaItem.style.display = "list-item";
        } else {
            document.getElementById("n2").textContent = "-";
            document.getElementById("media").textContent = "-";
            n2Item.style.display = "none";
            mediaItem.style.display = "none";
        }

    } catch (e) {
        erro.textContent = "Erro de rede ou servidor indisponível.";
        erro.classList.remove("d-none");
    }
};

// Define o manipulador de eventos para o formulário
form.oninput = handler;

// Função de limpeza do formulário
limparBtn.onclick = function () {
    form.oninput = null;  // Remove o manipulador de eventos para evitar chamadas desnecessárias
    form.reset();  // Reseta o formulário

    // Limpa os valores dos campos específicos
    campos.forEach((nome) => {
        if (form.elements[nome]) {
            form.elements[nome].value = "";
        }
    });

    // Reseta os textos dos elementos de resultado
    document.getElementById("n2-necessaria").textContent = "-";
    document.getElementById("ap3-necessaria").textContent = "-";
    document.getElementById("nf").textContent = "-";
    document.getElementById("status").textContent = "-";
    document.getElementById("ap2-necessaria").textContent = "-";
    document.getElementById("n1").textContent = "-";
    document.getElementById("n2").textContent = "-";
    document.getElementById("media").textContent = "-";

    n1Item.style.display = "none";
    n2Item.style.display = "none";
    mediaItem.style.display = "none";
    n2NecessariaItem.style.display = "none";
    ap3NecessariaItem.style.display = "none";

    erro.textContent = "";
    erro.classList.add("d-none");
    ap3Container.style.display = "none";
    ad2Ap2Container.style.display = "none";
    ap2Container.style.display = "none";

    form.elements["ad2"].placeholder = "Veja abaixo a nota necessária";
    form.elements["ap2"].placeholder = "Veja abaixo a nota necessária";
    form.elements["ap3"].placeholder = "Veja abaixo a nota necessária";
    ap2Placeholder.placeholder = "Veja abaixo a nota necessária";

    // Reativa o manipulador de eventos após limpar
    const reativar = () => {
        form.oninput = handler;
        form.removeEventListener("input", reativar);
    };
    form.addEventListener("input", reativar);
};
