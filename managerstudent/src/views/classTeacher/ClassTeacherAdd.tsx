import * as React from "react";
import { useState, useEffect } from "react";

import { IValidationTeacherClassRoom } from "../../models/Validation";
import SelectReact from "../../Components/SelectReact";
import { ITeacherClassRoomModel } from "../../servers/teacherClassRoomServer";
import { ITeacher } from "../../servers/teacherServer";
import { ISubjectDetail } from "../../servers/subjectDetailServer";
import { ISubject } from "../../servers/subjectServer";

interface PropAdd {
  defaultValue: ITeacherClassRoomModel;
  message: IValidationTeacherClassRoom;
  nameFCChangeSelect: any;
  listSubject: ISubjectDetail[];
  listTeacher: ITeacher[];
}

const ClassTeacherAdd: React.FC<PropAdd> = ({
  defaultValue,
  nameFCChangeSelect,
  message,
  listSubject,
  listTeacher,
}) => {
  const [subjectDetail, setSubjectDetail] = useState<Partial<ISubjectDetail>>();
  const [teacher, setTeacher] = useState<Partial<ITeacher>>();
  useEffect(() => {
    if (defaultValue.subjectDetailId) {
      const objectSubjectDetail = listSubject.find(
        (item) => item._id === defaultValue.subjectDetailId
      );
      setSubjectDetail(objectSubjectDetail);
    } else {
      setSubjectDetail(undefined);
    }
    if (defaultValue.teacherId) {
      const objectTeacher = listTeacher.find(
        (item) => item._id === defaultValue.teacherId
      );
      setTeacher(objectTeacher);
    } else {
      setTeacher(undefined);
    }
    console.log(defaultValue.teacherId);
  }, [defaultValue]);

  return (
    <>
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <SelectReact
            isMul={false}
            label="Môn học"
            name="subjectDetailId"
            nameHandle={nameFCChangeSelect}
            message={message.subjectId}
            option={listSubject.map((item, index) => ({
              value: item._id,
              label: item.subject.name,
            }))}
            defaultValue={[
              {
                value: defaultValue.subjectDetailId,
                label: subjectDetail?.subject?.name ?? "",
              },
            ]}
          />
        </div>
        <div className="col-12 col-lg-6">
          <SelectReact
            isMul={false}
            label="Giáo viên"
            name="teacherId"
            nameHandle={nameFCChangeSelect}
            option={listTeacher
              .filter((item) =>
                item.subject
                  .map((item) => item._id)
                  .includes(subjectDetail?.subject?._id ?? "")
              )
              .map((item, index) => ({
                value: item._id,
                label: item.name,
              }))}
            message={message.teacherId}
            defaultValue={[
              {
                label: teacher?.name ?? "",
                value: teacher?._id ?? "",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default ClassTeacherAdd;
