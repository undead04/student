import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { logout, refresh } from "../../store/reduces/auth";
import SystemService, { ISystem } from "../../servers/systemServer";
const Header = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const role = userInfo?.user.role;
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );
  const [system, setSystem] = useState<Partial<ISystem>>();
  const loadData = async () => {
    try {
      await SystemService.get().then((res) => setSystem(res.data));
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  console.log(!role?.includes("teacher"), role);
  return (
    <>
      <nav className="navbar navbar-expand-lg  bg-success">
        <div className="container ">
          <a className="navbar-brand" href="#">
            <img
              src={system?.logo}
              className="img-fluid"
              alt="logo"
              width={50}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active link-light"
                  aria-current="page"
                  to="/home"
                  hidden={!role?.includes("student")}
                >
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link link-light"
                  to={"subject"}
                  hidden={!role?.includes("admin")}
                >
                  Quản lí môn học
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link link-light"
                  to={"system"}
                  hidden={!role?.includes("admin")}
                >
                  Quản lí hệ thống
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle link-light"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  hidden={!role?.includes("admin")}
                >
                  Quản lí chung
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="grade">
                      Quản lí khối lớp
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="teacher">
                      Quản lí giáo viên
                    </Link>
                  </li>
                  <li></li>
                  <li>
                    <Link className="dropdown-item" to="student">
                      Quản lí học sinh
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="teacherClassRoom">
                      Gán giáo viên cho lớp
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link link-light"
                  to={"question"}
                  hidden={
                    !["teacher", "admin"].some((item) => role?.includes(item))
                  }
                >
                  Ngân hàng câu hỏi
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link link-light"
                  to={"homework"}
                  hidden={
                    !["teacher", "admin"].some((item) => role?.includes(item))
                  }
                >
                  bài tập về nhà
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link link-light"
                  to={"exam"}
                  hidden={
                    !["teacher", "admin"].some((item) => role?.includes(item))
                  }
                >
                  Bài kiểm tra
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav dropdown-center">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle link-light"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userInfo?.user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-start">
                  <li className="nav-item">
                    <Link to={"profile"} className="dropdown-item">
                      Trang cá nhân
                    </Link>
                  </li>
                  <li className="nav-item" onClick={() => dispatch(logout())}>
                    <a className="dropdown-item">Thoát</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
