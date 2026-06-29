export function exportarXLSX(dados) {

    const worksheet = XLSX.utils.json_to_sheet(dados);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Fila Atualizada");

    const agora = new Date();

    const nomeArquivo =
        `fila_atualizada_${String(agora.getDate()).padStart(2, "0")}_` +
        `${String(agora.getMonth() + 1).padStart(2, "0")}_` +
        `${agora.getFullYear()}.xlsx`;

    XLSX.writeFile(workbook, nomeArquivo);
}