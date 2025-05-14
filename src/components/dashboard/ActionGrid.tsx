
import React from "react";
import { ActionItem } from "./ActionItem";
import { bottomActions } from "./actionData";

export const ActionGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-3 gap-x-6 gap-y-6 justify-items-center mx-0 my-5">
      {bottomActions.map((action, index) => (
        <ActionItem key={index} {...action} />
      ))}
    </section>
  );
};

