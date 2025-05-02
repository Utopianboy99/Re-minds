document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem('token');

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('https://re-minds-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'landingpage.html';
      } else {
        alert(data.msg || 'Login failed');
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'landingpage.html';
      } else {
        alert(data.msg || 'Signup failed');
      }
    });
  }

  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      const response = await fetch('https://re-minds-production.up.railway.app/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();
      console.log(data);
    });
  }

  // Load tasks on landing page
  if (document.getElementById('task-list')) {
    fetch('/tasks') // Adjust this to match your API route
      .then(response => response.json())
      .then(tasks => displayTasks(tasks))
      .catch(error => console.error('Error fetching tasks:', error));
  }

  function displayTasks(tasks) {
    const taskContainer = document.getElementById('task-list');
    taskContainer.innerHTML = '';
    tasks.forEach(task => {
      const taskElement = document.createElement('li');
      taskElement.textContent = task.name;
      taskContainer.appendChild(taskElement);
    });
  }
});
