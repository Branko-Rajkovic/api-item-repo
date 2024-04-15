import { login, logout } from './login';
import { signin, acctivation, deleteUsers } from './signin';
import { updateUserData } from './updateUserData';
import { addRecord } from './addRecord';
import { updateReccord } from './updateReccord';
import { deleteReccords } from './deleteReccord';
import { addItem, removeItems } from './addItem';
import { updateItem } from './updateItem';
import { deactivateReviews, addReview } from './deactivate';

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
const deleteUser = document.getElementById('delete-user');
const selectReviews = document.getElementById('select-reviews');
const selectItems = document.getElementById('select-items');
const hamburgerBtn = document.getElementById('hamburger-button');
const userReview = document.getElementById('userReview');

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

if (signinForm) {
  signinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById('signinBtn').textContent = 'signin in...';
    // const signinName = document.getElementById('signinName').value;
    // const signinEmail = document.getElementById('signinEmail').value;
    // const signinPassword = document.getElementById('signinPassword').value;
    // const signinPasswordConfirm = document.getElementById(
    //   'signinPasswordConfirm'
    // ).value;
    // const photo = document.getElementById('photo').files[0];

    const formData = new FormData();

    formData.append('name', document.getElementById('signinName').value);
    formData.append('email', document.getElementById('signinEmail').value);
    formData.append(
      'password',
      document.getElementById('signinPassword').value
    );
    formData.append(
      'passwordConfirm',
      document.getElementById('signinPasswordConfirm').value
    );
    formData.append('photo', document.getElementById('photo').files[0]);

    for (const value of formData.values()) {
      console.log(value);
    }
    for (const key of formData.keys()) {
      console.log(key);
    }

    await addRecord('users/signup', formData);
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

if (deleteUser) {
  const deleteFinal = document.getElementById('delete-final');
  deleteUser.addEventListener('click', (event) => {
    const deleteCheckboxes = document.getElementsByClassName('delete-checkbox');
    for (let i = 0; i < deleteCheckboxes.length; i++) {
      deleteCheckboxes[i].disabled = false;
    }
    deleteUser.textContent = 'click to delete selected';

    deleteFinal.style.setProperty('display', 'inline-block');
    const deletedUsersIds = [];
    deleteFinal.addEventListener('click', (e) => {
      for (let i = 0; i < deleteCheckboxes.length; i++) {
        if (deleteCheckboxes[i].checked) {
          deletedUsersIds.push(deleteCheckboxes[i].id);
        }
      }
      deleteReccords('users', deletedUsersIds);
    });
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
    let otherImagesFlag = 0b000;
    formData.append('itemName', document.getElementById('itemName').value);
    formData.append('itemValue', document.getElementById('itemValue').value);
    formData.append(
      'itemCategory',
      document.getElementById('itemCategory').value
    );
    formData.append(
      'itemDescription',
      document.getElementById('itemDescription').value
    );
    formData.append(
      'uploadedCoverImage',
      document.getElementById('itemCoverImage').files[0]
    );

    if (document.getElementById('otherImage0').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage0').files[0]
      );

      otherImagesFlag |= 0b001;
    }

    if (document.getElementById('otherImage1').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage1').files[0]
      );

      otherImagesFlag |= 0b010;
    }

    if (document.getElementById('otherImage2').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage2').files[0]
      );

      otherImagesFlag |= 0b100;
    }

    formData.append('otherImagesFlag', otherImagesFlag);
    // const itemOtherImages = document.getElementById(
    //   'otherUploadedImages'
    // ).files;
    // for (let i = 0; i < itemOtherImages.length; i++) {
    //   formData.append('otherUploadedImages', itemOtherImages[i]);
    // }

    for (const value of formData.values()) {
      console.log(value);
    }
    for (const key of formData.keys()) {
      console.log(key);
    }

    addRecord('items', formData);
  });
}

// if (deleteItem) {
//   deleteItem.addEventListener('click', (event) => {
//     event.preventDefault();
//     console.log('cliick');
//     const id = deleteItem.dataset.itemId;
//     //deleteItem(id);
//     console.log(id);
//   });
// }

