import './input.css';

export const Input = ({ label, value, onChange, type = "text", placeholder = "", ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <input
      className="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={type === "password" ? "current-password" : "on"}
      {...props}
    />
  </div>
);