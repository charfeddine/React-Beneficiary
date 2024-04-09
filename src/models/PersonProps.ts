interface PersonProps {
  name: string;
  email: string;
  country: Country;
  age: number;
  isMarried: boolean;
  friends: string[];
}
export enum Country {
  Brazil = "Brazil",
  France = "France",
  Canada = "Canada",
}
export type { PersonProps };
