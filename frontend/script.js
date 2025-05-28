const form = document.getElementById("form");
const erro = document.getElementById("erro");
const ap3Container = document.getElementById("ap3-container");

const campos = ["ad1", "ap1", "ad2", "ap2", "ap3"];

form.oninput = async function () {
    erro.textContent = "";

    const data = {};
    for (const nome of campos) {
        const val = form.elements[nome].value;
        data[nome] = val === "" ? null : parseFloat(val);
    }

    const filledAD1AP1 = data.ad1 !== null && data.ap1 !== null;
    const filledAD2AP2 = data.ad2 !== null && data.ap2 !== null;

    try {
        const res = await fetch("/avaliar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!res.ok) {
            erro.textContent = json.detail || "Erro de validação.";
            return;
        }

        document.getElementById("n2-necessaria").textContent =
            filledAD1AP1 && !filledAD2AP2 ? json.nota_necessaria_n2.toFixed(2) :
                filledAD1AP1 && filledAD2AP2 ? "0.00" : "-";

        document.getElementById("ap3-necessaria").textContent =
            filledAD1AP1 && filledAD2AP2 && json.nf < 6 && data.ap3 === null ? json.nota_necessaria_ap3.toFixed(2) : (json.nf < 6 &&
                data.ap3 !== null) ? "0.00" : "-"; document.getElementById("nf").textContent = json.nf !== null ? json.nf.toFixed(2)
                    : "-"; document.getElementById("status").textContent = json.aprovado === true ? "Aprovado" : "Reprovado";
        ap3Container.style.display = filledAD1AP1 && filledAD2AP2 && json.nf < 6 ? "block" : "none";
    } catch (e) {
        erro.textContent = "Erro de rede ou servidor indisponível.";
    }
};
