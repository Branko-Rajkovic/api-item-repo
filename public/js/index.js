import { login, logout } from './login';
import { updateUserData } from './updateUserData';

const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const updateForm = document.getElementById('updateForm');
const updatePasswordForm = document.getElementById('passwordForm');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (updateForm) {
  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    for (let key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    updateUserData(formData, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById('changePassword').textContent =
      'updating password...';
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('newPasswordConfirm').value;
    await updateUserData(
      {
        oldPassword: oldPassword,
        password: newPassword,
        passwordConfirm: passwordConfirm,
      },
      'password'
    );
    document.getElementById('changePassword').textContent = 'Change password';
  });
}
