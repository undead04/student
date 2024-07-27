import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import { ISubjectDetailModel } from "../../servers/subjectDetailServer";
import {
  IValidationSubject,
  IValidationSubjectDetail,
} from "../../models/Validation";
import SelectReact from "../../Components/SelectReact";
import { ISubject } from "../../servers/subjectServer";

interface PropAdd {
  defaultValue: ISubjectDetailModel;
  nameFCChangeInput: any;
  message: IValidationSubjectDetail;
  nameFCChangeSelect: any;
  nameFCChangeArray: any;
  handleAddContent: any;
  handleRemoveContent: any;
  handleAdd: any;
  handleToggle: any;
  loadData?: any;
  listSubject: ISubject[];
  messageSubject?: IValidationSubject;
  open: boolean;
  isUpdate: boolean;
  handleFile: any;
}
const SubjectDetailAdd: React.FC<PropAdd> = ({
  defaultValue,
  nameFCChangeSelect,
  message,
  nameFCChangeInput,
  nameFCChangeArray,
  handleRemoveContent,
  handleAddContent,
  listSubject,
  messageSubject,
  handleToggle,
  open,
  handleAdd,
  isUpdate,
  handleFile,
}) => {
  const [subject, setSubject] = useState<ISubject>();
  const listGrade = ["10", "11", "12"];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (defaultValue.subjectId) {
      let objectSubject = listSubject.find(
        (item) => item._id === defaultValue.subjectId
      );
      setSubject(objectSubject);
    }
    setLoading(false);
  }, []);
  return (
    <>
      {loading === false ? (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <SelectReact
              isMul={false}
              name="subjectId"
              label="Môn học"
              defaultValue={[
                {
                  value: subject?._id || "",
                  label: subject?.name || "",
                },
              ]}
              option={listSubject.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
              nameHandle={nameFCChangeSelect}
              message={message?.subjectId}
            />
            {isUpdate === false ? (
              <>
                <button
                  className="btn btn-success mt-3 mb-3"
                  onClick={handleToggle}
                >
                  Thêm mới
                </button>
                {open === true ? (
                  <>
                    <Input
                      label="Tên môn học"
                      name="name"
                      message={messageSubject?.name}
                      onChange={nameFCChangeInput}
                    />
                    <button
                      className="btn btn-success mt-3"
                      onClick={handleAdd}
                    >
                      Lưu
                    </button>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="col-12 col-lg-6">
            <Input
              label="Hình ảnh"
              type="file"
              name="file"
              onChange={handleFile}
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectReact
              isMul={false}
              name="grade"
              label="Lớp"
              defaultValue={[
                {
                  value: defaultValue.grade.toString(),
                  label: defaultValue.grade.toString(),
                },
              ]}
              option={listGrade.map((item) => ({
                value: item,
                label: item,
              }))}
              nameHandle={nameFCChangeSelect}
              message={message?.className}
            />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="" className="form-label">
              Mục lục <span className="text-danger fw-bold">*</span>:
            </label>
            <div
              className="container border border-1 overflow-y-scroll"
              style={{ maxHeight: 190 }}
            >
              {loading === false &&
                defaultValue.tableOfContents.length > 0 &&
                defaultValue.tableOfContents.map((item, index) => (
                  <>
                    <div className="row" key={index}>
                      <div className="col">
                        <input
                          type="text"
                          className="border-0"
                          value={item}
                          name="tableOfContent"
                          onChange={(e) => nameFCChangeArray(index, e)}
                        />
                      </div>
                      <div className="col-auto">
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => handleRemoveContent(index)}
                        ></i>
                      </div>
                    </div>
                  </>
                ))}
            </div>
            <div className="bg-success mt-2">
              <i className="fa-solid fa-plus " onClick={handleAddContent}></i>
              <span>Thêm mới</span>
            </div>
          </div>
          <div className="col-12 text-center" style={{ height: 200 }}>
            <img
              src={defaultValue?.image}
              className="object-fit-sm-contain h-100 rounded "
              alt=""
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default SubjectDetailAdd;
