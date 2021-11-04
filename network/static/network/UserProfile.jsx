function UserProfile(props) {

  const [userProfile, setUserProfile] = React.useState(-1);

  const [showProfile, setShowProfile] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    username: ""
  });


  React.useEffect(() => {
    if(userProfile != props.userProfile){
      getUserInfo(props.userProfile);
      setUserProfile(props.userProfile);
      if(!showProfile) {
        toggleProfileContainer();
      }
    }

    if(userProfile == -1){
      getUserInfo(window.appOptions.usid);
      setUserProfile(window.appOptions.usid);
    }
  }, [props.userProfile]);

  const toggleProfileContainer = () => {
    let isVisible = !showProfile;
    setShowProfile(isVisible);

    var postContainer = document.getElementById('postContainer');
    if(isVisible){
      postContainer.style.width = "70%";
      postContainer.classList.remove("container");
    } else {
      postContainer.style.width = "";
      postContainer.classList.add("container");
    }
  };

  const getUserInfo = (id) => {
    FetchClient.get("/user_info?u="+id)
    .then((response) => {
        setUserInfo(response);
      });
  };

  const toggleFollow = () => {
    var csrftoken = UtilsNetwork.getCookie('csrftoken');
      FetchClient.post('/tog_follow',{
        id: userInfo.usid
      },
      {
          'X-CSRFToken': csrftoken
      }).then((response) => {
        setUserInfo(response);
      });
  };

  return (<div>

    { !showProfile ? 
      <div id="showUserProfile">
          <button type="button" class="btn btn-outline-warning addPostButton btn-lg" onClick={toggleProfileContainer}>
              <i class="fas fa-user"></i>
          </button>
      </div>
    :null}

    { showProfile ? 
    <div id="userProfileContainer" class="bg-dark border-dark container">

      <div id="closeUserProfile">
          <button type="button" class="btn btn-outline-danger addPostButton " onClick={toggleProfileContainer}>
              <i class="fas fa-times"></i>
          </button>
      </div>

      <br></br>
      <div class="row text-center">
        <h3>{userInfo.username}</h3>
      </div>
      <br></br>
      <div class="row">
        <div class="col-5">
          Following: {userInfo.following}
        </div>
        <div class="col-2">
        </div>
        <div class="col-5">
          Followers: {userInfo.follower}
        </div>
      </div>
      <br></br>
      <div class="row ">
        <div class="col text-center">Posts: {userInfo.posts}
        </div>
      </div>

      <br></br>
      { (userInfo.actual_usr != userInfo.usid) ?
        <div class="row ">
          <div class="col text-center">
            {userInfo.is_following == 0 ?
              <a href="#!" class="btn btn-outline-success" onClick={() => toggleFollow()}>Follow</a>
              :
              <a href="#!" class="btn btn-outline-danger" onClick={() => toggleFollow()}>Unfollow</a>
            }
          </div>
        </div>
        :null
      }
      

    </div>
    :null}

  </div>);
}