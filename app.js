// =================================================================
// COLE AQUI A URL DO SEU APP DA WEB (Google Apps Script)
// =================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyfUfp7OOdbZ7NnxRpxoEneozMLuvBPPeWblvoawVIblyYCma1AhdAl0ByK7FExS858/exec";
// =================================================================

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Conectando...';
    const date = new Date(Number(timestamp));
    return "Última atualização: " + date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
}

// Função para atualizar um card de serviço na grade
function updateServiceCard(serviceName, data) {
    const cardElement = document.getElementById(serviceName);
    if (!cardElement || !data) return;

    // Atualiza o status principal
    const statusSpan = cardElement.querySelector('.service-status span');
    if (statusSpan) {
        statusSpan.textContent = data.status || 'Indisponível';
    }

    // Pega os elementos de detalhes
    const detailsP = cardElement.querySelector('.details');
    const previsaoP = cardElement.querySelector('.previsao');

    // Mostra ou esconde os detalhes
    if (data.detalhes || data.previsao) {
        cardElement.classList.add('has-details');
        if(detailsP) detailsP.textContent = data.detalhes;
        if(previsaoP) previsaoP.textContent = data.previsao;
    } else {
        cardElement.classList.remove('has-details');
    }

    // Atualiza a cor do card
    cardElement.classList.remove('loading', 'ok', 'alerta', 'critico');
    if (data.classe) {
        cardElement.classList.add(data.classe);
    }
}

// Função para atualizar o card de aviso
function updateAvisoCard(data) {
    const cardElement = document.getElementById('aviso');
    if (!cardElement || !data) return;
    const contentP = cardElement.querySelector('.aviso-content p');
    if(contentP) {
        contentP.textContent = data.detalhes || 'Sem avisos no momento.';
    }
    cardElement.classList.remove('loading', 'ok', 'alerta');
    if (data.classe) {
        cardElement.classList.add(data.classe);
    }
}

// Função para atualizar o status geral
function updateStatusGeral(services) {
    const cardElement = document.getElementById('status-geral');
    const textElement = cardElement.querySelector('p');
    if (!cardElement || !textElement) return;
    let hasCritico = false;
    let hasAlerta = false;
    for (const key in services) {
        if (services[key].classe === 'critico') { hasCritico = true; break; }
        if (services[key].classe === 'alerta') { hasAlerta = true; }
    }
    cardElement.classList.remove('loading', 'ok', 'alerta', 'critico');
    if (hasCritico) {
        cardElement.classList.add('critico');
        textElement.textContent = 'Um ou mais serviços apresentam problemas críticos.';
    } else if (hasAlerta) {
        cardElement.classList.add('alerta');
        textElement.textContent = 'Um ou mais serviços estão em alerta.';
    } else {
        cardElement.classList.add('ok');
        textElement.textContent = 'Todos os serviços estão operando normalmente.';
    }
}

function fetchData() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data && data.servicos) {
                updateServiceCard('agua', data.servicos.agua);
                updateServiceCard('energia', data.servicos.energia);
                updateServiceCard('lixo', data.servicos.lixo);
                updateAvisoCard(data.servicos.aviso);
                updateStatusGeral(data.servicos);
                const lastUpdateElement = document.getElementById('last-update');
                lastUpdateElement.textContent = formatTimestamp(data.servicos.agua.ultimaAtualizacao);
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            const statusGeral = document.getElementById('status-geral');
            statusGeral.className = 'status-geral-card critico';
            statusGeral.querySelector('p').textContent = 'Não foi possível carregar os dados. Verifique a conexão.';
        });
}

document.addEventListener('DOMContentLoaded', fetchData);
setInterval(fetchData, 60000);