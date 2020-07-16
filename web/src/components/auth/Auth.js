import React from "react";
import "./Auth.css";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: true,
      username: "",
      password: "",
      image: null,
      imageURL: null,
      loading: false,
      error: null,
    };
  }

  handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { username, password } = this.state;
      if (!username || !password) {
        return;
      }
      this.setState({ loading: true });
      const resp = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { username, password, image } = this.state;
      if (!username || !password || !image) {
        return;
      }
      this.setState({ loading: true });
      const data = new FormData();
      data.append("image", image);
      data.append("username", username);
      data.append("password", password);
      await fetch("/api/signup", {
        method: "POST",
        body: data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ image: file, imageURL: URL.createObjectURL(file) });
    }
  };

  handleSwitch = (e) => {
    e.preventDefault();
    this.setState({ signin: !this.state.signin, username: "", password: "", image: null, imageURL: null });
  };

  renderSignin = () => {
    const { username, password } = this.state;
    return (
      <div className="auth">
        <img src="images/background/background.png" alt="Background" />
        <form onSubmit={this.handleSignin}>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            autoComplete="off"
            name="username"
            value={username}
            onChange={this.handleInput}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={password}
            onChange={this.handleInput}
          />
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="remember-me" />
            <label className="form-check-label" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Let&apos;s go
          </button>
          <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
            New player? Sign up here!
          </button>
        </form>
      </div>
    );
  };

  renderSignup = () => {
    const { username, password, imageURL } = this.state;
    return (
      <div className="auth">
        <img src="images/background/background.png" alt="Background" />
        <form onSubmit={this.handleSignup}>
          <div className="image-input">
            {imageURL && <img src={imageURL} />}
            <input type="file" accept="image/*" onChange={this.handleImage} />
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            autoComplete="off"
            name="username"
            value={username}
            onChange={this.handleInput}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={password}
            onChange={this.handleInput}
          />
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="remember-me" />
            <label className="form-check-label" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Let&apos;s go
          </button>
          <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
            Already a player? Sign in here!
          </button>
        </form>
      </div>
    );
  };

  render() {
    if (this.state.signin) {
      return this.renderSignin();
    }
    return this.renderSignup();
  }
}

export default Auth;
