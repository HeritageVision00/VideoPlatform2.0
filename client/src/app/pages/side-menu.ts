import { NbMenuItem } from "@nebular/theme";

export const MENU_SIDEBAR: NbMenuItem[] = [
  
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Branch",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
 
  {
    title: "Cameras",
    icon: "video-outline",
    children: [
      {
        title: "Cameras List",
        link: "camerasList",
      },
      {
        title: "Add Camera",
        link: "cameras/add_camera",
      },
    ],
  },
  
  {
    title: "Dashboards",
    icon: "bar-chart-outline",
    link: "graphs",
  },
  {
    title: "Tickets",
    icon: "done-all-outline",
    link: "tickets",
  },
  {
    title: "Stored Videos",
    icon: "film-outline",
    children: [
      {
        title: "Video List",
        link: "search/list",
      },
      {
        title: "Add Video",
        link: "search/upload",
      },
      {
        title: "Forensic Search",
        link: "search/bar",
      },
    ],
  },
  {
    title: "Help",
    icon: "paper-plane-outline",
    link: "helpdesk",
  },
];