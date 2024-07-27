import * as React from "react";
import { useState, useEffect } from "react";
import CollapseReact from "../../Components/CollapseReact";
import classService, {
  IClassRoom,
  IClassRoomModel,
} from "../../servers/classServer";
import { IValidationClassRoom } from "../../models/Validation";
import ModalReact from "../../Components/ModalReact";
import GradeAdd from "./GradeAdd";
import { toast } from "react-toastify";
const GradeView = () => {
  const listGrade = ["10", "11", "12"];
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const [open, setOpen] = useState(false);
  const [classRoomModel, setClassRoomModel] = useState<IClassRoomModel>({
    name: "",
    grade: "",
  });
  const [classRoom, setClassRoom] = useState<Partial<IClassRoom>>();
  const [message, setMessage] = useState<IValidationClassRoom>({
    name: "",
    grade: "",
  });
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    try {
      await classService.list().then((res) => setListClassRoom(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleShow = async (id: string, grade: string) => {
    setClassRoom({
      _id: "",
      name: "",
      grade: grade,
    });
    setMessage({
      name: "",
      grade: "",
    });
    if (id !== "") {
      await handleGet(id);
    } else {
      setClassRoomModel({
        name: "",
        grade: grade,
      });
    }
    setLoadingForm(false);
    setShow(true);
  };
  const handleShowDelete = async (id: string) => {
    await handleGet(id);
    setLoadingForm(false);
    setShowDelete(true);
  };
  const handleCloseDelete = () => {
    setShowDelete(false);
    setLoadingForm(true);
  };
  const handleClose = () => {
    setShow(false);
    setLoadingForm(true);
  };
  const handleSave = async (id: string) => {
    if (id === "") {
      try {
        const response = await classService.add(classRoomModel); // Gọi service để thêm country
        handleClose(); // Đóng modal
        loadData(); // Tải dữ liệu mới
        toast.success("Tạo lớp học thành công");
      } catch (error: any) {
        toast.error("Tạo lớp học thất bại");
        setMessage(error.response.data.errors);
      }
    } else {
      try {
        const response = await classService.update(id, classRoomModel);
        handleClose(); // Đóng modal
        loadData(); // Tải dữ liệu mới
        toast.success("Cập nhập lớp học thành công");
      } catch (error: any) {
        toast.error("Cập nhập lớp học thất bại");
        setMessage(error.response.data.errors);
      }
    }
  };
  const handleGet = async (id: string) => {
    try {
      var repository = await classService.get(id);
      setClassRoom(repository.data);
      setClassRoomModel({
        name: repository.data.name,
        grade: repository.data.grade,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setClassRoomModel({
      ...classRoomModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSelect = (e: string | string[], name: string) => {
    setClassRoomModel({ ...classRoomModel, [name]: e });
  };
  const handleDelete = async (id: string) => {
    try {
      await classService.remove(id);
      handleCloseDelete();
      loadData();
      toast.success("Xóa lớp học thành công");
    } catch (error: any) {
      console.log(error);
      toast.error("Xóa lớp học thất bại");
      handleCloseDelete();
    }
  };
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleSave(classRoom?._id || "")}
        title={
          classRoom?._id === ""
            ? `Thêm lớp học vào khối ${classRoom.grade}`
            : `Sữa lớp học ${classRoom?.name}`
        }
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        data={
          loadingForm === false ? (
            <GradeAdd
              listGrade={listGrade}
              nameFCChangeInput={handleChange}
              nameFCChangeSelect={handleSelect}
              defaultValue={classRoomModel}
              message={message}
            />
          ) : (
            ""
          )
        }
        show={show}
      />
      <ModalReact
        handleClose={handleCloseDelete}
        handleSave={() => handleDelete(classRoom?._id || "")}
        title={`Xóa lớp`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={
          loadingForm === false
            ? `Bạn có chắc chắc muốn xóa ${classRoom?.name} này không`
            : ""
        }
        show={showDelete}
      />
      <div className="container-fluid mt-3">
        <ul className="list-group  list-group-numbered">
          {listGrade.map((item, index) => (
            <div key={index} className="container">
              <li className="list-group-item m-1" aria-disabled="true">
                <div className="row">
                  <div className="col">Khối {item}</div>
                  <div className="col-auto">
                    <button
                      className={`btn btn-primary me-1`} // Sử dụng class 'collapsed' khi collapse không mở
                      aria-expanded={true} // Đặt aria-expanded dựa trên trạng thái của collapse
                      aria-controls={`${index}`}
                      data-bs-target={`#${index}`}
                      data-bs-toggle="collapse"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-success ms-1"
                      onClick={() => handleShow("", item)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </li>
              <div className="container">
                <CollapseReact
                  id={index.toString()}
                  data={
                    <table className="table table-bordered">
                      <thead className="table-success">
                        <tr>
                          <th scope="col">STT</th>
                          <th scope="col">Tên Lớp</th>
                          <th scope="col">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listClassRoom
                          .filter((items) => items.grade == item)
                          .map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.name}</td>
                              <td>
                                <button
                                  className="btn btn-warning me-1"
                                  onClick={() => handleShow(item._id, "")}
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="btn btn-danger ms-1"
                                  onClick={() => handleShowDelete(item._id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  }
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GradeView;
