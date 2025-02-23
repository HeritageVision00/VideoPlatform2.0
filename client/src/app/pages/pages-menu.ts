import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMSBRANCH: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
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
  // {
  //   title: 'FR Users',
  //   icon: 'browser-outline',
  //   link: 'management'
  // },
  // {
  //   title: 'Dashboard',
  //   icon: 'clipboard-outline',
  //   link: 'analytics'
  // },
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
  // {
  //   title: "Microphones",
  //   icon: "mic-outline",
  //   children: [
  //     {
  //       title: "Microphone List",
  //       link: "microphoneList",
  //     },
  //     {
  //       title: "Add Microphone",
  //       link: "microphone/add",
  //     },
  //   ],
  // },
  // {
  //   title: 'Streams',
  //   icon: 'clipboard-outline',
  //   link: 'stream'
  // },
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
  // {
  //   title: "Help",
  //   icon: "paper-plane-outline",
  //   link: "helpdesk",
  // },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: 'settings'
  },
];
export const MENU_ITEMSADMIN: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Admin",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: 'settings'
  },
];

export const MENU_ITEMSCLIENT: NbMenuItem[] = [
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Client",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
  {
    title: "Reports",
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
  // {
  //   title: "Helpdesk",
  //   icon: "browser-outline",
  //   link: "helpdesk-listing",
  // },
  // {
  //   title: "Incident Logs",
  //   icon: "star",
  //   link: "incident-logs",
  // },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: 'settings'
  },
];

export const MENU_ITEMSUSER: NbMenuItem[] = [
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for User",
    group: true,
  },
  {
    title: "Cameras",
    icon: "video-outline",
    children: [
      {
        title: "Cameras List",
        link: "camerasList",
        home: true,
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
  // {
  //   title: 'Controls',
  //   icon: 'power-outline',
  //   link: 'settings'
  // }
  // {
  //   title: "Help",
  //   icon: "paper-plane-outline",
  //   link: "helpdesk",
  // },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: 'settings'
  },
];
export const MENU_ITEMSBRANCHSIDE: NbMenuItem[] = [
  
  {
    title: "Start",
    icon: "home-outline",
   
    hidden: true,
    home: true,
  },
  {
    title: "Summarization Options Menu",
    group: true,
  },
 
  {
    title: "Violence",
    icon: "shake-outline",
  },
  {
    title: "Collapse",
    icon: "collapse-outline",
    
  },
  {
    title: "Abandoned objects",
    icon: "smartphone-outline",
  },
  {
    title: "Weapons",
    icon: "droplet-off-outline",
  },
  {
    title: "Over Speeding",
    icon: "trending-up-outline",
  },
  {
    title: "Vehicle Lookup (ANPR)",
    icon: "close-circle-outline",
    
  },
  {
    title: "Accidents",
    icon: "options-2-outline",
     
  },
  // {
  //   title: "Proximity",
  //   icon: "pin-outline",
    
  // },
  {
    title:"Zig-zag",
    icon:'activity-outline'
  },
  {
    title: "Wrong way",
    icon:"options-2-outline"

  },
  // {
  //   title: "Time Range",
  //   icon: "clock-outline",
    
  // },
  // {
  //   title: "Car (Vehicles)",
  //   icon: "car-outline",
     
  // },
  // {
  //   title: "Person Attributes",
  //   icon: "people-outline",
     
  // },
  // {
  //   title: "Colour",
  //   icon: "color-palette-outline",
  
     
     
  // },
  // {
  //   title: "video Speed",
  //   icon: "film-outline",
     
  // },
];
