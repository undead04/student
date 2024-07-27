import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import { IValidationClassRoom } from "../../models/Validation";
import SelectReact from "../../Components/SelectReact";

import CollapseReact from "../../Components/CollapseReact";
import { IClassRoomModel } from "../../servers/classServer";
interface PropAdd {
  defaultValue: IClassRoomModel;
  nameFCChangeInput: any;
  message: IValidationClassRoom;
  nameFCChangeSelect: any;
  listGrade: string[];
}
const GradeAdd: React.FC<PropAdd> = ({
  defaultValue,
  nameFCChangeSelect,
  message,
  nameFCChangeInput,
  listGrade,
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {loading === false ? (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <Input
              name="grade"
              label="Khối"
              onChange={nameFCChangeInput}
              message={message.grade}
              disabled
              defaultValue={`Khối ${defaultValue.grade}`}
              readOnly
            />
          </div>
          <div className="col-12 col-lg-6">
            <Input
              name="name"
              label="Tên lớp"
              onChange={nameFCChangeInput}
              message={message.name}
              defaultValue={defaultValue.name}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default GradeAdd;
