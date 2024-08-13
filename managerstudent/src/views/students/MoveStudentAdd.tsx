import * as React from "react";
import { useState, useEffect } from "react";
import classService, { IClassRoom } from "../../servers/classServer";
import { IMoveStudentModel } from "../../servers/moveStudentServer";
interface Prop {
  listGrade: string[];
  handleChange: (e: React.FormEvent<HTMLSelectElement>) => void;
  moveStudentModel: IMoveStudentModel;
  grade: string;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
}
const MoveStudentAdd: React.FC<Prop> = ({
  listGrade,
  handleChange,
  moveStudentModel,
  grade,
  setGrade,
}) => {
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  useEffect(() => {
    document.title = "Chuyển lớp cho học sinh";
    if (grade) {
      classService.list(grade).then((res) => setListClassRoom(res.data));
    }
  }, [grade]);
  return (
    <>
      <div className="row mt-3">
        <div className="col-4">
          <select
            className="form-select"
            value={grade}
            onChange={(e) => setGrade(e.currentTarget.value)}
          >
            <option value="" hidden>
              Chọn khối
            </option>
            {listGrade.map((item, index) => (
              <option value={item} key={index}>
                Khối {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <select
            className="form-select"
            value={moveStudentModel.classRoomId}
            onChange={handleChange}
            name="classRoomId"
          >
            <option value={""} hidden>
              Chọn lớp
            </option>
            {listClassRoom.map((item, index) => (
              <option value={item._id} key={index}>
                Lớp {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default MoveStudentAdd;
