import buttons from "./NodeTypes.json";

export const Sidebar = ({ addNode }) => {
  return (
    <div className="sidebar">
      <h3>Nodes</h3>
      {buttons.map((button) => (
        <button
          key={button.type}
          className="sidebar-button"
          onClick={() => addNode(button.type)}
        >
          {button.sidebarButtonLabel}
        </button>
      ))}
    </div>
  );
};
