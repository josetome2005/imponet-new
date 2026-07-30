import "./ToggleInput.css";

export function ToggleInput({ input_name, value, onChange, disabled }) {

  
  return (
    <label className="toggle-input">
      <input
        type="checkbox"
        name={input_name}
        checked={Boolean(value)}
        onChange={e => onChange(e.target.checked, input_name)}
        disabled={disabled}
      />
      <span className="toggle-slider" />
    </label>
  );
}
