import React from "react";
import "./Auth.css";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: true,
      username: "",
      password: "",
      rememberMe: true,
      image: null,
      imageURL: null,
      error: "",
      loading: false,
    };
  }

  handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { username, password, rememberMe } = this.state;
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
      }).then((res) => res.json());
      const { error, token, ...player } = resp;
      if (error) {
        this.setState({ error });
      } else {
        if (rememberMe) {
          localStorage.setItem("token", token);
        }
        this.props.setPlayer(player);
      }
    } catch (err) {
      this.setState({ error: err });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { username, password, image, rememberMe } = this.state;
      if (!username || !password || !image) {
        return;
      }
      this.setState({ loading: true });
      const data = new FormData();
      data.append("image", image);
      data.append("username", username);
      data.append("password", password);
      const resp = await fetch("/api/signup", {
        method: "POST",
        body: data,
      }).then((res) => res.json());
      const { error, token, ...player } = resp;
      if (error) {
        this.setState({ error });
      } else {
        if (rememberMe) {
          localStorage.setItem("token", token);
        }
        this.props.setPlayer(player);
      }
    } catch (err) {
      this.setState({ error: err });
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
    this.setState({ signin: !this.state.signin, username: "", password: "", image: null, imageURL: null, error: "" });
  };

  renderSignin = () => {
    const { username, password, rememberMe, error, loading } = this.state;
    return (
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
          <input
            type="checkbox"
            className="form-check-input"
            id="remember-me"
            checked={rememberMe}
            onChange={() => this.setState({ rememberMe: !rememberMe })}
          />
          <label className="form-check-label" htmlFor="remember-me">
            Remember me
          </label>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Let's go"
          )}
        </button>
        <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
          New player? Sign up here!
        </button>
      </form>
    );
  };

  renderSignup = () => {
    const { username, password, imageURL, rememberMe, error, loading } = this.state;
    return (
      <form onSubmit={this.handleSignup}>
        <div className="image-input">
          {imageURL && <img src={imageURL} alt="Avatar" />}
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
          <input
            type="checkbox"
            className="form-check-input"
            id="remember-me"
            checked={rememberMe}
            onChange={() => this.setState({ rememberMe: !rememberMe })}
          />
          <label className="form-check-label" htmlFor="remember-me">
            Remember me
          </label>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Let's go"
          )}
        </button>
        <button type="button" className="btn btn-block" onClick={this.handleSwitch}>
          Already a player? Sign in here!
        </button>
      </form>
    );
  };

  renderSigninOrSignup = () => {
    if (this.state.signin) {
      return this.renderSignin();
    }
    return this.renderSignup();
  };

  render() {
    return (
      <div className="auth">
        <img className="background" src="images/background/background.png" alt="Background" />
        <div className="form">{this.renderSigninOrSignup()}</div>
      </div>
    );
  }
}

export default Auth;
