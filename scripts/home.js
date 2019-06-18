// Gets the json data
const url =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

let fetchVideos = fetch(url + "/videos/").then(response => response.json());

let fetchUsers = fetch(url + "/users/").then(response => response.json());

// Combines data from each URL
let data = { fetchVideos: {}, fetchUsers: {} };

Promise.all([fetchVideos, fetchUsers])
  .then(function(values) {
    data["fetchVideos"] = values[0];
    data["fetchUsers"] = values[1];
    return data;
  })
  .then(data => {
    // Sorts the list of videos by upload date and reverses it so that it's newest > oldest
    data.fetchVideos.reverse(
      data.fetchVideos.sort(
        (a, b) =>
          moment(a.date).format("YYYYMMDD") -
          moment(b.date).format("YYYYMMDD")
      )
    );

    // Creates and lists each video
    for (let i = 0; i < data.fetchVideos.length; i++) {
      // Copies the video container structure so that new video's can be added
      let videoContainer = video_list.children[1].cloneNode(true);
      let currentVideo = data.fetchVideos[i];

      // Sets the video's source so that it shows a frame instead
      videoContainer
        .getElementsByClassName("video_link")[0]
        .children[0].setAttribute("src", currentVideo.url + "#t=0.5");

      // Sets the URL to the video
      videoContainer
        .getElementsByClassName("video_link")[0]
        .setAttribute("href", "video.html#" + currentVideo.id);

      // Sets the video's title
      videoContainer.getElementsByClassName("title")[0].innerHTML =
        currentVideo.title;

      // Loops through users
      for (let u = 0; u < data.fetchUsers.length; u++) {
        if (data.fetchUsers[u].id == currentVideo.userId) {
          let name = videoContainer.getElementsByClassName("name")[0];

          // Sets the uploader's username
          name.innerHTML = data.fetchUsers[u].name;

          // Sets the link to the uploader's profile
          name.setAttribute("href", "profile.html#" + data.fetchUsers[u].id);
        }
      }

      // Sets the video's description
      videoContainer.getElementsByClassName("description")[0].innerHTML =
        currentVideo.description;

      // Converts the format of the video's upload date and sets it
      videoContainer.getElementsByClassName("uploadedAt")[0].innerHTML =
        " ~ " + moment(currentVideo.uploadedAt).format("DD MMM Y");

      // Adds the currentVideo to the video_list
      video_list.appendChild(videoContainer);
    }
  })
  .catch(error => console.error(error));