if (updateItemForm) {
  updateItemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = updateItemForm.dataset.id;
    console.log(id);
    const formData = new FormData();
    const changeOtherImages = [];
    let otherImagesFlag = 0b000;
    formData.append('itemName', document.getElementById('itemName').value);
    formData.append('itemValue', document.getElementById('itemValue').value);
    formData.append(
      'itemCategory',
      document.getElementById('itemCategory').value
    );
    formData.append(
      'itemDescription',
      document.getElementById('itemDescription').value
    );
    formData.append(
      'uploadedCoverImage',
      document.getElementById('itemCoverImage').files[0]
    );
    // const otherImg0 = document.getElementById("itemImage0").files[0];
    // const otherImg1 = document.getElementById("itemImage1").files[0];
    // const otherImg2 = document.getElementById("itemImage2").files[0];
    if (document.getElementById('otherImage0').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage0').files[0]
      );
      changeOtherImages.push(true);
      otherImagesFlag |= 0b001;
    }

    if (document.getElementById('otherImage1').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage1').files[0]
      );
      changeOtherImages.push(true);
      otherImagesFlag |= 0b010;
    }

    if (document.getElementById('otherImage2').files[0]) {
      formData.append(
        'otherUploadedImages',
        document.getElementById('otherImage2').files[0]
      );
      changeOtherImages.push(true);
      otherImagesFlag |= 0b100;
    }

    formData.append('otherImagesFlag', otherImagesFlag);
    // const itemOtherImages = document.getElementById('otherUploadedImages').files;
    // for (let i = 0; i < itemOtherImages.length; i++) {
    //   formData.append('otherUploadedImages', itemOtherImages[i]);
    // }

    for (const value of formData.values()) {
      console.log(value);
    }
    for (const key of formData.keys()) {
      console.log(key);
    }
    console.log(otherImagesFlag);
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
    // const review = document.getElementById('leftReview').value;
    // const aboutItem = document.getElementById('leftReview').dataset.item;
    // const createdFromUser = document.getElementById('leftReview').dataset.user;
    // console.log(review, aboutItem, createdFromUser);
    // for (const value of formData.values()) {
    //   console.log(value, typeof value);
    // }
    // for (const key of formData.keys()) {
    //   console.log(key);
    // }
    //const data = { review, aboutItem, createdFromUser };
    addRecord('reviews', formData);
  });
}

if (selectReviews) {
  const deactivateBtn = document.getElementById('deactivate-btn');
  selectReviews.addEventListener('click', (event) => {
    const deactivateCheckboxes = document.getElementsByClassName(
      'deactivate-checkbox'
    );
    for (let i = 0; i < deactivateCheckboxes.length; i++) {
      deactivateCheckboxes[i].disabled = false;
    }
    selectReviews.textContent = 'click to deactivate selected';

    deactivateBtn.style.setProperty('display', 'inline-block');
    const deactivateReviewsIds = [];
    deactivateBtn.addEventListener('click', (e) => {
      for (let i = 0; i < deactivateCheckboxes.length; i++) {
        if (deactivateCheckboxes[i].checked) {
          deactivateReviewsIds.push(deactivateCheckboxes[i].id);
        }
      }
      console.log(deactivateReviewsIds);
      deactivateReviews(deactivateReviewsIds);
    });
  });
}

if (selectItems) {
  const deleteItems = document.getElementById('delete-items');
  selectItems.addEventListener('click', (event) => {
    const itemCheckboxes = document.getElementsByClassName('item-checkbox');
    for (let i = 0; i < itemCheckboxes.length; i++) {
      itemCheckboxes[i].disabled = false;
    }
    selectItems.textContent = 'click to delete selected';

    deleteItems.style.setProperty('display', 'inline-block');
    const deletedItemsIds = [];
    deleteItems.addEventListener('click', (e) => {
      for (let i = 0; i < itemCheckboxes.length; i++) {
        if (itemCheckboxes[i].checked) {
          deletedItemsIds.push(itemCheckboxes[i].id);
        }
      }
      deleteReccords('items', deletedItemsIds);
    });
  });
}
