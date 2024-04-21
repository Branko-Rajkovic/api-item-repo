import axios from 'axios';
import { login, logout } from './login';
import { updateUserData } from './updateUserData';
import { addReccord, acctivation, forgotPassword } from './addReccord';
import { updateReccord } from './updateReccord';
import {
  appendImagesToFormData,
  appendInputValueFields,
} from './appendToFormData';
import { selectAndDischarge } from './selectToDelete';

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logoutBtn');
const updateForm = document.getElementById('updateForm');
const signinForm = document.getElementById('signinForm');
const acctivationForm = document.getElementById('acctivationForm');
const updatePasswordForm = document.getElementById('passwordForm');
const currentImage = document.getElementById('currentImage');
const addItemForm = document.getElementById('addItemForm');
const updateItemForm = document.getElementById('updateItemForm');
const selectReviews = document.getElementById('select-reviews');
const disableUsersBtn = document.getElementById('disable-users');
const enableUsersBtn = document.getElementById('enable-users');
const enableUsersDeleteBtn = document.getElementById('enable-users-delete');
const disableItemsBtn = document.getElementById('disable-items');
const enableItemsBtn = document.getElementById('enable-items');
const enableItemsDeleteBtn = document.getElementById('enable-items-delete');
const disableReviewsBtn = document.getElementById('disable-reviews');
const enableReviewsBtn = document.getElementById('enable-reviews');
const enableReviewsDeleteBtn = document.getElementById('enable-reviews-delete');
const hamburgerBtn = document.getElementById('hamburger-button');
const userReview = document.getElementById('userReview');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response && err.message === 'Request failed with status code 401') {
      document.getElementById('try-again').style.display = 'inline-block';
      return Promise.reject(err);
    }
    // Handle other errors here
    return Promise.reject(err);
  }
);

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', (event) => {
    document.getElementById('hamburger-links').style.display =
      document.getElementById('hamburger-links').style.display === 'none'
        ? 'block'
        : 'none';
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', (event) => {
    loginForm.style.setProperty('display', 'block');
    loginBtn.style.setProperty('display', 'none');
  });
}
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

if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', (event) => {
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

if (signinForm) {
  signinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById('signinBtn').textContent = 'signin in...';
    const formData = new FormData();
    appendInputValueFields(formData, [
      { name: 'signinName' },
      { email: 'signinEmail' },
      { password: 'signinPassword' },
      { passwordConfirm: 'signinPasswordConfirm' },
    ]);

    formData.append('photo', document.getElementById('photo').files[0]);

    await addReccord('users/signup', formData);
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

if (disableUsersBtn) {
  disableUsersBtn.addEventListener('click', function () {
    selectAndDischarge(this, 'users', 'deacctivate');
  });
}

if (enableUsersBtn) {
  enableUsersBtn.addEventListener('click', () => {
    selectAndDischarge(this, 'users', 'acctivate');
  });
}

if (enableUsersDeleteBtn) {
  enableUsersDeleteBtn.addEventListener('click', () => {
    const deleteUsersBtn = document.getElementById('delete-users-final');
    deleteUsersBtn.style.display = 'inline-block';
    if (deleteUsersBtn) {
      deleteUsersBtn.addEventListener('click', function () {
        selectAndDischarge(this, 'users', 'delete');
      });
    }
  });
}

if (disableItemsBtn) {
  disableItemsBtn.addEventListener('click', function () {
    selectAndDischarge(this, 'items', 'deacctivate');
  });
}

if (enableItemsBtn) {
  enableItemsBtn.addEventListener('click', () => {
    selectAndDischarge(this, 'items', 'acctivate');
  });
}

if (enableItemsDeleteBtn) {
  enableItemsDeleteBtn.addEventListener('click', () => {
    const deleteItemsBtn = document.getElementById('delete-items-final');
    deleteItemsBtn.style.display = 'inline-block';
    if (deleteItemsBtn) {
      deleteItemsBtn.addEventListener('click', function () {
        selectAndDischarge(this, 'items', 'delete');
      });
    }
  });
}

if (disableReviewsBtn) {
  disableReviewsBtn.addEventListener('click', function () {
    selectAndDischarge(this, 'reviews', 'deacctivate');
  });
}

if (enableReviewsBtn) {
  enableReviewsBtn.addEventListener('click', () => {
    selectAndDischarge(this, 'reviews', 'acctivate');
  });
}

if (enableReviewsDeleteBtn) {
  enableReviewsDeleteBtn.addEventListener('click', () => {
    const deleteReviewsBtn = document.getElementById('delete-reviews-final');
    deleteReviewsBtn.style.display = 'inline-block';
    if (deleteReviewsBtn) {
      deleteReviewsBtn.addEventListener('click', function () {
        selectAndDischarge(this, 'reviews', 'delete');
      });
    }
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

if (addItemForm) {
  addItemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData();

    appendInputValueFields(formData, [
      { itemName: 'itemName' },
      { itemValue: 'itemValue' },
      { itemCategory: 'itemCategory' },
      { itemDescription: 'itemDescription' },
    ]);

    formData.append(
      'uploadedCoverImage',
      document.getElementById('itemCoverImage').files[0]
    );

    const otherImagesFlag = appendImagesToFormData(
      formData,
      'otherUploadedImages',
      'otherImage0',
      'otherImage1',
      'otherImage2'
    );

    formData.append('otherImagesFlag', otherImagesFlag);

    addReccord('items', formData);
  });
}

if (updateItemForm) {
  updateItemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = updateItemForm.dataset.id;
    const formData = new FormData();
    appendInputValueFields(formData, [
      { itemName: 'itemName' },
      { itemValue: 'itemValue' },
      { itemCategory: 'itemCategory' },
      { itemDescription: 'itemDescription' },
    ]);

    formData.append(
      'uploadedCoverImage',
      document.getElementById('itemCoverImage').files[0]
    );

    const otherImagesFlag = appendImagesToFormData(
      formData,
      'otherUploadedImages',
      'otherImage0',
      'otherImage1',
      'otherImage2'
    );

    formData.append('otherImagesFlag', otherImagesFlag);
    updateReccord('items', formData, id);
  });
}

if (userReview) {
  userReview.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData();
    const reviewInput = document.getElementById('leftReview');
    formData.append('aboutItem', reviewInput.dataset.item);
    formData.append('createdFromUser', reviewInput.dataset.user);
    formData.append('review', reviewInput.value);
    addReccord('reviews', formData);
  });
}

// if (selectReviews) {
//   selectReviews.addEventListener('click', function () {
//     selectAndDischarge(this, 'review', 'reviews', false);
//   });
// }

// if (selectItemsBtn) {
//   selectItemsBtn.addEventListener('click', function () {
//     selectAndDischarge(this, 'item', 'items', true);
//   });
// }
