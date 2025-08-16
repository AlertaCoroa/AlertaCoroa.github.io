// =================================================================
// COLE AQUI A URL DO SEU APP DA WEB (Google Apps Script)
// =================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyfUfp7OOdbZ7NnxRpxoEneozMLuvBPPeWblvoawVIblyYCma1AhdAl0ByK7FExS858/exec";
// =================================================================

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Carregando...';
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
}

// VERSÃO CORRIGIDA DA FUNÇÃO
function updateServiceCard(serviceName, data) {
    const cardElement = document.getElementById(serviceName);
    if (!cardElement || !data) return; // Se não achar o card ou não tiver dados, para aqui.

    const statusTextElement = cardElement.querySelector('.status-text');
    const detailsElement = cardElement.querySelector('.details');
    const previsaoElement = cardElement.querySelector('.previsao');

    cardElement.classList.remove('loading');
    cardElement.className = 'card'; // Limpa classes de cor antigas
    if (data.classe) {
        cardElement.classList.add(data.classe);
    }

    // VERIFICA SE O ELEMENTO EXISTE ANTES DE ATUALIZAR
    if (statusTextElement) {
        statusTextElement.textContent = data.status || 'Não informado';
    }

    // VERIFICA SE O ELEMENTO EXISTE ANTES DE ATUALIZAR
    if (detailsElement) {
        detailsElement.textContent = data.detalhes || '';
    }

    // VERIFICA SE O ELEMENTO EXISTE ANTES DE ATUALIZAR
    if (previsaoElement) {
        previsaoElement.textContent = data.previsao || '';
    }
}

// Busca os dados da nossa API na planilha
function fetchData() {
    const errorDisplay = document.querySelector('header p'); // Seleciona o parágrafo do cabeçalho
    fetch(SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na rede ou na API');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.servicos) {
                errorDisplay.textContent = "Status dos serviços da nossa comunidade"; // Restaura a mensagem original
                updateServiceCard('agua', data.servicos.agua);
                updateServiceCard('energia', data.servicos.energia);
                updateServiceCard('lixo', data.servicos.lixo);
                updateServiceCard('aviso', data.servicos.aviso);

                const lastUpdateElement = document.getElementById('last-update');
                // A data/hora agora fica na planilha, na linha da água
                lastUpdateElement.textContent = "Última atualização: " + formatTimestamp(data.servicos.agua.ultimaAtualizacao); 
            } else {
                throw new Error('Os dados recebidos não estão no formato esperado.');
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            errorDisplay.textContent = "Erro ao carregar dados. Tente recarregar a página."; // Mostra o erro
        });
}

// Carrega os dados quando a página abre e atualiza a cada 1 minuto
document.addEventListener('DOMContentLoaded', fetchData);
setInterval(fetchData, 60000); // Atualiza a cada 60 segundos