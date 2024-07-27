import * as React from "react";
import { useState } from "react";
import Input from "../../Components/Input";
import authService, { ILoginModel } from "../../servers/authServer";
import { error } from "console";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { login } from "../../store/reduces/auth";
import { toast } from "react-toastify";
const Login = () => {
  const [loginModel, setLoginModel] = useState<ILoginModel>({
    username: "",
    password: "",
  });
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setLoginModel({
      ...loginModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      await authService.login(loginModel).then((res) => {
        dispatch(
          login({
            token: res.data.accessToken,
            resfreshToken: res.data.refreshToken,
            userInfo: res.data,
          })
        );
        handleNavigate(res.data.user.role);
      });
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      toast.error("Mật khẩu hoặc tên đăng nhập  sai");
    }
  };
  const handleNavigate = (role: string[]) => {
    if (role.includes("student")) {
      navigate("/home");
    } else if (role.includes("teacher")) {
      navigate("/question");
    } else {
      navigate("/subject");
    }
  };
  const dispatch = useDispatch();

  return (
    <section className="bg-body-secondary h-100">
      <React.Fragment>
        <div className="container h-100 w-50  ">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-12 bg-light rounded-4 py-5">
              <div className="container">
                <div className="row justify-content-center align-items-center g-5">
                  <div className="w-75">
                    <div className="col-12 text-center">
                      <img
                        src="https://vio.edu.vn/tin-tuc/wp-content/uploads/2019/06/logo_two-300x88.png"
                        alt="Logo.png"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <Input
                        name="username"
                        label="Tên đăng nhập"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <Input
                        name="password"
                        label="Mật khẩu"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-auto text-center">
                      <button
                        className="btn btn-success text-light rounded-pill px-4 mt-3"
                        onClick={handleLogin}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </section>
  );
};

export default Login;
