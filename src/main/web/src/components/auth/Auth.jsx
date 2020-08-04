import axios from "axios";
import React from "react";
import "./Auth.css";

class Auth extends React.Component {
  defaultError = {
    usernameError: "",
    passwordError: "",
    imageError: "",
    error: "",
  };

  defaultState = {
    username: "",
    password: "",
    image: null,
    imageURL: null,
    rememberMe: true,
  };

  state = {
    signin: true,
    loading: false,
    ...this.defaultError,
    ...this.defaultState,
  };

  validate = () => {
    const { signin, username, password, image } = this.state;
    this.setState({ ...this.defaultError });
    if (!username) {
      this.setState({ usernameError: "What's your name? 🤔" });
    } else if (!password) {
      this.setState({ passwordError: "Forgot something? 🤔" });
    } else if (!signin && !image) {
      this.setState({ imageError: "How do you look like? 🤔" });
    } else {
      return true;
    }
    return false;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!this.validate()) {
        return;
      }
      this.setState({ loading: true });
      const { signin, username, password, image, rememberMe } = this.state;
      let promise;
      if (signin) {
        promise = axios.post("/api/login", {
          username,
          password,
          rememberMe,
        });
      } else {
        const data = new FormData();
        data.append("body", JSON.stringify({ username, password, rememberMe }));
        data.append("image", image, { type: image.type });
        promise = axios.post("/api/register", data);
      }
      const resp = await promise;
      const { token } = resp.data;
      localStorage.setItem("token", token);
      this.props.setAuthorization(token);
      await this.props.getPlayer();
    } catch (err) {
      this.setState({ error: err.response.data.message || "Something went wrong 😥" });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCheckbox = () => {
    this.setState((prev) => ({ rememberMe: !prev.rememberMe }));
  };

  handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ image: file, imageURL: URL.createObjectURL(file) });
    }
  };

  handleSwitch = (e) => {
    e.preventDefault();
    this.setState((prev) => ({
      signin: !prev.signin,
      ...this.defaultError,
      ...this.defaultState,
    }));
  };

  render() {
    const {
      signin,
      username,
      password,
      imageURL,
      rememberMe,
      usernameError,
      passwordError,
      imageError,
      error,
      loading,
    } = this.state;
    return (
      <div className="auth">
        <div className="background">
          <img src="images/background/background.png" alt="Background" />
        </div>
        <div className="form animate__animated animate__fadeIn">
          <form onSubmit={this.handleSubmit}>
            {!signin && (
              <div className="text-center">
                <div className="form-image">
                  {imageURL && <img src={imageURL} alt="Avatar" />}
                  <input type="file" accept="image/*" onChange={this.handleImage} />
                </div>
                {imageError && (
                  <div className="form-group">
                    <div className="invalid-feedback d-block">{imageError}</div>
                  </div>
                )}
              </div>
            )}
            <div className="form-group">
              <input
                type="text"
                className={`form-control${usernameError && " is-invalid"}`}
                placeholder="Username"
                autoComplete="off"
                name="username"
                value={username}
                onChange={this.handleInput}
              />
              {usernameError && <div className="invalid-feedback">{usernameError}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                className={`form-control${passwordError && " is-invalid"}`}
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleInput}
              />
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            {error && (
              <div className="form-group">
                <div className="invalid-feedback d-block">{error}</div>
              </div>
            )}
            <div className="form-group form-check">
              <label className="form-check-label" htmlFor="remember-me">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={this.handleCheckbox}
                />
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Let's go"
              )}
            </button>
            <button type="button" className="btn btn-block btn-sm switch-btn" onClick={this.handleSwitch}>
              {signin ? "New player? Sign up here!" : "Already a player? Sign in here!"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Auth;
