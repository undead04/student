import * as React from "react";
import { useState, useEffect } from "react";

import { IValidationTeacherClassRoom } from "../../models/Validation";
import SelectReact from "../../Components/SelectReact";
import { ITeacherClassRoomModel } from "../../servers/teacherClassRoomServer";
import { ITeacher } from "../../servers/teacherServer";
import { ISubjectDetail } from "../../servers/subjectDetailServer";

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
  const getDefaultValue = (
    defaultId: string | undefined,
    list: any[],
    labelField: string
  ) => {
    if (!defaultId) return [];
    const item = list.find((item) => item._id === defaultId);
    return item ? [{ value: defaultId, label: item[labelField] }] : [];
  };
  console.log(
    listSubject.find((item) => item._id === defaultValue.subjectDetailId)
      ?.subject.name ?? ""
  );
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
                label:
                  listSubject.find(
                    (item) => item._id === defaultValue.subjectDetailId
                  )?.subject.name ?? "",
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
            option={listTeacher.map((item, index) => ({
              value: item._id,
              label: item.name,
            }))}
            message={message.teacherId}
            defaultValue={getDefaultValue(
              defaultValue.teacherId,
              listTeacher,
              "name"
            )}
          />
        </div>
      </div>
    </>
  );
};

export default ClassTeacherAdd;
