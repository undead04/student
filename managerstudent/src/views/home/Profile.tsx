import * as React from "react";
import { useState, useEffect } from "react";
import userService, { IInfoUser } from "../../servers/userServer";
import { setuid } from "process";
const Profile = () => {
  const [user, setUser] = useState<Partial<IInfoUser>>();
  const loadData = async () => {
    try {
      await userService.get().then((res) => setUser(res.data));
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <section className="mt-3 ">
        <div className="container bg-body-tertiary border p-3">
          <div className="row">
            <div className="col-1">
              <img src="" alt="" />
            </div>
            <div className="col-auto">{user?.name}</div>
          </div>
        </div>
      </section>
      <section className="mt-3 ">
        <div className="container bg-body-tertiary  p-3">
          <div className="row border g-3">
            <div className="col-12">Thông tin người dùng:</div>
            <div className="col-12 col-lg-6">
              <div className="row">
                <div className="col-12">
                  <p>
                    <strong>Email</strong>: {user?.email}
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    <strong>Mã học sinh</strong>: {user?.codeUser}
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    <strong>Ngày sinh</strong>: {user?.dateOfBirth?.toString()}
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    <strong>Giới tính</strong>: {user?.sex === 0 ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    <strong>
                      Số điện thoại<i></i>
                    </strong>
                    : {user?.phone}
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    <strong>Căn cước công dân</strong>: {user?.cccd}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
