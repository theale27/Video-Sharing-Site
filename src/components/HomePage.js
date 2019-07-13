import React, { Component } from "react";
import * as moment from "moment";

const URL =
  "https://my-json-server.typicode.com/apollo-motorhomes/youtube-test";

class HomePage extends Component {
  constructor(props) {
    super(props);
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
              moment(a.date).format("YYYYMMDD") -
              moment(b.date).format("YYYYMMDD")
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
      );
  }

  render() {
    // Creates and lists each video element
    let videoElement = () => {
      // Removes the need for 'this.state.' when accessing an object
      let { video, user } = this.state;
      // Adds each element to an array then returns them all when the function is called
      let videoContainer = [];

      for (var i in video) {
        for (var u in user) {
          if (user[u].id === video[i].userId) {
            videoContainer.push(
              <div key={i} className="video_container">
                <div className="video">
                  <a href={"video#" + video[i].id} className="video_link">
                    <video preload="metadata" src={video[i].url + "#t=05"} />
                  </a>
                </div>

                <div className="video_meta">
                  <h2 className="title">{video[i].title}</h2>
                  <a href={"profile#" + user[u].id} className="name">
                    {user[u].name}
                  </a>
                  <span className="uploadedAt">
                    {" ~ " + moment(video[i].uploadedAt).format("DD MM Y")}
                  </span>
                  <p className="description">{video[i].description}</p>
                </div>
              </div>
            );
          }
        }
      }
      return videoContainer;
    };

    return (
      <section id="video_list">
        <h1>Latest Videos</h1>
        {videoElement()}
      </section>
    );
  }
}

export default HomePage;
