import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import "./App.css";
import Autocomplete from "./Autocomplete";

const el: OptionType[] = [];
for (let i = 0; i < 1000; i++) {
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
        justifyContent: "center",
      }}
    >
      <Autocomplete
        label="elements"
        onChange={(e) => console.log(e)}
        options={el}
      />
    </div>
  );
};

export default App;
