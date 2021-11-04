
function Main(props){

  const [postFilter, setPostFilter] = React.useState("all");
  const changePostFilterHandler = React.useCallback(
    (filter) => {
      console.log("filterMain:"+filter);
      setPostFilter(filter);
    },
    [postFilter]
  );

  const [userProfile, setUserProfile] = React.useState(-1);
  const changeUserProfileHandler = React.useCallback(
    (profile) => {
      console.log("userProfile:"+profile);
      setUserProfile(profile);
    },
    [userProfile]
  );

  return(
    <div>
      <MenuNav filter={postFilter} changePostFilter={changePostFilterHandler} viewUserProfile={changeUserProfileHandler}/>
      <br></br>
      <Posts filter={postFilter} setFilter={setPostFilter} viewUserProfile={changeUserProfileHandler}/>
      <UserProfile userProfile={userProfile}/>
    </div>
  );
}

ReactDOM.render( 
    (<React.StrictMode>
      <Main></Main>
    </React.StrictMode>),
    document.getElementById('appAll')
);