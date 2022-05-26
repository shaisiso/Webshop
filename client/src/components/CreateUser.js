import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import PopupMessage from "./PopupMessage";
import RecaptchaWrapper from "./RecaptchaWrapper";

class CreateUser extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassowrd: "",

    validation: {
      captchaVerified: false,
      succeeded: false,
      showErrors: false,
      validateChanger: false,
      msg: ''
    }
  };
  onChangeFirstName = (e) => {
    this.setState({ firstName: e.target.value });
  };
  onChangeLastName = (e) => {
    this.setState({ lastName: e.target.value });
  };
  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };
  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };
  onChangeRepeatPassword = (e) => {
    this.setState({ repeatPassowrd: e.target.value });
  };
  validateFields() {
    return this.state.validation.captchaVerified &&
      this.state.password === this.state.repeatPassowrd &&
      this.state.password.length > 6;
  }
  onSubmit = (e) => {
    e.preventDefault();
    const userObject = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      repeatPassword: this.state.repeatPassowrd,
    };

    if (this.validateFields()) {
      axios
        .post("/api/sign-up", userObject)
        .then((res) => {
          console.log(res.data);
          this.setState({
            validation: {
              ...this.state.validation,
              succeeded: true, tryValidate: false,
            }
          });
        })
        .catch((AxiosError) => {
          console.log(AxiosError.response);
          this.setState({
            validation: {
              ...this.state.validation,
              succeeded: false,
              showErrors: !this.state.validation.showErrors,
              validateChanger: true,
              msg: AxiosError.response.data.error
            }
          });
        });

    } else {

      this.setState({
        validation: {
          ...this.state.validation,
          succeeded: false,
          showErrors: !this.state.validation.showErrors,
          validateChanger: true,
          msg: ''
        }
      });
    }
  };

  //this is for rerendering the errors popup if needed
  componentDidUpdate() {
    if (this.state.validation.validateChanger && !this.state.validation.showErrors)
      this.setState({
        validation: {
          ...this.state.validation,
          showErrors: !this.state.validation.showErrors,
        }
      })
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                <div className="col-lg-7">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">
                        Create an Account!
                      </h1>
                    </div>
                    <form className="user" onSubmit={this.onSubmit}>
                      <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            id="exampleFirstName"
                            required
                            placeholder="First Name"
                            value={this.state.firstName}
                            onChange={this.onChangeFirstName}
                          />
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            id="exampleLastName"
                            required
                            placeholder="Last Name"
                            value={this.state.lastName}
                            onChange={this.onChangeLastName}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          id="exampleInputEmail"
                          placeholder="Email Address"
                          required
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                        />
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            required
                            value={this.state.password}
                            onChange={this.onChangePassword}
                          />
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="password"
                            required
                            className="form-control form-control-user"
                            id="exampleRepeatPassword"
                            placeholder="Repeat Password"
                            value={this.state.repeatPassowrd}
                            onChange={this.onChangeRepeatPassword}
                          />
                        </div>
                      </div>
                      <div className="form-group d-flex justify-content-center">
                        <RecaptchaWrapper
                          afterVerify={(isVerified, data) => this.setState({
                            validation: {
                              ...this.state.validation,
                              captchaVerified: isVerified
                            }
                          })}
                        />
                      </div>
                      <input
                        type="submit"
                        value="Register Account"
                        className="btn btn-primary btn-user btn-block"
                      />
                    </form>
                    <hr />
                    <div className="text-center">
                      <Link className="small" to={"/forgot-password"}>
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link className="small" to={"/sign-in"}>
                        Already have an account? Login!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.validation.succeeded ?
          <PopupMessage
            title={"Registration Succeed"}
            p={this.state.validation.validateChanger}
            body={
              <div >
                <div className="text-black">Hi {this.state.firstName}, Welcome to our shop !!</div>
                <div className="text-black font-weight-bold">We've sent you a verification email, You will be able to login only after approve </div>
                <div className="text-black  mt-3">Your details:</div>
                <div className="ml-2 mt-1">
                  <div >First Name : {this.state.firstName}</div>
                  <div>Last Name :{this.state.lastName}</div>
                  <div>Email : {this.state.email}</div>
                </div>
              </div>
            }
            withOk={true}
            navigateTo="/sign-in"
            okBtnText="Go to login page"
            closeOnlyWithBtn={true}
            onClose={() => {
              this.setState({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                repeatPassowrd: "",

                validation: {
                  captchaVerified: this.state.validation.captchaVerified,
                  succeeded: false,
                  showErrors: false,
                  validateChanger: false
                }
              }
              )
            }}

          />
          :
          null
        }
        {this.state.validation.showErrors ?
          <PopupMessage
            title="Error"
            body={
              <div className="text-black">
                {
                  this.state.validation.msg ?
                    <div>{this.state.validation.msg}</div>
                    :

                    !this.state.validation.captchaVerified ?
                      <div>Recaptcha is necessary</div>
                      :
                      <>
                        <div>Password do not match requirements: </div>
                        <div>*Password length must be atleast 6 characters </div>
                        <div>*Password and RepeatPassword should match!</div>
                      </>
                }

              </div>
            }
          />
          :
          null
        }
      </div >
    );
  }
}

export default CreateUser;
