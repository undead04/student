import * as React from "react";
import { useState, useEffect } from "react";
import { IListExam } from "../../servers/examServer";
import teacherClassRoomService, {
  IListTeacherRoom,
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [listSubject, setListSubject] = useState<ITeacherRoom[]>([]);
  const navigate = useNavigate();
  const loadData = () => {
    teacherClassRoomService
      .getStudent()
      .then((res) => setListSubject(res.data));
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleNavigate = (id: string) => {
    navigate(`/myCourse/${id}`);
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-12">
                <p className="fs-5 fw-bolder">Môn học của tôi </p>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {listSubject.map((item, index) => (
                <div
                  className="col"
                  key={index}
                  onClick={() => handleNavigate(item._id)}
                >
                  <div className="card h-100">
                    <img
                      src={item.subjectDetail.image}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <p className="card-text">
                        {item.subjectDetail.subject.name} -{" "}
                        {item.subjectDetail.grade}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
