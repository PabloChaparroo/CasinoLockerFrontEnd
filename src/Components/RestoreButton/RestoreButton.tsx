import { CheckCircleFill } from "react-bootstrap-icons";

interface RestoreButtonProps {
  onClick: () => void;
}

export const RestoreButton = ({ onClick }: RestoreButtonProps) => {
  return (
    <>
      <CheckCircleFill
        color="#388E3C"
        size={24}
        onClick={onClick}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
        }}
      />
    </>
  );
};

export default RestoreButton;