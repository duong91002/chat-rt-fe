import MessageIcon from "@mui/icons-material/Message";

export const getNavigateConfig = () => [
  {
    segment: "socials",
    title: "Xã hội",
    children: [
      {
        segment: "messages",
        title: "Tin nhắn",
        icon: <MessageIcon />,
        path: "/messages",
      },
    ],
  },
];
