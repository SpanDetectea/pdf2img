import { useSelector } from "react-redux";
import "./SelectionPanel.css"

const SelectionPanel = () => {
  const fragments = useSelector((state) => state.selection);

  if (fragments.length === 0)
    return <p className="hint">Выделенные области будут отображаться здесь</p>;

  return (
    <div className="selectionPanel">
      {fragments.map((base64, index) => (
        <img
        className="selectionPanel-img"
          key={index}
          src={base64}
          alt={`Fragment ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default SelectionPanel;
