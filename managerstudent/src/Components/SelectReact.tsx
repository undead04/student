import React from "react";
import Select, { MultiValue, SingleValue } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface Prop {
  isMul: boolean;
  defaultValue: OptionType[];
  option: OptionType[];
  message?: string;
  label?: string;
  name: string;
  nameHandle: (val: string | string[], name: string) => void;
}

const SelectReact: React.FC<Prop> = ({
  isMul,
  defaultValue,
  option,
  message,
  label,
  name,
  nameHandle,
}) => {
  const handleChange = (
    selectedOption: SingleValue<OptionType> | MultiValue<OptionType>
  ) => {
    if (isMul) {
      const options = Array.isArray(selectedOption)
        ? selectedOption
        : [selectedOption];
      const values = options.map((option) => option.value);
      nameHandle(values, name);
    } else {
      nameHandle((selectedOption as OptionType).value, name);
    }
  };

  const customStyles = {
    menu: (provided: any, state: any) => ({
      ...provided,
      maxHeight: 100, // Chiều cao tối đa của menu để có cuộn
      overflowY: "auto", // Thêm cuộn dọc
    }),
  };
  return (
    <div className="form-group">
      {label ? (
        <label className="form-label">
          {label}
          <sup className="text-danger fw-bold">*</sup>:
        </label>
      ) : null}
      <Select
        isMulti={isMul}
        value={defaultValue}
        options={option}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
        styles={customStyles}
      />

      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export default SelectReact;
