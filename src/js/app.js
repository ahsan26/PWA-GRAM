if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("../../sw.js")
		.then(res => {
			console.log("SW is registered!");
		});
}
db.child("posts").on("value", function (snapshot) {
	if (snapshot.val() !== undefined && snapshot.val() !== null && Object.keys(snapshot.val()).length !== 0) {
		removeAllDataFromLocalDB("posts");
		Object.keys(snapshot.val()).forEach(post_key => {
			writeData(snapshot.val()[post_key], "posts");
			renderPosts();
		});
	}
});


let netWorkStatus = true;

function checkNetwork() {
	if (navigator.onLine) {
		showSnackbarOfNetwork("Connection Established!");
	} else {
		showSnackbarOfNetwork("Connection Lost!");
	};
}
window.addEventListener("online", function () {
	checkNetwork()
	netWorkStatus = true;
});
window.addEventListener("offline", function () {
	checkNetwork()
	netWorkStatus = false;
});

function showSnackbarOfNetwork(message) {
	var data = {
		message: `${message}`,
		timeout: 2000,
		actionText: 'OK'
	};
	var snackbarContainer = document.querySelector('#notification');
	snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function renderPosts() {
	readData("posts")
		.then(posts => {
			document.querySelector("#posts").innerHTML = posts.map(eachPost => `
			<div class="each_post_container">
				<div class="eachPost_close_container">
					<i onClick="deletePost('${eachPost.id}');" class="material-icons">close</i>
				</div>	   
						<h4>${eachPost.title}</h4>
						<img src="${eachPost.image}" />
						<div class="eachPost_location">In ${eachPost.location}</div>
					</div>
		`);
		});
}

function fetchPosts() {
	fetch("https://pwa-gram-2dc88.firebaseio.com/posts.json")
		.then(res => res.json())
		.then(data => {
			renderPosts();
		})
		.catch(err => {
			renderPosts();
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
		let img_url = res.metadata.downloadURLs[0];
		let id = createUniqueId();
		var dataOfPost = {
			id,
			title,
			location,
			image: img_url
		};
		if (netWorkStatus) {
			task.then(res => {
				let dbRef = firebase.database().ref();
				dbRef.child("posts").child(id).set(dataOfPost);
				hideModal();
				getElement("#title_input").value = "";
				getElement("#location_input").value = "";
				getElement("#post_image").value = "";
			});
		} else {
			if ("serviceWorker" in navigator && "SyncManager" in window) {
				navigator.serviceWorker.ready
					.then(sw => {
						writeData(dataOfPost, "sync-posts").then(res => {
							return sw.sync.register("sync-new-post")
							.then(_=>{
								showSnackbarOfNetwork("Your post was saved to sync!");
							})
						});
					})
			}
		}
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

function hideModal() {
	$('#addNewPostModal').modal('hide');
}

function deletePost(id) {
	db.child("posts").child(id).remove();
}