const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario.name || !novoUsuario.email || !novoUsuario.phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
    }

    novoUsuario.id = Date.now().toString();
    users.push(novoUsuario);
    
    res.status(201).json(novoUsuario);

});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser, id: userId };
    
    res.json(users[userIndex]);
    
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const initialLength = users.length;
    
    users = users.filter(u => u.id !== userId);
    
    if (users.length === initialLength) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário excluído com sucesso' });
});

app.listen(3000)
