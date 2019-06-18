// Gets the json data
const url =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

// Gets the userId from the hash in the URL
const userId = parseInt(window.location.hash.substr(1));

let fetchVideos = fetch(url + "/videos/").then(response => response.json());

let fetchUsers = fetch(url + "/users/").then(response => response.json());

let fetchProfile = fetch(url + "/profile/").then(response => response.json());

// Combines data from each URL
let data = { fetchVideos: {}, fetchUsers: {}, fetchProfile: {} };

Promise.all([fetchVideos, fetchUsers, fetchProfile])
  .then(function(values) {
    data["fetchVideos"] = values[0];
    data["fetchUsers"] = values[1];
    data["fetchProfile"] = values[2];
    return data;
  })
  .then(data => {
    // Sets the username
    document.getElementsByClassName("name")[0].innerHTML =
      data.fetchUsers[userId - 1].name;

    // Sorts the videos by upload date and reverses it so that it's newest > oldest
    data.fetchVideos.reverse(
      data.fetchVideos.sort(
        (a, b) =>
          moment(a.date).format("YYYYMMDD") - moment(b.date).format("YYYYMMDD")
      )
    );

    // Creates and lists each uploaded video
    for (let i = 0; i < data.fetchVideos.length; i++) {
      // Copies the video container structure so that new videos can be added
      let videoContainer = video_upload_list.children[1].cloneNode(true);
      let currentVideo = data.fetchVideos[i];

      // Lists the uploaded videos for this user
      if (currentVideo.userId == userId) {
        // Sets the video element's source so that it shows a frame
        videoContainer
          .getElementsByClassName("video_link")[0]
          .children[0].setAttribute("src", currentVideo.url + "#t=0.5");

        // Sets the video's URL
        videoContainer
          .getElementsByClassName("video_link")[0]
          .setAttribute("href", "video.html#" + currentVideo.id);

        // Sets the video's title
        videoContainer.getElementsByClassName("title")[0].innerHTML =
          currentVideo.title;

        // Sets the video's description
        videoContainer.getElementsByClassName("description")[0].innerHTML =
          currentVideo.description;

        // Converts the video's upload date format and sets it
        videoContainer.getElementsByClassName(
          "uploadedAt"
        )[0].innerHTML = moment(currentVideo.uploadedAt).format("DD MMM Y");

        // Adds the new videoContainer to the video_list
        video_upload_list.appendChild(videoContainer);
      }
    }

    // Hides the 'uploads list' section if empty
    if (
      video_upload_list.getElementsByClassName("video_container").length == 1
    ) {
      video_upload_list.style.display = "none";
    }

    // Sorts the videos by upload date and reverses it so that it's newest > oldest
    data.fetchProfile.watched.reverse(
      data.fetchProfile.watched.sort(
        (a, b) =>
          moment(a.lastviewed).format("YYYYMMDD") -
          moment(b.lastviewed).format("YYYYMMDD")
      )
    );

    // Create and lists each recently watched video
    if (data.fetchProfile.id == userId) {
      memberSince.innerHTML =
        "Member since " +
        moment(data.fetchProfile.memberSince).format("DD-MMM-YYYY");

      // Loops through and adds recently watched videos
      for (let i = 0; i < data.fetchProfile.watched.length; i++) {
        // Copies the video container structure so that new videos can be added
        let watchedVideoContainer = video_watched_list.children[1].cloneNode(
          true
        );

        for (let v = 0; v < data.fetchVideos.length; v++) {
          let currentVideo = data.fetchVideos[v];

          //Loops through videos for matching id's
          if (data.fetchVideos[v].id == data.fetchProfile.watched[i].videoId) {
            // Sets the video's source so that it shows a frame
            watchedVideoContainer
              .getElementsByClassName("video_link")[0]
              .children[0].setAttribute("src", currentVideo.url + "#t=0.5");

            // Sets the video's URL
            watchedVideoContainer
              .getElementsByClassName("video_link")[0]
              .setAttribute("href", "video.html#" + currentVideo.id);

            // Sets the video's percentage watched
            watchedVideoContainer
              .getElementsByClassName("progress_bar")[0]
              .setAttribute(
                "style",
                "width: " + data.fetchProfile.watched[i].percentage + "%;"
              );

            // Set the video's title
            watchedVideoContainer.getElementsByClassName("title")[0].innerHTML =
              currentVideo.title;

            // Sets the video's description
            watchedVideoContainer.getElementsByClassName(
              "description"
            )[0].innerHTML = currentVideo.description;

            // Converts the video's upload date format and sets it
            watchedVideoContainer.getElementsByClassName(
              "lastViewed"
            )[0].innerHTML =
              "Last watched: " +
              moment(currentVideo.uploadedAt).format("DD MMM Y");

            // Sets each uploader's name and link to their profile
            for (let u = 0; u < data.fetchUsers.length; u++) {
              if (data.fetchUsers[u].id == currentVideo.userId) {
                let name = watchedVideoContainer.getElementsByClassName(
                  "name"
                )[0];

                // Sets the username
                name.innerHTML = data.fetchUsers[u].name;

                // Sets the link
                name.setAttribute(
                  "href",
                  "profile.html#" + data.fetchUsers[u].id
                );
              }
            }

            // Adds the new watchedVideoContainer to the video_list
            video_watched_list.appendChild(watchedVideoContainer);
          }
        }
      }
    }
    // Hides the 'watched list' if it's empty
    if (
      video_watched_list.getElementsByClassName("video_container").length == 1
    ) {
      video_watched_list.style.display = "none";
    }
  })
  .catch(error => console.error(error));
