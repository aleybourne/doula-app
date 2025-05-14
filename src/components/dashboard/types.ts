export interface StatCardProps {
  count: number;
  label: string;
  bgColor: string;
}

export interface AppointmentProps {
  time: string;
  title: string;
  subtitle: string;
  avatarSvg?: string;
  avatarType?: string;
  avatarUrl?: string;
  avatarFallback?: string;
}

export interface ActionItemProps {
  icon: string;
  label: string;
  bgColor: string;
  altText: string;
}

export interface NavItemProps {
  icon: string;
  altText: string;
}
