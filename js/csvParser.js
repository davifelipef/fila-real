export function extrairDadosCsv(arquivo) {


    return new Promise((resolve, reject) => {


        Papa.parse(arquivo, {

            header: true,

            skipEmptyLines: true,

            complete(resultado) {


                console.log(
                    "CSV processado"
                );


                console.log(
                    "Quantidade de linhas:",
                    resultado.data.length
                );


                resolve(resultado.data);

            },


            error(erro) {

                reject(erro);

            }

        });


    });


}