document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os inputs de radio que possuem o nome "estadoCivil" e adiciona um evento de mudança para cada um
    document.querySelectorAll('input[name="estadoCivil"]').forEach((input) => {
        input.addEventListener('change', function() {
            // Seleciona os elementos que contêm os detalhes adicionais para "Casado" e "União Estável"
            const casadoDetails = document.getElementById('casado-details');
            const uniaoEstavelDetails = document.getElementById('uniaoEstavel-details');

            // Mostra ou oculta os campos adicionais com base na seleção do estado civil
            if (this.value === 'Casado') {
                casadoDetails.classList.remove('hidden');
                uniaoEstavelDetails.classList.add('hidden');
            } else if (this.value === 'União Estável') {
                casadoDetails.classList.add('hidden');
                uniaoEstavelDetails.classList.remove('hidden');
            } else {
                casadoDetails.classList.add('hidden');
                uniaoEstavelDetails.classList.add('hidden');
            }
        });
    });
});

 // Adiciona o evento de mudança para a nova pergunta "Possui filhos?"
 document.querySelectorAll('input[name="possuiFilhos"]').forEach((input) => {
    input.addEventListener('change', function() {
        const filhosDetails = document.getElementById('filhos-details');
        if (this.value === 'Sim') {
            filhosDetails.classList.remove('hidden');
        } else {
            filhosDetails.classList.add('hidden');
        }
    });
});


// Função para buscar o CEP e preencher os campos de endereço
function buscarCEP() {
    const cep = document.getElementById('cep').value;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('endereco').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                alert('CEP não encontrado!');
            }
        })
        .catch(error => console.error('Erro ao buscar o CEP:', error));
}

// Função para lidar com o envio do formulário
function submitForm() {
    // Seleciona o formulário pelo seu ID
    const form = document.getElementById('formulario-advogado');
    // Cria um novo FormData com os dados do formulário
    const formData = new FormData(form);
    // Objeto para armazenar os dados do formulário
    const data = {};

    // Preenche o objeto data com as entradas do formulário
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Função para exportar os dados para um arquivo Excel
    exportToExcel(data);

    // Função para exportar os dados para um arquivo PDF
    exportToPDF(data);
}

// Função para exportar dados para um arquivo Excel
function exportToExcel(data) {
    // Converte os dados JSON para uma planilha
    const ws = XLSX.utils.json_to_sheet([data]);
    // Cria um novo workbook (livro de trabalho)
    const wb = XLSX.utils.book_new();
    // Adiciona a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Formulário');
    // Salva o arquivo Excel
    XLSX.writeFile(wb, 'formulario_advogado.xlsx');
}

// Função para exportar dados para um arquivo PDF
function exportToPDF(data) {
    // Obtém o objeto jsPDF do namespace global
    const { jsPDF } = window.jspdf;
    // Cria uma nova instância do jsPDF
    const doc = new jsPDF();

    // Posição inicial no PDF
    let yPosition = 10;
    // Altura da linha no PDF (em milímetros)
    const lineHeight = 10; 
    // Largura máxima da linha no PDF (em milímetros)
    const maxLineWidth = 180; 

    // Itera sobre cada chave-valor no objeto data
    Object.keys(data).forEach((key) => {
        // Cria uma string com o nome do campo e o valor
        let text = `${key}: ${data[key]}`;
        // Verifica se a largura do texto excede a largura máxima permitida
        if (doc.getTextWidth(text) > maxLineWidth) {
            // Se o texto for muito longo, divide-o em várias linhas
            const splitText = doc.splitTextToSize(text, maxLineWidth);
            // Adiciona cada linha ao PDF
            splitText.forEach(line => {
                doc.text(line, 10, yPosition); // Adiciona o texto na posição atual
                yPosition += lineHeight; // Move a posição Y para a próxima linha
            });
        } else {
            // Se o texto não for muito longo, adiciona-o como uma única linha
            doc.text(text, 10, yPosition); // Adiciona o texto na posição atual
            yPosition += lineHeight; // Move a posição Y para a próxima linha
        }
    });

    // Salva o arquivo PDF com o nome 'formulario_advogado.pdf'
    doc.save('formulario_advogado.pdf');
}

