if("serviceWorker" in navigator){
		navigator.serviceWorker.register("/sw.js")
		.then(res=>{
			console.log("SW is registered!");
		});
}
function fetchPosts(){
	fetch("https://pwa-gram-2dc88.firebaseio.com/posts.json")
	.then(res=>res.json())
	.then(data=>{
		getElement("#posts").innerHTML = `
		<div class="each_post_container">
					<h4>${data.first_post.title}</h4>
					<img src="${data.first_post.image}" />
					<div>In ${data.first_post.location}</div>
				</div>
	`;
	})
	.catch(err=>{console.log(err);});
};

function getElement(identifier){
	return document.querySelector(`${identifier}`);
}
function showMOdal(){
	$('#addNewPostModal').modal('show')
}
// getElement("#newPostBTN").addEventListener("click",_ => {
//
// });
