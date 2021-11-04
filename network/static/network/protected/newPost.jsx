/**
 * Component to create new Post
 * @returns NewPost
 */
function NewPost(props) {

    const [disableButton, setDisableButton] = React.useState();
    var modalPost;

    React.useEffect(() => {
        setDisableButton(false);
    },[]);

    const initModal = ()=>{
        if(modalPost == null){
            let containerPost = document.getElementById("modalNewPost");
            if(containerPost !== null){
                modalPost = new bootstrap.Modal(containerPost);
            }
        }
    };

    const openModal = () => {
        initModal();
        modalPost.show();
    };

    const sendNewPost = () => {
        initModal();
        var csrftoken = UtilsNetwork.getCookie('csrftoken');
        var postTxt = document.getElementById('txtPost').value;
        if(postTxt === ""){
            return;
        }
        setDisableButton(true);
        FetchClient.post('/newPost',
            {
                txt: postTxt
            },
            {
                'X-CSRFToken': csrftoken
            })
            .then((data)=> {
                document.getElementById('txtPost').value = "";
                setDisableButton(false);
                modalPost.hide();
            })
            .catch((error)=>{
                console.log(error);
                setDisableButton(false);
            });
    };

    return (
        <div>
            <div class="addPostButtonContainer">
                <button type="button" class="btn btn-outline-success addPostButton btn-lg" onClick={openModal}>
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div>
                <div class="modal fade" id="modalNewPost" tabindex="-1" aria-labelledby="modalNewPostLabel" aria-hidden="true">
                    <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="modalNewPostLabel">New Post</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <textarea id="txtPost" class="form-control txtPost" autofocus name="username" rows="8"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button onClick={sendNewPost} type="button" class={disableButton ? 'btn btn-primary disabled' : 'btn btn-primary'} >Post</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};