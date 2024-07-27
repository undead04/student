import React, { useState } from "react";
interface Prop {
  data: any;
  handleToggle?: () => void;
  open?: boolean;
  id: string;
}
const CollapseReact: React.FC<Prop> = ({ data, open, id }) => {
  return (
    <>
      <div
        className={`collapse ${open && open ? "show" : ""}  multi-collapse`}
        id={id}
      >
        {data}
      </div>
    </>
  );
};

export default CollapseReact;
