if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("../../sw.js")
		.then(res => {
			console.log("SW is registered!");
		});
}

function fetchPosts() {
	// if ("indexedDB" in window) {
	// 	readData("posts")
	// 		.then(res => {
	// 			console.log(res);
	// 		})
	// }
	fetch("https://pwa-gram-2dc88.firebaseio.com/posts.json")
		.then(res => res.json())
		.then(data => {
			getElement("#posts").innerHTML = Object.keys(data).map(eachPostKey=>{
	return `
		<div class="each_post_container">
					<h4>${data[eachPostKey].title}</h4>
					<img src="${data[eachPostKey].image}" />
					<div>In ${data[eachPostKey].location}</div>
				</div>
	`
});
			 ;
		})
		.catch(err => {
			console.log(err);
		});
};

function getElement(identifier) {
	return document.querySelector(`${identifier}`);
}

function showMOdal() {
	$('#addNewPostModal').modal('show');
}

function saveNewPost() {
	var title = getElement("#title_input").value;
	var location = getElement("#location_input").value;
	if (imgFile && title && location) {
		getElement("#add_newPost_div").innerHTML = "";
		let storageRef = firebase.storage().ref(imgFile.name);
		let task = storageRef.put(imgFile);
		task.then(res => {
			var img_url = res.metadata.downloadURLs[0];
			let dbRef = firebase.database().ref();
			let id = createUniqueId();
			dbRef.child("posts").child(id).set({
				id,
				title,
				location,
				image: img_url
			});
		});
	} else {
		getElement("#add_newPost_div").innerHTML = "All Fields Are required!";
	}
}
var imgFile;

function saveNewImageForPost() {
	imgFile = getElement("#post_image").files[0];
};

function createUniqueId() {
	return Math.floor(Math.random() * 10000);
}