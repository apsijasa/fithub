import fetch from 'node-fetch';

async function loginAndDelete() {
  try {
    // Paso 1: Iniciar sesión como super_admin
    console.log('Iniciando sesión como super_admin...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'apsijas@grupoatlas.cl',
        password: 'atlas123'
      }),
      credentials: 'include'
    });

    if (!loginResponse.ok) {
      throw new Error(`Error al iniciar sesión: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const user = await loginResponse.json();
    console.log(`Sesión iniciada como: ${user.username} (${user.role})`);

    // Paso 2: Obtener la lista de usuarios
    console.log('Obteniendo lista de usuarios...');
    const cookies = loginResponse.headers.get('set-cookie');
    
    const usersResponse = await fetch('http://localhost:5000/api/users', {
      method: 'GET',
      headers: {
        'Cookie': cookies
      },
      credentials: 'include'
    });

    if (!usersResponse.ok) {
      throw new Error(`Error al obtener usuarios: ${usersResponse.status} ${usersResponse.statusText}`);
    }

    const users = await usersResponse.json();
    
    // Paso 3: Buscar al usuario diegobelmar@gmail.com
    const targetUser = users.find(u => u.username === 'diegobelmar@gmail.com');
    
    if (!targetUser) {
      throw new Error('Usuario diegobelmar@gmail.com no encontrado');
    }
    
    console.log(`Usuario encontrado: ${targetUser.username} (ID: ${targetUser.id}, Role: ${targetUser.role}, GymID: ${targetUser.gymId})`);
    console.log(`Usuario autenticado: ${user.username} (ID: ${user.id}, Role: ${user.role}, GymID: ${user.gymId})`);
    
    // Paso 4: Eliminar el usuario
    console.log(`Eliminando usuario con ID ${targetUser.id}...`);
    const deleteResponse = await fetch(`http://localhost:5000/api/users/${targetUser.id}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookies
      },
      credentials: 'include'
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`Error al eliminar usuario: ${deleteResponse.status} ${deleteResponse.statusText}`);
    }
    
    const result = await deleteResponse.json();
    console.log('Resultado:', result);
    console.log('Usuario eliminado exitosamente');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

loginAndDelete();