console.log(localStorage);

// main card: user information
const profile = document.getElementById('profile'),
  uname = document.getElementById('name'),
  ulocation = document.getElementById('location'),
  blog = document.getElementById('blog'),
  bio = document.getElementById('bio');

// search card: search box and submit button
const submit = document.getElementById('submit'),
  searchUser = document.getElementById('search-box');
// alert
const errorAlert = document.getElementById('error-alert');

// show error alert with given message
const showError = (msg) => {
  errorAlert.innerHTML = msg;
  errorAlert.style.visibility = 'visible';
  setTimeout(() => {
    errorAlert.style.visibility = 'hidden';
  }, 2000);
};

// set user info in UI
const setUserInfo = (profileUrl, name, uBlog, uLocation, uBio) => {
  uname.innerHTML = name;
  blog.innerHTML = uBlog;
  blog.href = uBlog;
  ulocation.innerHTML = uLocation;
  bio.innerHTML = uBio;
  profile.src = profileUrl;
};

// extract necessary user data
const extractData = (data) => {
  const userData = {};
  ['avatar_url', 'name', 'location', 'blog', 'bio'].forEach((val) => {
    if (data[val] != null) userData[val] = data[val];
    else userData[val] = '';
  });
  // handle \n in bio
  userData['bio'] = userData['bio'].replace('\r\n', '<br>');
  return userData;
};

// fetch user
const fetchUser = async () => {
  // check if search box is empty
  if (searchUser.value === '') {
    showError('Username can not be empty!');
    return;
  }
  // check if user info is already saved in local storage
  if (localStorage[searchUser.value.toLowerCase()]) {
    let userData = JSON.parse(localStorage[searchUser.value.toLowerCase()]);
    // set user info in ui
    setUserInfo(
      userData['avatar_url'],
      userData['name'],
      userData['blog'],
      userData['location'],
      userData['bio']
    );
  } else {
    // fetch data
    try {
      const res = await fetch(
        `https://api.github.com/users/${searchUser.value}`
      );
      // get json response
      let data = await res.json();
      // check if user is not found
      if (data['message'] == 'Not Found') {
        showError('User not found!');
      } else if (data['login']) {
        // create user data object
        const userData = extractData(data);
        // set user info in ui
        setUserInfo(
          userData['avatar_url'],
          userData['name'],
          userData['blog'],
          userData['location'],
          userData['bio']
        );
        // store user info in local storage
        localStorage.setItem(
          data['login'].toLowerCase(),
          JSON.stringify(userData)
        );
      } else if (data['message']) {
        showError(`Error: ${data['message']}`);
      }
    } catch (error) {
      showError(error.message);
    }
  }
};

// set listener for submit
submit.addEventListener('click', fetchUser);
