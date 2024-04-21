export const appendInputValueFields = (formData, inputFields) => {
  inputFields.forEach((inputField) => {
    formData.append(
      Object.keys(inputField)[0],
      document.getElementById(Object.values(inputField)[0]).value
    );
  });
};

export const appendImagesToFormData = (formData, formDataName, ...images) => {
  let indexFlag = 0;
  images.forEach((image, index) => {
    if (document.getElementById(image).files[0]) {
      formData.append(formDataName, document.getElementById(image).files[0]);
      indexFlag |= 2 ** index;
    }
  });
  return indexFlag;
};

// formData.append(
//     'uploadedCoverImage',
//     document.getElementById('itemCoverImage').files[0]
//   );

//   if (document.getElementById('otherImage0').files[0]) {
//     formData.append(
//       'otherUploadedImages',
//       document.getElementById('otherImage0').files[0]
//     );

//     otherImagesFlag |= 0b001;
//   }

//   if (document.getElementById('otherImage1').files[0]) {
//     formData.append(
//       'otherUploadedImages',
//       document.getElementById('otherImage1').files[0]
//     );

//     otherImagesFlag |= 0b010;
//   }

//   if (document.getElementById('otherImage2').files[0]) {
//     formData.append(
//       'otherUploadedImages',
//       document.getElementById('otherImage2').files[0]
//     );

//     otherImagesFlag |= 0b100;
//   }
