import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import {
  IValidationClassRoom,
  IValidationStudent,
} from "../../models/Validation";
import { IStudentModel } from "../../servers/studentServer";
import ReactSelect from "react-select";
import SelectReact from "../../Components/SelectReact";
interface PropAdd {
  defaultValue: IStudentModel;
  nameFCChangeInput: any;
  message: IValidationStudent;
  nameFCChangeSelect: any;
  status: boolean;
}
const StudentAdd: React.FC<PropAdd> = ({
  defaultValue,
  nameFCChangeSelect,
  message,
  nameFCChangeInput,
  status,
}) => {
  const [loading, setLoading] = useState(true);
  const listSex = ["Nam", "Nữ"];
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {loading === false ? (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <Input
              name="name"
              label="Họ và tên"
              onChange={nameFCChangeInput}
              message={message.name}
              defaultValue={defaultValue.name}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="codeUser"
              label="Mã học sinh"
              onChange={nameFCChangeInput}
              message={message.codeUser}
              defaultValue={defaultValue.codeUser}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="email"
              label="Email"
              onChange={nameFCChangeInput}
              message={message.email}
              defaultValue={defaultValue.email}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="dateOfBirth"
              label="Ngày sinh"
              onChange={nameFCChangeInput}
              message={message.dateOfBirth}
              defaultValue={defaultValue.dateOfBirth}
              type="date"
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="phone"
              label="Số điện thoại"
              onChange={nameFCChangeInput}
              message={message.phone}
              defaultValue={defaultValue.phone}
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectReact
              isMul={false}
              label="Giới tính"
              name="sex"
              nameHandle={nameFCChangeSelect}
              option={listSex.map((item, index) => ({
                value: index.toString(),
                label: item,
              }))}
              defaultValue={[
                {
                  value: defaultValue.sex.toString() || "",
                  label: defaultValue.sex == 0 ? "Nam" : "Nữ",
                },
              ]}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="cccd"
              label="Căn cước công dân"
              onChange={nameFCChangeInput}
              message={message.cccd}
              defaultValue={defaultValue.cccd}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="address"
              label="Điện chỉ"
              onChange={nameFCChangeInput}
              message={message.address}
              defaultValue={defaultValue.address}
            />
          </div>
          {status && (
            <>
              <div className="col-12 col-lg-6">
                <Input
                  name="username"
                  label="Tên đăng nhập"
                  onChange={nameFCChangeInput}
                  message={message.username}
                  defaultValue={defaultValue.username}
                />
              </div>
              <div className="col-12 col-lg-6">
                <Input
                  name="password"
                  label="Mật khẩu"
                  onChange={nameFCChangeInput}
                  message={message.password}
                  defaultValue={defaultValue.password}
                  type="password"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default StudentAdd;
