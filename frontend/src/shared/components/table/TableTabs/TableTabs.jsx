import "./TableTabs.css";

export function TableTabs({ tabs, active, onChange }) {

  return (
    <div className="table__tabs__container">

      {tabs.map(tab => (
        <button key={tab.key} className={`table__tab ${active === tab.key ? "table__tab--active" : ""}`} onClick={() => onChange(tab.key)}>
          {tab.label}
        </button>
      ))}

    </div>
  );
  
}
