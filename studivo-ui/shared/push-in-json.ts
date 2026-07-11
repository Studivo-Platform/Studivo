import fs from "fs";
import path from "path";

const WIDGETS = [
  {
    label: "Active Requests",
    value: "3",
    change: "+1",
    icon: "FileText",
    color: "text-primary bg-primary/10",
    href: "/requests",
  },
  {
    label: "Closed Requests",
    value: "9",
    change: "+2",
    icon: "CheckCircle2",
    color: "text-success bg-success/10",
    href: "/requests",
  },
  {
    label: "New Offers",
    value: "8",
    change: "+5",
    icon: "Tag",
    color: "text-accent bg-accent/10",
    href: "/requests/r1",
  },
  {
    label: "Unread Messages",
    value: "3",
    change: "",
    icon: "MessageSquare",
    color: "text-warning bg-warning/10",
    href: "/dashboard/chat",
  },
];

const QUICK_ACTIONS = [
  {
    label: "New Request",
    icon: "Plus",
    href: "/requests/new",
    color: "from-primary to-primary/80",
  },
  {
    label: "Search",
    icon: "Search",
    href: "/search",
    color: "from-accent to-accent/80",
  },
  {
    label: "Messages",
    icon: "MessageSquare",
    href: "/dashboard/chat",
    color: "from-success to-success/80",
  },
  {
    label: "Notifications",
    icon: "Bell",
    href: "/dashboard/notifications",
    color: "from-warning to-warning/80",
  },
];

const ACTIVITY_ICONS = {
  offer: { icon: "Tag", color: "text-accent bg-accent/10" },
  message: { icon: "MessageSquare", color: "text-success bg-success/10" },
  request: { icon: "FileText", color: "text-primary bg-primary/10" },
  review: { icon: "CheckCircle2", color: "text-warning bg-warning/10" },
  system: { icon: "Bell", color: "text-muted-foreground bg-muted" },
};
// process.cwd() returns the current working directory بتجيب جذر مسار المشروع
const baseDir = path.join(process.cwd(), `features`, `dashboard`, `APIs`);

const file1Path = path.join(baseDir, "activity_icons.json");
const file2Path = path.join(baseDir, "quick_actions.json");
const file3Path = path.join(baseDir, "widgets.json");

fs.writeFileSync(file1Path, JSON.stringify(ACTIVITY_ICONS));
fs.writeFileSync(file2Path, JSON.stringify(QUICK_ACTIONS));
fs.writeFileSync(file3Path, JSON.stringify(WIDGETS));

console.log("JSON files generated successfully!");
