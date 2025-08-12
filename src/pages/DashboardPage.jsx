import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[1000px]">
      <Button onClick={() => navigate("/")}>test</Button>
    </div>
  );
};

export default DashboardPage;
