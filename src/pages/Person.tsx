import { useState } from "react";
import { PersonProps } from "../models/PersonProps";

export const Person = (props: PersonProps) => {
  const [name, setName] = useState<string>("");
  return (
    <div>
      <h1>Name :{props.name} </h1>
      <h1>Email : {props.email} </h1>
      <h1>Age : {props.age} </h1>
      <h1>Country : {props.country} </h1>
      <h1>Person is : {props.isMarried ? "is" : "is not"} Married</h1>

      {props.friends.map((friend: string) => (
        <h1>{friend}</h1>
      ))}
    </div>
  );
};
