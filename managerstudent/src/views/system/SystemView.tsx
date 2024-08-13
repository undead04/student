import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import SelectReact from "../../Components/SelectReact";
import SystemService, {
  ISystem,
  ISystemModel,
} from "../../servers/systemServer";
import LoadingReact from "../../Components/LoadingReact";
import firebaseService from "../../firebase/firebaseServices";
import { toast } from "react-toastify";
const SystemView = () => {
  const schoolYear = [
    "2020-2021",
    "2021-2022",
    "2022-2023",
    "2023-2024",
    "2024-2025",
    "2025-2026",
    "2026-2027",
  ];
  const semester = ["Học kì 1", "Học kì 2"];
  const [system, setSystem] = useState<Partial<ISystem>>({ _id: "" });
  const [systemModel, setSystemModel] = useState<ISystemModel>({
    name: "",
    logo: "",
    schoolYear: "",
    semester: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [logo, setLogo] = useState<File>();
  const loadData = async () => {
    try {
      const response = await SystemService.get().then((res) => res.data);
      setSystem(response);
      setSystemModel({
        name: response.name,
        schoolYear: response.schoolYear,
        semester: response.semester,
        logo: response.logo,
      });
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    document.title = "Quản lí hệ thống";
    loadData();
  }, []);
  const handleSelect = (e: string | string[], name: string) => {
    setSystemModel({ ...systemModel, [name]: e });
  };
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSystemModel({
      ...systemModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSave = async (id: string) => {
    let url = "";
    if (logo) {
      url = await firebaseService.handleUploadFile(logo);
      systemModel.logo = url;
    }
    if (id === "") {
      try {
        await SystemService.add(systemModel);
        loadData();
        setLogo(undefined);
        toast.done("Cập nhập hệ thống thành công");
      } catch (error: any) {
        toast.error("Cập nhập hệ thống thất bại");
      }
    } else {
      try {
        if (logo) {
          await firebaseService.hanldeDeleteImage(system.logo ?? "");
        }
        await SystemService.update(id, systemModel);
        loadData();
        setLogo(undefined);
        toast.success("Cập nhập hệ thống thành công");
      } catch (error: any) {
        toast.error("Cập nhập hệ thống thất bại");
        console.log(error);
      }
    }
  };
  const handleFile = (e: React.FormEvent<HTMLInputElement>) => {
    const newFile = e.currentTarget.files?.[0];
    if (newFile) {
      setLogo(newFile);
    }
  };
  return (
    <>
      {loading === false ? (
        <div
          className="container mt-3  p-2 rounded-2"
          style={{ maxWidth: "60%" }}
        >
          <div className="row g-4 ">
            <div className="col-12 col-lg-6">
              <Input
                type="file"
                name="logo"
                label="Logo"
                onChange={handleFile}
              />
            </div>
            <div className="col-12 col-lg-6">
              <Input
                label="Tên trường"
                name="name"
                onChange={handleChange}
                value={systemModel?.name}
              />
            </div>
            <div className="col-12 col-lg-6">
              <SelectReact
                isMul={false}
                option={schoolYear.map((item, index) => ({
                  label: item,
                  value: item,
                }))}
                defaultValue={[
                  {
                    label: systemModel.schoolYear ?? "",
                    value: systemModel.schoolYear ?? "",
                  },
                ]}
                name="schoolYear"
                label="Năm Học"
                nameHandle={handleSelect}
              />
            </div>
            <div className="col-12 col-lg-6">
              <SelectReact
                isMul={false}
                option={semester.map((item, index) => ({
                  label: item,
                  value: item,
                }))}
                defaultValue={[
                  {
                    label: systemModel.semester ?? "",
                    value: systemModel.semester ?? "",
                  },
                ]}
                name="semester"
                label="Học kì"
                nameHandle={handleSelect}
              />
            </div>
            <div className="col-12 col-lg-6">
              <img src={system?.logo} alt="Logo" />
            </div>
          </div>
          <div className="row">
            <div
              className="col text-end mt-3"
              onClick={() => handleSave(system?._id || "")}
            >
              <button className="btn btn-success mb-4 px-4 text-light">
                Lưu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};

export default SystemView;
