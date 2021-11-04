function MenuNav(props) {

    const [showSelected, setShowSelected] = React.useState("all");

    const changePostFilter = (new_filter) => {
        setShowSelected(new_filter);
        props.changePostFilter(new_filter);
    };

    const showUserProfile = () => {
        props.viewUserProfile(window.appOptions.usid);
    };

    const buildMenu = () => {
        console.log(showSelected);
        var menuItems = [];
        if(window.appOptions.isAuthenticated){
            menuItems.push(<li class="nav-item">
                <a class={showSelected=="user" ? "nav-link text-dark fs-5" : "nav-link"} onClick={()=> {
                    changePostFilter('user');
                    showUserProfile();}} href="#!">{`${window.appOptions.username}`}</a>
            </li>);
        }
        menuItems.push(<li class="nav-item">
                <a class={showSelected=="all" ? "nav-link text-dark fs-5" : "nav-link"} onClick={()=>changePostFilter('all')} href="#!">All Posts</a>
            </li>);

        if(window.appOptions.isAuthenticated) {
            menuItems.push(<li class="nav-item">
                <a class={showSelected=="follow" ? "nav-link text-dark fs-5" : "nav-link"} onClick={()=>changePostFilter('follow')} href="#!">Following</a>
            </li>);
            menuItems.push(<li class="nav-item">
                <a class="nav-link" href={`${window.appOptions.urls.logout}`}>Log Out</a>
            </li>);
        } else {
            menuItems.push(<li class="nav-item">
                <a class="nav-link" href={`${window.appOptions.urls.login}`}>Log In</a>
            </li>);
            menuItems.push(<li class="nav-item">
                <a class="nav-link" href={`${window.appOptions.urls.register}`}>Register</a>
            </li>);
        }
        return menuItems;
    }


    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light py-1">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Tweets</a>
                <div>
                    <ul class="navbar-nav mr-auto">
                        {buildMenu()}
                    </ul>
                </div>
            </div>
        </nav>
    );
}