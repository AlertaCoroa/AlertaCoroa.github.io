// =================================================================
// COLE AQUI A URL DO SEU APP DA WEB (a mesma de antes)
// =================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyfUfp7OOdbZ7NnxRpxoEneozMLuvBPPeWblvoawVIblyYCma1AhdAl0ByK7FExS858/exec";
// =================================================================

// =================================================================
// USE A MESMA SENHA QUE VOCÊ DEFINIU NO GOOGLE APPS SCRIPT
// =================================================================
const ADMIN_PASSWORD = "senhaforte123";
// =================================================================

const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const updateForm = document.getElementById('update-form');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        loginError.style.display = 'block';
    }
});

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitButton = updateForm.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Atualizando...';

    const payload = {
        password: ADMIN_PASSWORD,
        updates: {
            agua: {
                status: document.getElementById('agua-status').value,
                classe: document.getElementById('agua-classe').value,
                detalhes: document.getElementById('agua-detalhes').value,
                previsao: document.getElementById('agua-previsao').value,
            },
            energia: {
                status: document.getElementById('energia-status').value,
                classe: document.getElementById('energia-classe').value,
                detalhes: document.getElementById('energia-detalhes').value,
                previsao: document.getElementById('energia-previsao').value,
            },
            lixo: {
                status: document.getElementById('lixo-status').value,
                classe: document.getElementById('lixo-classe').value,
                detalhes: document.getElementById('lixo-detalhes').value,
                previsao: document.getElementById('lixo-previsao').value,
            },
            aviso: {
                status: document.getElementById('aviso-status').value,
                classe: document.getElementById('aviso-classe').value,
                detalhes: document.getElementById('aviso-detalhes').value,
                previsao: '', // Aviso não tem previsão
            }
        }
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Required for Google Apps Script
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Painel atualizado com sucesso!');
        } else {
            alert('Ocorreu um erro: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha na comunicação. Verifique a internet.');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'ATUALIZAR PAINEL';
    });
});