import { extrairConsultasDoPdf } from "./pdfParser.js";
import { extrairDadosCsv } from "./csvParser.js";
import { cruzarConsultas } from "./matcher.js";
import { exportarXLSX } from "./exporter.js";

let dadosCsv = [];
let dadosPdf = [];

document
    .getElementById("planilha-enviada")
    .addEventListener(
        "change",
        async evento => {

            try {

                const arquivo = evento.target.files[0];

                if (!arquivo) {
                    return;
                }

                dadosCsv = await extrairDadosCsv(arquivo);

                console.log(
                    "CSV carregado:",
                    dadosCsv.length
                );

            } catch (erro) {

                console.error("Erro ao processar o CSV:", erro);

                alert(
                    "Não foi possível processar o arquivo CSV.\n\n" +
                    "Verifique se ele está no formato esperado."
                );

            }

        }
    );

document
    .getElementById("pdf-enviado")
    .addEventListener(
        "change",
        async evento => {

            try {

                const arquivo = evento.target.files[0];

                if (!arquivo) {
                    return;
                }

                dadosPdf = await extrairConsultasDoPdf(arquivo);

                console.log(
                    "PDF carregado:",
                    dadosPdf.length
                );

                if (dadosCsv.length === 0) {
                    alert("Carregue primeiro a planilha CSV.");
                    return;
                }

                const resultado = cruzarConsultas(
                    dadosCsv,
                    dadosPdf
                );

                // filtra apenas quem teve consulta encontrada
                const validos = resultado.filter(r =>
                    r.consulta_realizada &&
                    r.consulta_realizada !== ""
                );

                console.log(
                    "=== PACIENTES COM CONSULTA ENCONTRADA ==="
                );

                validos.forEach(p => {

                    console.log({
                        nome: p.nome_paciente,
                        entrada_fila: p.data_solicitacao_medico,
                        consulta_realizada: p.consulta_realizada
                    });

                });

                const btn =
                    document.getElementById("btn-download");

                btn.disabled = false;

                btn.onclick = () => {
                    exportarXLSX(resultado);
                };

                const resumo = resultado.reduce((acc, r) => {

                    acc.total++;

                    if (
                        r.consulta_realizada &&
                        r.consulta_realizada.trim() !== ""
                    ) {
                        acc.comConsulta++;
                    } else {
                        acc.semConsulta++;
                    }

                    return acc;

                }, {
                    total: 0,
                    comConsulta: 0,
                    semConsulta: 0
                });

                console.log(
                    "=== RESUMO ===",
                    resumo
                );

            } catch (erro) {

                console.error("Erro durante o processamento:", erro);

                document
                    .getElementById("btn-download")
                    .disabled = true;

                alert(
                    "Ocorreu um erro durante o processamento.\n\n" +
                    "Abra o Console (F12) e envie a mensagem de erro."
                );

            }

        }
    );