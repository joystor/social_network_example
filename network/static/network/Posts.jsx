/**
 * Component to show Posts
 * @returns Posts
 */
 function Posts(props) {

    const defaultPost = {
      posts:[],
      error: "",
      num_pages: 0,
      ok: 0,
      page: 0,
      post_count: 0
  };

    const [lastPostFilter, setLastPostFilter] = React.useState(props.filter);
    const [allPosts, setAllPosts] = React.useState(defaultPost);

    React.useEffect(() => {
      if(allPosts.page === 0){
        getAllPosts("all");
      }else if(lastPostFilter != props.filter){
        setLastPostFilter(props.filter);
        getAllPosts(props.filter);
      }
    }, [allPosts, props.filter]);


    const getUrlFilter = () => {
      var url = "/post?a=clientOfc";
      if(props.filter == "user"){
        url += "&p="+window.appOptions.usid;
      }else if(props.filter.startsWith("user")){
        url += "&p="+props.filter.split("-")[1];
      } else if(props.filter == "follow"){
        url += "&f=1";
      }
      return url;
    };


    const getAllPosts = () => {
      var url = getUrlFilter();
      FetchClient.get(url)
        .then((response) => {
            setAllPosts(response);
        });
    };

    const nextPage = () => {
      goToPage(allPosts.page+1);
    };

    const prevPage = () => {
      goToPage(allPosts.page-1);
    };

    const goToPage = (page) => {
      var url = getUrlFilter();
      url += '&pag='+page;
      FetchClient.get(url)
        .then((response) => {
                setAllPosts(response);
            });
    };

    const setPageEl = (el) => {
      var page = el.target.getAttribute('data-page');
      goToPage(page);
    };

    const buildPagination = ()=> {
      var pags = [];
      if(allPosts.posts.length>0){
        //previusPage
        if(allPosts.page == 1){
          pags.push(<li class="page-item disabled"><a class="page-link" href="#"><i class="fas fa-arrow-circle-left"></i></a></li>);
        }else{
          pags.push(<li class="page-item"><a onClick={()=>prevPage()} class="page-link" href="#"><i class="fas fa-arrow-circle-left"></i></a></li>);
        }

        //nextPage
        if(allPosts.page == allPosts.num_pages){
          pags.push(<li class="page-item disabled"><a class="page-link" href="#"><i class="fas fa-arrow-circle-right"></i></a></li>);
        }else{
          pags.push(<li class="page-item"><a onClick={()=>nextPage()} class="page-link" href="#"><i class="fas fa-arrow-circle-right"></i></a></li>);
        }
      } else {
        pags.push(<bold>Without Posts</bold>);
      }

      //build Paginator
      return(
        <nav>  
          <ul class="pagination pagination-sm justify-content-center">
          {pags}
          </ul>
        </nav>
      )
    };

    const clickLike = (post_id) => {
      if(window.appOptions.username == ""){
        window.location.href = "/login";
      }
      var csrftoken = UtilsNetwork.getCookie('csrftoken');
      FetchClient.post('/post_like',{
        id: post_id
      },
      {
          'X-CSRFToken': csrftoken
      }).then((response) => {
          var idx = allPosts.posts.findIndex( (p) => p.post_id == response.post.post_id);
          var updt_posts = [...allPosts.posts];
          var post = {...updt_posts[idx]};
          post.post_likes = response.post.post_likes;
          updt_posts[idx] = post;
          setAllPosts({...allPosts , posts:updt_posts});
      });
    };


    const buildLikes = (post) => {
      if(post.post_likes.length > 0){
        return (<span class="badge bg-danger rounded-pill"><i class="fas fa-heart"></i>  {post.post_likes.length}</span>);
      } else {
        return (<span class="badge bg-secondary rounded-pill"><i class="fas fa-heart"></i>  0</span>);
      }
    };


    const setProfile = (user_id) => {
      props.setFilter("user-"+user_id);
      props.viewUserProfile(user_id)
    };

    const showEditPost = (id) => {
      var els = document.querySelector('[data-edit="'+id+'"]');
      if(els){
        els.classList.remove('hide');
      }
    };

    const hideEditPost = (id) => {
      var els = document.querySelector('[data-edit="'+id+'"]');
      if(els){
        els.classList.add('hide');
      }
    };

    
    const editPost = (id) => {
      var idx = allPosts.posts.findIndex( (p) => p.post_id == id);
      var updt_posts = [...allPosts.posts];
      var post = {...updt_posts[idx]};
      if(post.editPost == true){
        post.editPost = false;
      } else {
        post.editPost = true;
      }
      updt_posts[idx] = post;
      setAllPosts({...allPosts , posts:updt_posts});
    };

    const saveEdit = (id) => {
      var el = document.querySelector('[data-idtxt="'+id+'"]');
      if(el){
        var csrftoken = UtilsNetwork.getCookie('csrftoken');
        FetchClient.post('/editPost',{
            id: id,
            txt: el.value
          },{
              'X-CSRFToken': csrftoken
          })
          .then((data)=> {
          })
          .catch((error)=>{
          });

        var idx = allPosts.posts.findIndex( (p) => p.post_id == id);
        var updt_posts = [...allPosts.posts];
        var post = {...updt_posts[idx]};
        post.editPost = false;
        post.txt = el.value;
        updt_posts[idx] = post;
        setAllPosts({...allPosts , posts:updt_posts});
      }
    };


    return(
        <div id="postContainer" class="container">
            {allPosts.posts.map((p,idx)=>{
                return (
                <div key={p} onMouseOver={()=>showEditPost(p.post_id)} onMouseLeave={()=>hideEditPost(p.post_id)}>
                  <div class="postContainer row justify-content-md-center">
                      <div class="col col-lg-8">
                        <div class="card text-white bg-dark mb-3">
                          <div class="card-body">
                            <div class="row">
                              <div class="col-11"> 
                                <h4 class="card-title a_username" onClick={()=>setProfile(p.user_id)}>{p.username}</h4>
                              </div>
                                  {p.user_id == parseInt(window.appOptions.usid) ?
                                  <div class="col-1 hide" data-edit={p.post_id}>
                                    <a href="#!" id={"like-"+p.post_id} class="card-link" onClick={() => editPost(p.post_id)}>
                                      <i class="far fa-edit"></i>
                                    </a>
                                  </div>
                                    :
                                    null
                                  }
                                
                              </div>
                              
                              <h6 class="card-subtitle mb-2 text-muted">{p.timestamp}</h6>
                              { p.editPost ?
                                <div class="">
                                  <div class="mb-3">
                                      <textarea data-idtxt={p.post_id} class="form-control txtPost" autofocus rows="8">{p.txt}</textarea>
                                  </div>
                                  <div class="row justify-content-end">
                                    <div class="col-2">
                                      <a href="#!" class="btn btn-outline-success" onClick={()=>saveEdit(p.post_id)}>Save</a>
                                    </div>
                                  </div>
                                </div>
                                :
                                <p class="card-text">{p.txt}</p>
                              }
                              
                              <a href="#!" id={"like-"+p.post_id} class="card-link" onClick={() => clickLike(p.post_id)}>
                                {buildLikes(p)}
                              </a>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>)
            })
          }

          <div class="row">
            {buildPagination()}
          </div>

        </div>
    );
 }