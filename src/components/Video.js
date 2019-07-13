import React, { Component } from "react";
import * as moment from "moment";

const URL =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

// Gets the videoId from the hash in the URL
const videoId = window.location.hash.substr(1) - 1;

class Video extends Component {
  constructor(props) {
    super(props);
    // Assigns state, and a default value for the data
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    fetch(URL + "/videos/")
      .then(response => response.json())
      .then(video => {
        this.setState({
          video: video
        });
      })
      .then(
        fetch(URL + "/users/")
          .then(response => response.json())
          .then(user => {
            this.setState({
              user: user
            });
          })
      )
      .then(
        fetch(URL + "/comments/")
          .then(response => response.json())
          .then(comment => {
            this.setState({
              comment: comment
            });
            // Sorts the list of videos by upload date and reverses it so that it's newest > oldest
            comment.reverse(
              comment.sort(
                (a, b) =>
                  moment(a.date).format("YYYYMMDD") -
                  moment(b.date).format("YYYYMMDD")
              )
            );
          })
      );
  }

  render() {
    // Destructures the state of the fetched objects
    let { video, user, comment } = this.state;

    let uploaderName = null;
    let videoDescription = null;
    let commentsList = [];

    //Prevents the data from being added before it's been fetched
    if (!this.state.video) {
      return null;
    } else {
      // Finds the uploaders username
      for (var i in user) {
        if (video[videoId].userId === user[i].id) {
          uploaderName = user[i].name;
        }
      }

      // Implements any linebreaks in the description
      videoDescription = video[videoId].description;

      videoDescription.replace(/(?:\r\n|\r|\n)/g, "<br>");

      //! NOT WORKING
      // Converts any links in the description from plain text
      videoDescription.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    }

    let videoComments = () => {
      for (var i in comment) {
        if (comment[i].videoId - 1 === videoId) {
          for (var u in user) {
            if (user[u].id === comment[i].userId) {
              commentsList.push(
                <div className="comment_container">
                  <a className="comment_user" href={"profile#" + user[u].id}>
                    {user[u].name}
                  </a>
                  <span className="comment_date">
                    {" ~ " + moment(comment[i].date).format("DD MMM Y")}
                  </span>
                  <p className="comment_body">{comment[i].body}</p>
                </div>
              );
            }
          }
        }
      }
      commentsList.unshift(
        <p id="comment_count">{commentsList.length - 1 + " Comments"}</p>
      );
      return commentsList;
    };

    if (!this.state.video) {
      return null;
    } else {
      return (
        <section id="video_main">
          <section id="mainVideoMeta">
            <div id="video_container">
              <div id="video">
                <video
                  controls
                  autoPlay
                  preload="auto"
                  src={video[videoId].url}
                />
              </div>
            </div>

            <div id="video_meta">
              <h2 id="title">{video[videoId].title}</h2>
              <p>
                <a id="name" href={"profile#" + video[videoId].userId}>
                  {uploaderName}
                </a>
                <span id="uploadedAt">
                  {" ~ uploaded on " +
                    moment(video[videoId].uploadedAt).format("DD MMM Y")}
                </span>
              </p>
              <p id="description">{videoDescription}</p>
              <hr />
            </div>
          </section>
          <div id="video_comments">{videoComments()}</div>
        </section>
      );
    }
  }
}

export default Video;
