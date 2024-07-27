import React, {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from "react";

type InputAttributes = InputHTMLAttributes<HTMLInputElement>;

interface Props extends DetailedHTMLProps<InputAttributes, HTMLInputElement> {
  label?: string;
  inputRef?: any;
  name: string;
  row?: number;
  message?: string;
}
const Input: FC<Props> = ({
  label,
  name,
  row = 0,
  inputRef,
  message = "",
  ...other
}): ReactElement => {
  return (
    <>
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            <sup className="text-danger fw-bold">*</sup>:
          </label>
        )}
        <div className="flex-grow-1">
          {row > 0 ? (
            <textarea
              {...(other as TextareaHTMLAttributes<HTMLTextAreaElement>)}
              rows={row}
              name={name}
              className="form-control bg-transparent text-primary"
              ref={inputRef}
            ></textarea>
          ) : (
            <input
              {...other}
              name={name}
              ref={inputRef}
              className="form-control bg-transparent text-primary"
            />
          )}
          <span className="text-danger">{message}</span>
        </div>
      </div>
    </>
  );
};

export default Input;
