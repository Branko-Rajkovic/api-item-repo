import { login, logout } from './login';
import { signin, acctivation } from './signin';
import { updateUserData } from './updateUserData';

const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const updateForm = document.getElementById('updateForm');
const signinForm = document.getElementById('signinForm');
const acctivationForm = document.getElementById('acctivationForm');
const updatePasswordForm = document.getElementById('passwordForm');
const currentImage = document.getElementById('currentImage');

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

if (signinForm) {
  signinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById('signinBtn').textContent = 'signin in...';
    const signinName = document.getElementById('signinName').value;
    const signinEmail = document.getElementById('signinEmail').value;
    const signinPassword = document.getElementById('signinPassword').value;
    const signinPasswordConfirm = document.getElementById(
      'signinPasswordConfirm'
    ).value;

    await signin(
      signinName,
      signinEmail,
      signinPassword,
      signinPasswordConfirm
    );
  });
}

if (acctivationForm) {
  acctivationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('acctivateBtn').textContent = 'acctvating...';
    const acctivationCode = document.getElementById('acctivationCode').value;

    acctivation(acctivationCode);
  });
}

if (currentImage) {
  const selectedPhoto = document.getElementById('photo');
  if (selectedPhoto) {
    selectedPhoto.addEventListener('change', () => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        currentImage.setAttribute('src', event.target.result);
      };
      fileReader.readAsDataURL(selectedPhoto.files[0]);
    });
  }
}
