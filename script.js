document.addEventListener('DOMContentLoaded', function () {
  // Carregar o arquivo JSON com as opções
  fetch('dados.json')  // Assumindo que o arquivo JSON está no mesmo diretório
    .then(response => response.json())
    .then(data => {
      // Gerar as linhas da tabela com base nos dados do JSON
      const tabelaBody = document.querySelector("#tabela-analises tbody");

      data.analises.forEach((analise) => {
        const row = document.createElement("tr");

        // Adicionar o tipo de análise
        const tipoCell = document.createElement("td");
        tipoCell.textContent = analise.tipo;
        row.appendChild(tipoCell);

        // Adicionar o nome da análise
        const nomeCell = document.createElement("td");
        nomeCell.textContent = analise.nome;
        row.appendChild(nomeCell);

        // Adicionar os selects (QUESTIONADO e FUNDAMENTAÇÃO)
        const questionadoCell = document.createElement("td");
        const questionadoSelect = criarSelect(analise.opcoes);
        questionadoCell.appendChild(questionadoSelect);
        row.appendChild(questionadoCell);

        const fundamentacaoCell = document.createElement("td");
        const fundamentacaoSelect = criarSelect(analise.opcoes);
        fundamentacaoCell.appendChild(fundamentacaoSelect);
        row.appendChild(fundamentacaoCell);

        // Célula de CONVERGÊNCIA (será atualizada posteriormente)
        const convergenciaCell = document.createElement("td");
        convergenciaCell.classList.add("convergencia");
        row.appendChild(convergenciaCell);

        // Célula de DIVERGÊNCIA (será atualizada posteriormente)
        const divergenciaCell = document.createElement("td");
        row.appendChild(divergenciaCell);

        tabelaBody.appendChild(row);
      });

      // Adicionar o evento de clique no botão Calcular
      document.getElementById('calcular-btn').addEventListener('click', atualizaValores);
    })
    .catch(error => console.error("Erro ao carregar o arquivo JSON:", error));
});

// Função para criar o select a partir das opções
function criarSelect(opcoes) {
  const select = document.createElement("select");
  opcoes.forEach(opcao => {
    const option = document.createElement("option");
    option.value = opcao;
    option.textContent = opcao;
    select.appendChild(option);
  });
  return select;
}

// Função para atualizar convergência e divergência
function atualizaValores() {
  let somaConvergencia = 0;
  let somaDivergencia = 0;

  const rows = document.querySelectorAll("table tbody tr");

  rows.forEach(row => {
    const questionadoSelect = row.querySelector("td:nth-child(3) select");
    const fundamentacaoSelect = row.querySelector("td:nth-child(4) select");

    // Verifica se ambos os selects existem e tem valor
    if (questionadoSelect && fundamentacaoSelect) {
      const questionado = questionadoSelect.value;
      const fundamentacao = fundamentacaoSelect.value;

      const convergenciaCell = row.querySelector(".convergencia");
      const divergenciaCell = row.querySelector("td:nth-child(6)");  // Coluna DIVERGÊNCIA

      // Garantir que os valores não sejam vazios ou indefinidos
      if (questionado && fundamentacao) {
        // Atualizar a convergência
        const convergencia = (questionado === fundamentacao) ? "1" : "0";
        convergenciaCell.textContent = convergencia;
        somaConvergencia += (convergencia === "1") ? 1 : 0;

        // Atualizar a divergência
        const divergencia = (questionado !== fundamentacao) ? "1" : "0";
        divergenciaCell.textContent = divergencia;
        somaDivergencia += (divergencia === "1") ? 1 : 0;
      } else {
        convergenciaCell.textContent = "";
        divergenciaCell.textContent = "";
      }
    }
  });

  // Atualizar os resultados no HTML
  document.getElementById("resultado-convergencia").textContent = somaConvergencia;
  document.getElementById("resultado-divergencia").textContent = somaDivergencia;

  // Calcular e exibir a quantidade e percentual de convergência
  const quantidadeConvergencia = somaConvergencia;
  const quantidadeDivergencia = somaDivergencia
  const quantidadeTotal = rows.length;
  const percentualConvergencia = (quantidadeTotal > 0) ? ((quantidadeConvergencia * 100) / (quantidadeConvergencia + quantidadeDivergencia)).toFixed(2) : 0;
  const percentualDivergencia = (quantidadeTotal > 0) ? ((quantidadeDivergencia * 100) / (quantidadeConvergencia + quantidadeDivergencia)).toFixed(2) : 0;
 
  let resultadoFinal = ""
  
  if(quantidadeConvergencia > quantidadeDivergencia){
    resultadoFinal = "CONVERGÊNTE"
  }else if(quantidadeConvergencia < quantidadeDivergencia){
    resultadoFinal = "DIVERGENTE"
  }else{
    resultadoFinal = "INCONCLUSIVO"
  }

  document.getElementById("percentual-convergencia").textContent = `${percentualConvergencia}%`;
  document.getElementById("percentual-divergencia").textContent = `${percentualDivergencia}%`;
  document.getElementById("resultado-final").textContent = `${resultadoFinal}`;
}
