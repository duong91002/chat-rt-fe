import MessageIcon from "@mui/icons-material/Message";
import DashboardIcon from "@mui/icons-material/Dashboard";
export const getNavigateConfig = () => [
  {
    segment: "Managements",
    title: "Managements",
    children: [
      {
        segment: "dashboards",
        title: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
      },
    ],
  },
  {
    segment: "socials",
    title: "Socials",
    children: [
      {
        segment: "messages",
        title: "Messages",
        icon: <MessageIcon />,
        path: "/messages",
      },
    ],
  },
];
