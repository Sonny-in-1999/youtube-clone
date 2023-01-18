const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    //getter(get the value)
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        return;
    }
    const {status} = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
            //express에게 사용자가 json을 보내고 있음을 인식시켜줌
        },
        body: JSON.stringify({text}),
    });
    textarea.value = "";
    //setter(set the value)
    if(status === 201) {
        addComment(text)
    }
};

if(form){
    form.addEventListener("submit", handleSubmit);
}