import React from "react";
import "./Auth.css";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignin: true,
      username: "",
      password: "",
      image: undefined,
    };
  }

  handleSignin = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
    } catch (err) {}
  };

  handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("image", this.state.image);

      const resp = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
    } catch (err) {}
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImage = (e) => {
    console.log(e.target.files[0]);
  };

  handleSwitch = (e) => {
    e.preventDefault();
    this.setState({ isSignin: !this.state.isSignin, username: "", password: "", image: null });
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
            Let's go
          </button>
          <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
            New player? Sign up here!
          </button>
        </form>
      </div>
    );
  };

  renderSignup = () => {
    const { username, password } = this.state;
    return (
      <div className="auth">
        <img src="images/background/background.png" alt="Background" />
        <form onSubmit={this.handleSignup}>
          <div className="image-input">
            <input type="file" accept="image/*" onChange={this.handleImage} />
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
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
            Let's go
          </button>
          <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
            Already a player? Sign in here!
          </button>
        </form>
      </div>
    );
  };

  render() {
    if (this.state.isSignin) {
      return this.renderSignin();
    }
    return this.renderSignup();
  }
}

export default Auth;
