// Gets the json data
const url =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

// Gets the videoId from the hash in the URL
const videoId = window.location.hash.substr(1);

let fetchVideos = fetch(url + "/videos/").then(response => response.json());

let fetchUsers = fetch(url + "/users/").then(response => response.json());

let fetchComments = fetch(url + "/comments").then(response => response.json());

// Combines data from each URL
let data = { fetchVideos: {}, fetchUsers: {}, fetchComments: {} };

Promise.all([fetchVideos, fetchUsers, fetchComments])
  .then(function(values) {
    data["fetchVideos"] = values[0];
    data["fetchUsers"] = values[1];
    data["fetchComments"] = values[2];
    return data;
  })
  .then(data => {
    // Stores the main video
    const mainVideo = data.fetchVideos[videoId - 1];

    // Video src
    video.children[0].setAttribute("src", mainVideo.url);

    // Video Title
    title.innerHTML = mainVideo.title;

    // Video Upload Date (converted)
    uploadedAt.innerHTML += moment(mainVideo.uploadedAt).format("DD MMM Y");

    // Sets the Video Description (includes linebreaks)
    // Converts any links in the description from plain text
    let descriptionConvert = mainVideo.description.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1">$1</a>'
    );

    // Implements any linebreaks in the description
    description.innerHTML = descriptionConvert.replace(
      /(?:\r\n|\r|\n)/g,
      "<br>"
    );

    // Sets the uploader's name and adds a link to their profile page
    for (let i = 0; i < data.fetchUsers.length; i++) {
      if (data.fetchUsers[i].id == mainVideo.userId) {
        let name = document.getElementById("name");

        name.innerHTML = data.fetchUsers[i].name;
        name.setAttribute("href", "profile.html#" + data.fetchUsers[i].id);
      }
    }

    // Removes unrelated comments, converts the dates, and sorts them
    for (let i = 0; i < data.fetchComments.length; i++) {
      // Removes unrelated comments from the list (comments on other videos)
      if (data.fetchComments[i].videoId != mainVideo.id) {
        data.fetchComments.splice(i, 1);
        i--;
      } else if (data.fetchComments[i].videoId == mainVideo.id) {
        // Converts the date to a sortable format
        moment(data.fetchComments[i].date).format("YYYYMMDD");
      }

      // Sorts the comments by date and reverses it so that it's newest > oldest
      data.fetchComments.reverse(
        data.fetchComments.sort(
          (a, b) =>
            moment(a.date).format("YYYYMMDD") -
            moment(b.date).format("YYYYMMDD")
        )
      );
    }

    let commentCount = 0;

    // Creates and lists each comment
    for (let i = 0; i < data.fetchComments.length; i++) {
      // Copies the comment structure so that new comments can be built and added
      let commentContainer = video_comments.children[1].cloneNode(true);

      // Loops through users to find a comment's username
      for (let u = 0; u < data.fetchUsers.length; u++) {
        if (data.fetchUsers[u].id == data.fetchComments[i].userId) {
          let commentUser = commentContainer.getElementsByClassName(
            "comment_user"
          )[0];

          // Sets the username
          commentUser.innerHTML = data.fetchUsers[u].name;

          // Sets the link to the user's profile
          commentUser.setAttribute(
            "href",
            "profile.html#" + data.fetchUsers[u].id
          );
          break;
        }
      }

      // Reformats and adds the comment's date
      commentContainer.getElementsByClassName(
        "comment_date"
      )[0].innerHTML = moment(data.fetchComments[i].date).format("DD MMM Y");

      // Adds the comment's text
      commentContainer.getElementsByClassName("comment_body")[0].innerHTML =
        data.fetchComments[i].body;

      // Adds the comment container to the comment list
      video_comments.appendChild(commentContainer);

      // Counts each comment
      commentCount++;
    }
    // Sets the comment counter after they've been counted
    comment_count.innerHTML = commentCount + " Comments";
  })
  .catch(error => console.error(error));
