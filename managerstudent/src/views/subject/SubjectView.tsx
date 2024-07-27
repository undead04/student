import * as React from "react";
import { useState, useEffect } from "react";
import ModalReact from "../../Components/ModalReact";
import subjectService, {
  GroupedSubjectDetail,
  ISubject,
  ISubjectModel,
} from "../../servers/subjectServer";
import {
  IValidationSubject,
  IValidationSubjectDetail,
} from "../../models/Validation";
import { FilterModel } from "../../models/FilterModel";
import Input from "../../Components/Input";
import subjectDetailService, {
  ISubjectDetail,
  ISubjectDetailModel,
} from "../../servers/subjectDetailServer";
import SubjectDetailAdd from "./SubjectDetailAdd";
import firebaseService from "../../firebase/firebaseServices";
import LoadingReact from "../../Components/LoadingReact";
import { toast } from "react-toastify";
const SubjectView = () => {
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [open, setOpen] = useState(false);
  const [subjectModel, setSubjectModel] = useState<ISubjectModel>({
    name: "",
  });
  const [subject, setSubject] = useState<Partial<ISubject>>({ _id: "" });
  const [messageSubject, setMessageSubject] = useState<IValidationSubject>({
    name: "",
  });
  const [file, setFile] = useState<File>();
  const [isUpdate, setIsUpdate] = useState(false);
  const [subjectDetail, setSubjectDetail] = useState<Partial<ISubjectDetail>>();
  const [subjectDetailModel, setSubjectDetailModel] =
    useState<ISubjectDetailModel>({
      grade: 0,
      subjectId: "",
      tableOfContents: [],
      image: "",
    });
  const [messageSubjectDetail, setMessageSubjectDetail] =
    useState<IValidationSubjectDetail>({
      className: "",
      tableOfContent: "",
      subjectId: "",
    });
  const [show, setShow] = useState(false);
  const [showEidt, setShowEdit] = useState(false);
  const [groupSubjectDetail, setGroupSubjectDetail] = useState<
    GroupedSubjectDetail[]
  >([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    try {
      await subjectService
        .group()
        .then((res) => setGroupSubjectDetail(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
    loadDataSubject();
  }, []);

  const handleShow = async (id: string) => {
    setSubjectDetail({
      _id: "",
      tableOfContents: [],
      grade: 0,
    });
    setFile(undefined);
    setIsUpdate(false);
    setOpen(false);
    setMessageSubjectDetail({
      className: "",
      tableOfContent: "",
      subjectId: "",
    });
    if (id !== "") {
      await handleGet(id);
      setIsUpdate(true);
    } else {
      setSubjectDetailModel({
        subjectId: "",
        grade: 0,
        tableOfContents: [],
        image: "",
      });
    }
    setLoadingForm(false);
    setShow(true);
  };
  const handleShowEdit = async (id: string) => {
    await handleGetSubject(id);
    setMessageSubject({
      name: "",
    });
    setShowEdit(true);
    setLoadingForm(false);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    setLoadingForm(true);
  };
  const handleClose = () => {
    setShow(false);
    setLoadingForm(true);
  };
  const handleSave = async (id: string) => {
    if (id === "") {
      try {
        let url = "";
        if (file) {
          url = await firebaseService.handleUploadFile(file);
          subjectDetailModel.image = url;
        }
        const response = await subjectDetailService.add(subjectDetailModel); // Gọi service để thêm country
        handleClose(); // Đóng modal
        loadData(); // Tải dữ liệu mới
        toast.success("Tạo môn học thành công");
      } catch (error: any) {
        toast.error("Tạo môn học thất bại");
        setMessageSubjectDetail(error.response.data.errors);
      }
    } else {
      try {
        if (subjectDetail?.image && file) {
          await firebaseService.hanldeDeleteImage(subjectDetail?.image);
        }
        if (file) {
          let url = await firebaseService.handleUploadFile(file);
          subjectDetailModel.image = url;
        }
        const response = await subjectDetailService.update(
          id,
          subjectDetailModel
        );
        handleClose(); // Đóng modal
        loadData(); // Tải dữ liệu mới
        toast.success("Cập nhập môn học thành công");
      } catch (error: any) {
        toast.error("Cập nhập môn hcoj thất bại");
        setMessageSubjectDetail(error.response.data.errors);
      }
    }
  };
  const handleGetSubject = async (id: string) => {
    try {
      const response = await subjectService.get(id);
      setSubject(response.data);
      setSubjectModel({
        name: response.data.name,
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleGet = async (id: string) => {
    try {
      var repository = await subjectDetailService.get(id);
      setSubjectDetail(repository.data);
      setSubjectDetailModel({
        grade: repository.data.grade,
        tableOfContents: repository.data.tableOfContents,
        subjectId: repository.data.subject._id,
        image: repository.data.image,
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
    setSubjectModel({
      ...subjectModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleChangeArray = (
    index: number,
    newValue: React.FormEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const newItems: string[] = [...subjectDetailModel.tableOfContents]; // Tạo một bản sao của mảng hiện tại
    newItems[index] = newValue.currentTarget.value; // Cập nhật giá trị mới vào vị trí index
    setSubjectDetailModel({
      ...subjectDetailModel,
      tableOfContents: newItems,
    });
  };
  const handleSelect = (e: string | string[], name: string) => {
    setSubjectDetailModel({ ...subjectDetailModel, [name]: e });
  };
  const handleAddTableOfContents = () => {
    const len = subjectDetailModel.tableOfContents.length + 1;
    setSubjectDetailModel({
      ...subjectDetailModel,
      tableOfContents: [...subjectDetailModel.tableOfContents, `Chương ${len}`],
    });
  };
  const handleDeleteTableOfContents = (index: number) => {
    const newItems = subjectDetailModel.tableOfContents.filter(
      (item, i) => i !== index
    ); // Lọc bỏ phần tử tại vị trí index
    setSubjectDetailModel({
      ...subjectDetailModel,
      tableOfContents: newItems,
    });
  };
  const handleAdd = async () => {
    try {
      await subjectService.add(subjectModel);
      handleToggle();
      loadDataSubject();
      toast.done("Tạo thành công");
    } catch (error: any) {
      toast.error("Tạo thất bại");
      setMessageSubject(error.response.data.error);
    }
  };
  const handleEdit = async (id: string) => {
    try {
      await subjectService.update(id, subjectModel);
      handleCloseEdit();
      loadData();
      toast.done("Cập nhập thành công");
    } catch (error: any) {
      setMessageSubject(error.response.data.errors);
    }
  };
  const handleToggle = () => {
    setOpen(!open); // Đảo ngược giá trị state khi nút được nhấn
  };
  const loadDataSubject = async () => {
    try {
      await subjectService
        .list()
        .then((res) => setListSubject(res.data.subject));
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleFile = (e: React.FormEvent<HTMLInputElement>) => {
    const newFile = e.currentTarget.files?.[0];
    if (newFile) {
      setFile(newFile);
    }
  };
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        height="600px"
        handleSave={() => handleSave(subjectDetail?._id || "")}
        title={
          subjectDetail?._id === ""
            ? "Thêm chi tiết môn học"
            : "Cập nhập chi tiết môn học"
        }
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        data={
          loadingForm === false ? (
            <SubjectDetailAdd
              defaultValue={subjectDetailModel}
              message={messageSubjectDetail}
              nameFCChangeInput={handleChange}
              nameFCChangeSelect={handleSelect}
              nameFCChangeArray={handleChangeArray}
              handleAddContent={handleAddTableOfContents}
              handleRemoveContent={handleDeleteTableOfContents}
              handleAdd={handleAdd}
              listSubject={listSubject}
              handleToggle={handleToggle}
              open={open}
              isUpdate={isUpdate}
              handleFile={handleFile}
            />
          ) : (
            ""
          )
        }
        show={show}
      />
      <ModalReact
        handleClose={handleCloseEdit}
        handleSave={() => handleEdit(subject?._id || "")}
        title={"Cập nhập môn học"}
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        data={
          loadingForm === false ? (
            <Input
              name="name"
              label="Môn học"
              onChange={handleChange}
              value={subjectModel.name}
              message={messageSubject.name}
            />
          ) : (
            ""
          )
        }
        show={showEidt}
      />
      {loading === false ? (
        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-12">
              <h4 className="bg-success p-2 text-light">Quản lí môn học</h4>
            </div>
            <div className="col-12 text-end mt-3">
              <button
                className="btn btn-success mb-3"
                onClick={() => handleShow("")}
              >
                Thêm môn
              </button>
            </div>
            <div className="col-12">
              <table className="table table-bordered table-success">
                <thead className="">
                  <tr>
                    <th scope="col" className="fw-bolder " colSpan={2}>
                      CÁC MÔN HỌC TRƯỜNG ĐANG SỮ DỤNG
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="fw-bolder">
                      STT
                    </th>
                    <th scope="col" className="text-center fw-bolder">
                      MÔN HỌC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupSubjectDetail.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td>
                        <div className="fw-bolder fs-5 d-inline me-3">
                          {item.subject.name}
                        </div>
                        <span
                          className="text-primary"
                          onClick={() => handleShowEdit(item.subject._id)}
                        >
                          <i className="fa-regular fa-pen-to-square text-primary"></i>{" "}
                          Sữa
                        </span>
                        <ul>
                          {item.details.map((detail, index) => (
                            <li key={index}>
                              {item.subject.name} - {detail.grade}
                              <span
                                className="text-primary"
                                onClick={() => handleShow(detail._id)}
                              >
                                <i className="fa-regular fa-pen-to-square ms-3 text-primary"></i>{" "}
                                Sữa
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};

export default SubjectView;
