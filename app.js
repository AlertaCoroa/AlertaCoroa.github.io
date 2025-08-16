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

function updateServiceCard(serviceName, data) {
    const cardElement = document.getElementById(serviceName);
    if (!cardElement || !data) return;

    const statusTextElement = cardElement.querySelector('.status-text');
    const detailsElement = cardElement.querySelector('.details');
    const previsaoElement = cardElement.querySelector('.previsao');

    cardElement.classList.remove('loading');
    statusTextElement.textContent = data.status || 'Não informado';
    cardElement.className = 'card'; // Limpa classes antigas
    if (data.classe) {
        cardElement.classList.add(data.classe);
    }

    detailsElement.textContent = data.detalhes || '';
    if (previsaoElement) {
        previsaoElement.textContent = data.previsao || '';
    }
}

// Busca os dados da nossa API na planilha
function fetchData() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data && data.servicos) {
                updateServiceCard('agua', data.servicos.agua);
                updateServiceCard('energia', data.servicos.energia);
                updateServiceCard('lixo', data.servicos.lixo);
                updateServiceCard('aviso', data.servicos.aviso);

                const lastUpdateElement = document.getElementById('last-update');
                lastUpdateElement.textContent = "Última atualização: " + formatTimestamp(data.servicos.agua.ultimaAtualizacao); // A data fica em um dos serviços
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            const lastUpdateElement = document.getElementById('last-update');
            lastUpdateElement.textContent = "Erro ao carregar dados. Tente recarregar a página.";
        });
}

// Carrega os dados quando a página abre e atualiza a cada 1 minuto
document.addEventListener('DOMContentLoaded', fetchData);
setInterval(fetchData, 60000); // Atualiza a cada 60 segundos