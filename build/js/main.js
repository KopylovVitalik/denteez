function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: '3e7e9ca21feb811ba93547b12296631b624acc3a'
      }
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}

// function getData() {
//   fetch('http://504080.com/api/v1/services/categories', {
//     method: 'GET',
//     headers: {
//       Authorization: '3e7e9ca21feb811ba93547b12296631b624acc3a'
//     }
//   })
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         return Promise.reject('something went wrong!');
//       }
//     })
//     .then(data => {
//       const info = data.data;
//       let content = '';
//       info.forEach(el => {
//         content += `
// 				<div class="service__item">
// 				<div style="background-image: url(${
//           el.icon
//         })" class="service__image--fetched"></div>
// 				<p class="service__title">${el.title}</p>
// 			</div>
// 				`;
//       });
//       document.querySelector('.service__container').innerHTML = content;
//     })
//     .catch(error => {
//       document.querySelector('#wrapper').classList.add('active');
//       document.querySelector('.modal').classList.add('active');
//       document.querySelector('.modal').innerHTML = error;
//       setTimeout(() => {
//         document.querySelector('#wrapper').classList.remove('active');
//         document.querySelector('.modal').classList.remove('active');
//       }, 3500);
//     });
// }

// function handleResponse(response) {
//   return response.json().then(json => {
//     if (response.ok) {
//       return json;
//     } else {
//       return Promise.reject(json);
//     }
//   });
// }

// function getData() {
//   fetch('http://504080.com/api/v1/services/categories', {
//     method: 'GET',
//     headers: {
//       Authorization: '3e7e9ca21feb811ba93547b12296631b624acc3a'
//     }
//   })
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         return Promise.reject('something went wrong!');
//       }
//     })
//     .then(data => {
//       const info = data.data;
//       let content = '';
//       info.forEach(el => {
//         content += `
// 				<div class="service__item">
// 				<div style="background-image: url(${
//           el.icon
//         })" class="service__image--fetched"></div>
// 				<p class="service__title">${el.title}</p>
// 			</div>
// 				`;
//       });
//       document.querySelector('.service__container').innerHTML = content;
//     })
//     .catch(error => {
//       document.querySelector('#wrapper').classList.add('active');
//       document.querySelector('.modal').classList.add('active');
//       document.querySelector('.modal').innerHTML = error;
//       setTimeout(() => {
//         document.querySelector('#wrapper').classList.remove('active');
//         document.querySelector('.modal').classList.remove('active');
//       }, 3500);
//     });
// }

function handleResponse(response) {
  return response.json().then(json => {
    if (response.ok) {
      return json;
    } else {
      return Promise.reject(json);
    }
  });
}

function loadFetchedData() {
  const container = document.querySelector('.service__container');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  get('http://504080.com/api/v1/services/categories')
    .then(data => {
      const info = data.data;
      let content = '';
      info.forEach(el => {
        content += `
    				<div class="service__item">
    				<div style="background-image: url(${
              el.icon
            })" class="service__image--fetched"></div>
    				<p class="service__title">${el.title}</p>
    			</div>
    				`;
      });
      document.querySelector('.service__container').innerHTML = content;
    })
    .catch(err => console.log(err));
}

function loadBrokenData() {
  const container = document.querySelector('.service__container');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  get('http://504080.com/api/v1/services/categoriessdsd')
    .then(data => console.log(data))
    .catch(error => {
      document.querySelector('#wrapper').classList.add('active');
      document.querySelector('.modal').classList.add('active');
      document.querySelector('.modal').innerHTML = error;
      setTimeout(() => {
        document.querySelector('#wrapper').classList.remove('active');
        document.querySelector('.modal').classList.remove('active');
      }, 3500);
    });
}

if (document.querySelector('#fetchData')) {
  document
    .querySelector('#fetchData')
    .addEventListener('click', loadFetchedData);
}

if (document.querySelector('#brokenData')) {
  document
    .querySelector('#brokenData')
    .addEventListener('click', loadBrokenData);
}

// ===== UPLOADER =====

const fileInput = document.querySelector('#req-image');

fileInput.addEventListener('change', previewImage);

function previewImage() {
  const previewContainer = document.querySelector('.img-preview');
  const file = document.querySelector('#req-image').files[0];

  if (previewContainer.firstChild) {
    previewContainer.removeChild(previewContainer.firstChild);
  }

  const previewContainerAnimation = anime({
    targets: '.img-preview',
    translateY: [100, 0],
    opacity: 1,
    easing: 'linear',
    duration: 200
  });

  const preview = document.createElement('img');
  preview.className = 'img-fluid';

  // File size matching
  if (file.size > 5120000) {
    document.querySelector('.img-preview').innerHTML =
      "<h2 style='font-size: 30px; color: red;'>Maximum size of the uploaded image should not exceed 5MB</h3>";
    document.querySelector('.img-preview').style.opacity = 1;
    return false;
  }
  // Extra matching of image type with js
  else if (file.type.match(/image.*/)) {
    const reader = new FileReader();
    reader.onloadend = function(e) {
      preview.src = e.target.result;
      previewContainer.appendChild(preview);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = '';
    }
  } else {
    document.querySelector('.img-preview').innerHTML =
      "<h2 style='font-size: 30px; color: red;'>Only images are permitted</h3>";
    return false;
  }
}

// ===== VALIDATION =====

document.getElementById('req-name').addEventListener('blur', simpleCheck);

document.getElementById('req-email').addEventListener('blur', e => {
  const re = /^([a-zA-Z0-9_\-\.]+)\@([a-zA-Z0-9_\-\.]+)+\.([a-zA-Z]{2,5})$/;
  if (!re.test(e.target.value)) {
    e.target.classList.add('is-invalid');
  } else {
    e.target.classList.remove('is-invalid');
  }
});

document.getElementById('req-subject').addEventListener('blur', simpleCheck);

document.getElementById('req-descr').addEventListener('blur', simpleCheck);

function simpleCheck(e) {
  if (e.target.value === '') e.target.classList.add('is-invalid');
}

document.getElementById('enquiryType').addEventListener('change', e => {
  if (e.target.selectedOptions[0].value === 'Other') {
    document.getElementById('other-option').classList.remove('invisible');
    e.target.setAttribute('disabled', 'disabled');
  }
  // if (e.target.value === '') e.target.classList.add('is-invalid');
});

// ===== FETCHING SELECT OPTIONS =====
function getSelectOptions() {
  fetch('http://504080.com/api/v1/directories/enquiry-types', {
    method: 'GET',
    headers: {
      Authorization: '3e7e9ca21feb811ba93547b12296631b624acc3a'
    }
  })
    .then(res => res.json())
    .then(data => {
      const selectOptionsData = data.data;
      const select = document.querySelector('#enquiryType');
      let options = '';
      selectOptionsData.forEach(opt => {
        options += `<option value='${opt.name}'>${opt.name}</option>`;
      });
      select.innerHTML = options;
    })
    .catch(err => console.log(err));
}

if (document.querySelector('#enquiryType')) {
  getSelectOptions();
}

// ==== SUBMITTING FORM ====
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  var formData = new FormData();
  formData.append('enquiry_type', document.getElementById('enquiryType').value);
  formData.append('user_name', document.getElementById('req-name').value);
  formData.append('email', document.getElementById('req-email').value);
  formData.append('subject', document.getElementById('req-subject').value);
  formData.append('description', document.getElementById('req-descr').value);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://504080.com/api/v1/support', true);
  xhr.addEventListener('readystatechange', function() {
    if (xhr.readyState == 4) {
      console.log(xhr.responseText);
    }
  });
  xhr.send(formData);
});
