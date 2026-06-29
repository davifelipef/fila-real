import { agruparPorPaciente } from "./groupByPaciente.js";

export function cruzarConsultas(csv, pdf) {

    const dados = agruparPorPaciente(csv, pdf);

    const resultado = [];

    for (const nome in dados) {

        const paciente = dados[nome];

        const solicitacoes = ordenarPorData(paciente.solicitacoes);
        const consultas = ordenarPorData(paciente.consultas);

        const consultasDisponiveis = [...consultas];

        for (const sol of solicitacoes) {

            const consulta = consultasDisponiveis.shift() || null;

            resultado.push({
                ...sol.raw,

                // mantém regra original
                entrada_fila: sol.data,

                // resultado do matching
                consulta_realizada: consulta ? consulta.data : "",

                // debug importante
                pagina_pdf: consulta ? consulta.pagina : ""
            });
        }
    }

    return resultado;
}

function ordenarPorData(lista) {

    return [...lista].sort((a, b) => {

        // fallback seguro caso venha string vazia
        const da = a.data ? new Date(a.data) : new Date(0);
        const db = b.data ? new Date(b.data) : new Date(0);

        return da - db;
    });
}