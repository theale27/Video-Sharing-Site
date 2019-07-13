import React, { Component } from "react";
import * as moment from "moment";

const URL =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

// Gets the userId from the hash in the URL
const userId = window.location.hash.split("=") - 1;

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
        // Sorts the list of videos by upload date and reverses it so that it's newest > oldest
        video.reverse(
          video.sort(
            (a, b) =>
              moment(a.uploadedAt).format("YYYYMMDD") -
              moment(b.uploadedAt).format("YYYYMMDD")
          )
        );
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
        fetch(URL + "/profile/")
          .then(response => response.json())
          .then(profile => {
            this.setState({
              profile: profile
            });
          })
      );
  }

  render() {
    // Destructures the state of the fetched objects
    let { video, user, profile } = this.state;

    let videoUploadList = [];
    let recentlyWatchedList = [];

    let uploadedVideoContainer = () => {
      for (let i in video) {
        if (video[i].userId === userId + 1) {
          // Creates and lists each uploaded video
          videoUploadList.push(
            <div className="video_container">
              <div className="video">
                <a href={"video=" + video[i].id} className="video_link">
                  <video preload="metadata" src={video[i].url + "#t=0.5"} />
                </a>
              </div>

              <div className="video_meta">
                <h2 className="title">{video[i].title}</h2>
                <p className="uploadedAt">
                  {moment(video[i].uploadedAt).format("DD MMM Y")}
                </p>
                <p className="description">{video[i].description}</p>
              </div>
            </div>
          );
        }
      }
      if (videoUploadList.length > 0) {
        videoUploadList.unshift(<h3>Uploads</h3>);
      }
      return videoUploadList;
    };

    let recentlyWatchedContainer = () => {
      //! Will need to update this to loop if >1 profile is added
      if (profile.id === userId + 1) {
        //Loops through list of watched videos
        for (let i = 0; i < profile.watched.length; i++) {
          for (let v = 0; v < video.length; v++) {
            //Finds details for matching watched video
            if (video[v].id === profile.watched[i].videoId) {
              for (let u = 0; u < user.length; u++) {
                //Finds uploader's details for matching video
                if (user[u].id === video[v].userId) {
                  // Creates and lists each uploaded video
                  recentlyWatchedList.push(
                    <div className="video_container">
                      <div className="video">
                        <a href={"video=" + video[v].id} className="video_link">
                          <video
                            preload="metadata"
                            src={video[v].url + "#t=0.5"}
                          />
                          <div className="progress_bar_bg">
                            <div
                              className="progress_bar"
                              style={{
                                width: profile.watched[i].percentage + "%"
                              }}
                            />
                          </div>
                        </a>
                      </div>

                      <div className="video_meta">
                        <h2 className="title">{video[v].title}</h2>
                        <a href={"profile=" + user[u].id} className="name">
                          {user[u].name}
                        </a>
                        <p className="lastViewed">
                          {"Last watched: " +
                            moment(profile.watched[i].lastViewed).format(
                              "DD MMM Y"
                            )}
                        </p>
                        <p className="description">{video[v].description}</p>
                      </div>
                    </div>
                  );
                }
              }
            }
          }
        }
      }
      // Prepends title to prevent an empty list from being added
      if (recentlyWatchedList.length > 0) {
        recentlyWatchedList.unshift(<h3>Recently Watched</h3>);
      }
      return recentlyWatchedList;
    };

    if (!this.state.profile || !this.state.video || !this.state.user) {
      return null;
    } else {
      return (
        <section>
          <div id="profile_meta">
            <h1 className="name">{user[userId].name}</h1>
            {/* <p id="memberSince">{user[userId].memberSince}</p> */}
            <hr />
          </div>
          <section id="video_upload_list">{uploadedVideoContainer()}</section>
          <section id="video_watched_list">
            {recentlyWatchedContainer()}
          </section>
        </section>
      );
    }
  }
}

export default Video;
