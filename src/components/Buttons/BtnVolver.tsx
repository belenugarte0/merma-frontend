import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface Props {
  btnPath: string;
}

export const BtnVolver = ({ btnPath }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate(btnPath)}
        className="btn bprimary"
        isIconOnly
        color="primary"
        aria-label="Like"
        variant="bordered"
      >
        <i className="fas fa-reply"></i>
      </Button>
    </>
  );
};
