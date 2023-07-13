import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import "./App.css";
import Autocomplete from "./Autocomplete";
import Select from "react-select";

const el: OptionType[] = [];
for (let i = 0; i < 10000; i++) {
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
      <Autocomplete label="elements" options={el} />
      <Select options={el} />
    </div>
  );
};

export default App;
