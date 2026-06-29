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


    dadosCsv =
        await extrairDadosCsv(
            evento.target.files[0]
        );


    console.log(
        "CSV carregado:",
        dadosCsv.length
    );


});



document
.getElementById("pdf-enviado")
.addEventListener(
"change",
async evento => {


    dadosPdf =
        await extrairConsultasDoPdf(
            evento.target.files[0]
        );


    console.log(
        "PDF carregado:",
        dadosPdf.length
    );


    if (dadosCsv.length > 0) {


        /*const resultado =
            cruzarConsultas(
                dadosCsv,
                dadosPdf
            );


        console.log(
            "Resultado:"
        );


        console.table(
            //resultado.slice(0,10)
            resultado[0]
        );*/

        const resultado = cruzarConsultas(dadosCsv, dadosPdf);

        // filtra apenas quem teve consulta efetivamente encontrada
        const validos = resultado.filter(r =>
            r.consulta_realizada && r.consulta_realizada !== ""
        );

        console.log("=== PACIENTES COM CONSULTA ENCONTRADA ===");

        validos.forEach(p => {

            console.log({
                nome: p.nome_paciente,
                entrada_fila: p.data_solicitacao_medico,
                consulta_realizada: p.consulta_realizada
            });

        });

        const btn = document.getElementById("btn-download");

        btn.disabled = false;

        btn.onclick = () => {
            exportarXLSX(resultado);
        };

        const resumo = resultado.reduce((acc, r) => {

            acc.total++;

            if (r.consulta_realizada && r.consulta_realizada.trim() !== "") {
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

        console.log("=== RESUMO ===", resumo);


    }


});