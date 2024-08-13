import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import { IValidationTeacher } from "../../models/Validation";
import SelectReact from "../../Components/SelectReact";
import { ITeacherModel } from "../../servers/teacherServer";
import { ISubject } from "../../servers/subjectServer";
interface PropAdd {
  defaultValue: ITeacherModel;
  nameFCChangeInput: any;
  message: IValidationTeacher;
  nameFCChangeSelect: any;
  listSubject: ISubject[];
  status: boolean;
}
const TeacherAdd: React.FC<PropAdd> = ({
  defaultValue,
  nameFCChangeSelect,
  message,
  nameFCChangeInput,
  listSubject,
  status,
}) => {
  const [subject, setSubject] = useState<ISubject[]>([]);
  const [loading, setLoading] = useState(true);
  const listSex = ["Nam", "Nữ"];
  useEffect(() => {
    if (defaultValue.subjectId) {
      const objectSubject = listSubject.reduce(
        (newArray: ISubject[], currentValue: ISubject) => {
          if (defaultValue.subjectId.indexOf(currentValue._id) != -1) {
            newArray.push(currentValue);
          }
          return newArray;
        },
        []
      );
      setSubject(objectSubject);
    }
    setLoading(false);
  }, [subject]);

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
              label="Mã giáo viên"
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
            <SelectReact
              isMul={true}
              label="Môn học"
              name="subjectId"
              nameHandle={nameFCChangeSelect}
              option={listSubject.map((item, index) => ({
                value: item._id,
                label: item.name,
              }))}
              defaultValue={subject.map((item, index) => ({
                value: item._id,
                label: item.name,
              }))}
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
export default TeacherAdd;
