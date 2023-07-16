import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import "./App.css";
import Autocomplete from "./Autocomplete";
import Select from "react-select";
import VirtualAutocomplete from "Autocomplete/components/VirtualAutocomplete";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";

const el: OptionType[] = [];
for (let i = 0; i < 10000; i++) {
  el.push({
    label: "element " + i,
    value: i.toString(),
    isDisabled: i % 2 === 0,
  });
}

const groupedEl = [
  {
    label: "Group 1",
    options: el.slice(0, 10),
  },
  {
    label: "Group 2",
    options: el.slice(10, 20),
  },
];

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      <VirtualAutocomplete label="elements" options={el} />
      <Autocomplete grouped label="elements" options={groupedEl} />
      <Select options={el} />
      <MuiAutocomplete
        id="combo-box-demo"
        options={el}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    </div>
  );
};

export default App;
