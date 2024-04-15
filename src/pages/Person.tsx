import { PersonProps } from "../models/PersonProps";
import { useGetCat } from "../hooks/useGetCat";
import { Grid } from "@mui/material";
export const Person = (props: PersonProps) => {
  const { factInformation, isCatLoading, error, refetchData } = useGetCat();
  if (error) {
    return <h1>Sorry,Error !!</h1>;
  }
  if (isCatLoading) {
    return <h1>isLoading...</h1>;
  }
  return (
    <div>
      <h1>Name :{props.name} </h1>
      <h1>Email : {props.email} </h1>
      <h1>Age : {props.age} </h1>
      <h1>Country : {props.country} </h1>
      <h1>Person is : {props.isMarried ? "is" : "is not"} Married</h1>
      {props.friends.map((friend: string) => (
        <h1>{friend}</h1>
      ))}{" "}
      <br /> <br />
      <h1>
        CAT FACT API : <p>{factInformation?.fact}</p>
      </h1>
      <button onClick={refetchData}>refetch</button>
      <br /> <br />
      <Grid container spacing={3}>
        {Array.from(Array(6)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <p>{factInformation?.fact}</p>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
