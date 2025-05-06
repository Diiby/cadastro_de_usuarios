document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const usersTableBody = document.getElementById('usersTableBody');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
     
    userForm.addEventListener('submit', envioForm);
    cancelBtn.addEventListener('click', resetForm);
    document.addEventListener('click', btnEditarExcluir);
    
    let editingId = null;

    loadUsers();

    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:3000/users');
            const users = await response.json();
            
            usersTableBody.innerHTML = '';
            
            if (users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="5">Nenhum usuário cadastrado</td></tr>';
                return;
            }
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'Não informado'}</td>
                    <td>${user.idade}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${user.id}"><img src="img/editar.png" style="width: 10px"> Editar</button>
                        <button class="delete-btn" data-id="${user.id}"><img src="img/lixeira.png" style="width: 10px"> Excluir</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert('Erro ao carregar usuários');
        }
    }

    async function envioForm(e) {
        e.preventDefault();
 
        if (!validateForm()) {
            return;
        }
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            idade: document.getElementById('idade').value
        };
        
        try {
            let response;
            
            if (editingId) {
                response = await fetch(`http://localhost:3000/users/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            }
            
            if (response.ok) {
                resetForm();
                loadUsers();
                alert(editingId ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
            } else {
                throw new Error('Erro ao salvar usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar usuário');
        }
    }

    function validateForm() {
        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const name = document.getElementById('name').value.trim();
        if (name === '') {
            document.getElementById('nameError').textContent = 'Nome é obrigatório';
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        const emailPadrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('emailError').textContent = 'Email é obrigatório';
            isValid = false;
        } else if (!emailPadrao.test(email)) {
            document.getElementById('emailError').textContent = 'Email inválido. Ex.: test@test.com';
            isValid = false;
        }

        const phone = document.getElementById('phone').value.trim();    
        if(phone === ''){
            document.getElementById('phoneError').textContent = 'Telefone é obrigatório';
            isValid = false;
        }
        else if (phone && !/^\d{10,11}$/.test(phone)) {
            document.getElementById('phoneError').textContent = 'Telefone deve ter 10 ou 11 dígitos';
            isValid = false;
        }

        const idade = document.getElementById('idade').value.trim();
        if (idade === '') {
            document.getElementById('idadeError').textContent = 'Idade é obrigatório';
            isValid = false;
        }
        return isValid;
    }

    async function btnEditarExcluir(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este usuário?')) {
                try {
                    const response = await fetch(`http://localhost:3000/users/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadUsers();
                        alert('Usuário excluído com sucesso!');
                    } else {
                        throw new Error('Erro ao excluir usuário');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao excluir usuário');
                }
            }
        } else if (e.target.classList.contains('edit-btn')) {
            const id = e.target.getAttribute('data-id');
            editUser(id);
        }
    }

    async function editUser(id) {
        try {
            const response = await fetch(`http://localhost:3000/users/${id}`);
            const user = await response.json();
            
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('idade').value = user.idade;
            
            submitBtn.textContent = 'Atualizar';
            editingId = user.id;

            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao carregar usuário para edição:', error);
            alert('Erro ao carregar usuário para edição');
        }
        
    }

    function resetForm() {
        userForm.reset();
        document.getElementById('userId').value = '';
        submitBtn.textContent = 'Cadastrar Usuário';
        editingId = null;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
    
});