import { DeliveryMethod } from '../types';

export interface DeliveryMethodInfo {
  label: string;
  subtext: string;
}

export function formatDeliveryMethod(method?: DeliveryMethod): DeliveryMethodInfo {
  if (!method) {
    return {
      label: 'Not selected',
      subtext: '',
    };
  }

  // Map legacy values to new ones for display
  const normalizedMethod = normalizeLegacyDeliveryMethod(method);

  const methodMap: Record<string, DeliveryMethodInfo> = {
    COURIER: {
      label: 'Courier Delivery',
      subtext: 'Shipped via courier with tracking updates',
    },
    LOCAL_PICKUP_DROP: {
      label: 'Local Pickup & Drop',
      subtext: 'Same-city delivery via Porter / Dunzo / Borzo / Uber',
    },
    IN_PERSON_HANDOVER: {
      label: 'In-Person Handover',
      subtext: 'Meet and exchange directly (no shipping)',
    },
    DIGITAL_DELIVERY: {
      label: 'Digital Delivery',
      subtext: 'Delivered online (files, access, accounts, domains)',
    },
    SERVICE_COMPLETION: {
      label: 'Service Completion',
      subtext: 'Payment released after service is completed',
    },
  };

  return methodMap[normalizedMethod] || { label: method, subtext: '' };
}

// Helper to normalize legacy delivery method values
function normalizeLegacyDeliveryMethod(method: DeliveryMethod): string {
  const legacyMap: Record<string, string> = {
    PICKUP: 'LOCAL_PICKUP_DROP',
    DIGITAL: 'DIGITAL_DELIVERY',
    IN_PERSON: 'IN_PERSON_HANDOVER',
  };
  
  return legacyMap[method] || method;
}
