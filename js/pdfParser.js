import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";


pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


export async function extrairConsultasDoPdf(arquivo) {


    const arrayBuffer = await arquivo.arrayBuffer();


    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;


    console.log(
        "Quantidade de páginas:",
        pdf.numPages
    );


    const consultas = [];


    for (
        let paginaNumero = 1;
        paginaNumero <= pdf.numPages;
        paginaNumero++
    ) {


        const pagina = await pdf.getPage(paginaNumero);


        const conteudo = await pagina.getTextContent();


        const texto = conteudo.items
            .map(item => item.str)
            .join(" ");


        const dataMatch = texto.match(
            /Data:\s*(\d{2}\/\d{2}\/\d{4})/
        );


        if (!dataMatch) {
            continue;
        }


        const dataConsulta = dataMatch[1];


        const regexPaciente =
            /\d{2}:\d{2}\s+\d{2}:\d{2}\s+([A-ZÁÀÃÂÉÊÍÓÔÕÚÇ ]+?)\s+\d{2}\/\d{2}\/\d{4}/g;


        let resultado;


        while ((resultado = regexPaciente.exec(texto)) !== null) {


            consultas.push({

                nome: resultado[1]
                    .trim()
                    .replace(/\s+/g, " "),

                dataConsulta,
                pagina: paginaNumero

            });


        }


        console.log(
            `Página ${paginaNumero} processada`
        );

    }


    console.log(
        "Consultas encontradas:",
        consultas.length
    );


    return consultas;

}