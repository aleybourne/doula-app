
import { parseISO, differenceInDays, addWeeks } from "date-fns";
import { ClientData } from "../types/ClientTypes";

// Number of weeks for postpartum period
export const POSTPARTUM_WEEKS = 8;

export function calculateGestationAndTrimester(dueDateISO: string, birthStage?: string, deliveryDate?: string): {
  gestation: string;
  trimester: string | null;
  isPastDue: boolean;
  progress: number;
  isPostpartum?: boolean;
  postpartumProgress?: number;
} {
  const today = new Date();
  
  // Handle delivered clients
  if (birthStage === 'delivered' && deliveryDate) {
    const delivery = parseISO(deliveryDate);
    const postpartumEnd = addWeeks(delivery, POSTPARTUM_WEEKS);
    
    // Calculate days since delivery
    const daysSinceDelivery = differenceInDays(today, delivery);
    const totalPostpartumDays = differenceInDays(postpartumEnd, delivery);
    
    // Calculate postpartum progress (0-1)
    const postpartumProgress = Math.min(daysSinceDelivery / totalPostpartumDays, 1);
    
    // Format weeks and days since delivery
    const weeksSinceDelivery = Math.floor(daysSinceDelivery / 7);
    const daysPart = daysSinceDelivery % 7;
    
    return {
      gestation: `${weeksSinceDelivery}w+${daysPart}d PP`,
      trimester: null,
      isPastDue: false,
      progress: 1, // Pregnancy is complete
      isPostpartum: true,
      postpartumProgress
    };
  }
  
  const dueDate = parseISO(dueDateISO);
  const daysUntilDue = differenceInDays(dueDate, today);
  
  const isPastDue = daysUntilDue < 0;
  
  if (isPastDue && birthStage !== 'delivered') {
    const daysPastDue = Math.abs(daysUntilDue);
    const weeks = Math.floor(daysPastDue / 7);
    const days = daysPastDue % 7;
    
    return {
      gestation: `${weeks}w+${days}d past due`,
      trimester: null,
      isPastDue: true,
      progress: 1,
    };
  }
  
  const conceptionToToday = 280 - daysUntilDue;
  const weeks = Math.floor(conceptionToToday / 7);
  const days = conceptionToToday % 7;
  const progress = conceptionToToday / 280;
  
  let trimester: string;
  if (weeks < 13) {
    trimester = "1st Trimester";
  } else if (weeks < 27) {
    trimester = "2nd Trimester";
  } else {
    trimester = "3rd Trimester";
  }
  
  return {
    gestation: `${weeks}w+${days}d`,
    trimester,
    isPastDue: false,
    progress,
  };
}
