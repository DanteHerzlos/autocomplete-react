import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import "./App.css";
import Autocomplete from "./Autocomplete";
import Select from "react-select";
import VirtualAutocomplete from "Autocomplete/components/VirtualAutocomplete";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";

const el: OptionType[] = [];
for (let i = 0; i < 100000; i++) {
  el.push({
    label: "element " + i,
    value: i.toString(),
    isDisabled: i % 2 === 0,
  });
}

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
