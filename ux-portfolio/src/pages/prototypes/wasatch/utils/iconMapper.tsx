import {
  FileText,
  Microscope,
  Clock,
  TrendingUp,
} from "lucide-react";

// Map icon names to components
export const getIcon = (iconName: string, size: number = 24) => {
  const icons: Record<string, React.ReactNode> = {
    FileText: <FileText size={size} />,
    Microscope: <Microscope size={size} />,
    Clock: <Clock size={size} />,
    TrendingUp: <TrendingUp size={size} />,
  };

  return icons[iconName] || <FileText size={size} />;
};

