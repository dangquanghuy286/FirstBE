// Preview Image
const uploadImg = document.querySelector("[upload-image]");
if (uploadImg) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeImage = document.querySelector("[remove-image]");
  const previewWrapper = document.querySelector(".image-preview-wrapper");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      previewWrapper.style.display = "flex";
    }
  });
  removeImage.addEventListener("click", (e) => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    previewWrapper.style.display = "none";
  });
}
