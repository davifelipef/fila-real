export function agruparPorPaciente(csv, pdf) {

    const mapa = new Map();

    // =========================
    // CSV (fila)
    // =========================
    for (const paciente of csv) {

        const nome = normalizar(paciente.nome_paciente);

        if (!mapa.has(nome)) {
            mapa.set(nome, {
                nome,
                solicitacoes: [],
                consultas: []
            });
        }

        mapa.get(nome).solicitacoes.push({
            data: paciente.data_solicitacao_medico,
            raw: paciente
        });
    }

    // =========================
    // PDF (consultas realizadas)
    // =========================
    for (const consulta of pdf) {

        const nome = normalizar(consulta.nome);

        if (!mapa.has(nome)) {
            mapa.set(nome, {
                nome,
                solicitacoes: [],
                consultas: []
            });
        }

        mapa.get(nome).consultas.push({
            data: consulta.dataConsulta,
            pagina: consulta.pagina,
            raw: consulta
        });
    }

    return Object.fromEntries(mapa);
}

function normalizar(nome) {
    return nome
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");
}