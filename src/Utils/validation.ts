// validation.ts - Compact validation with real-time checking

export interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationRule {
  min: number;
  max?: number;
  required: boolean;
  integer?: boolean;
}

interface ValidationRules {
  title: ValidationRule;
  description: ValidationRule;
  price: ValidationRule;
  make: ValidationRule;
  model: ValidationRule;
  year: ValidationRule;
  mileage: ValidationRule;
  batteryCapacity: ValidationRule;
  batteryHealth: ValidationRule;
  // Specifications
  'specifications.warranty.basic': ValidationRule;
  'specifications.warranty.battery': ValidationRule;
  'specifications.warranty.drivetrain': ValidationRule;
  'specifications.dimensions.width': ValidationRule;
  'specifications.dimensions.height': ValidationRule;
  'specifications.dimensions.length': ValidationRule;
  'specifications.dimensions.curbWeight': ValidationRule;
  'specifications.performance.topSpeed': ValidationRule;
  'specifications.performance.motorType': ValidationRule;
  'specifications.performance.horsepower': ValidationRule;
  'specifications.performance.acceleration': ValidationRule;
  'specifications.batteryAndCharging.range': ValidationRule;
  'specifications.batteryAndCharging.chargeTime': ValidationRule;
  'specifications.batteryAndCharging.chargingSpeed': ValidationRule;
  'specifications.batteryAndCharging.batteryCapacity': ValidationRule;
}

const currentYear = new Date().getFullYear();

// Validation rules
const RULES: ValidationRules = {
  title: { min: 5, max: 100, required: true },
  description: { min: 20, max: 5000, required: true },
  price: { min: 0.01, required: true },
  make: { min: 2, required: true },
  model: { min: 1, required: true },
  year: { min: 1990, max: currentYear + 1, required: true },
  mileage: { min: 0, integer: true, required: true },
  batteryCapacity: { min: 0.01, required: true },
  batteryHealth: { min: 0, max: 100, required: false },
  // Specifications validation rules
  'specifications.warranty.basic': { min: 1, required: true },
  'specifications.warranty.battery': { min: 1, required: true },
  'specifications.warranty.drivetrain': { min: 1, required: true },
  'specifications.dimensions.width': { min: 1, required: true },
  'specifications.dimensions.height': { min: 1, required: true },
  'specifications.dimensions.length': { min: 1, required: true },
  'specifications.dimensions.curbWeight': { min: 1, required: true },
  'specifications.performance.topSpeed': { min: 1, required: true },
  'specifications.performance.motorType': { min: 1, required: true },
  'specifications.performance.horsepower': { min: 1, required: true },
  'specifications.performance.acceleration': { min: 1, required: true },
  'specifications.batteryAndCharging.range': { min: 1, required: true },
  'specifications.batteryAndCharging.chargeTime': { min: 1, required: true },
  'specifications.batteryAndCharging.chargingSpeed': { min: 1, required: true },
  'specifications.batteryAndCharging.batteryCapacity': { min: 1, required: true }
};
  
// Single field validation
export function validateField(
  fieldName: string, 
  value: any, 
  listingType: 'vehicle' | 'battery'
): string | null {
  if (!value && RULES[fieldName as keyof typeof RULES]?.required) {
    return `${fieldName} is required`;
  }
  if (!value) return null;

  const rule = RULES[fieldName as keyof typeof RULES];
  const numValue = Number(value);

  switch (fieldName) {
    case 'title':
      if (value.trim().length < rule.min) return `Minimum ${rule.min} characters`;
      if (rule.max && value.trim().length > rule.max) return `Maximum ${rule.max} characters`;
      break;

    case 'description':
      if (value.trim().length < rule.min) return `Minimum ${rule.min} characters`;
      if (rule.max && value.trim().length > rule.max) return `Maximum ${rule.max} characters`;
      break;

    case 'price':
    case 'batteryCapacity':
      if (isNaN(numValue) || numValue <= 0) return 'Must be a positive number';
      break;

    case 'brand':
      if (value.trim().length < rule.min) return `Minimum ${rule.min} characters`;
      break;

    case 'model':
      if (listingType === 'vehicle' && value.trim().length < rule.min) 
        return 'Model is required';
      break;

    case 'year':
      if (isNaN(numValue) || numValue < rule.min || (rule.max && numValue > rule.max))
        return `Must be between ${rule.min} and ${rule.max || currentYear + 1}`;
      break;

    case 'mileage':
      if (listingType === 'vehicle') {
        if (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue))
          return 'Must be a non-negative integer';
      }
      break;

    case 'batteryHealth':
      if (isNaN(numValue) || numValue < 0 || numValue > 100)
        return 'Must be between 0 and 100';
      break;

    // Specifications validation
    default:
      if (fieldName.startsWith('specifications.')) {
        if (rule && value.trim().length < rule.min) {
          return `This field is required`;
        }
      }
      break;
  }

  return null;
}

// Validate specifications object
export function validateSpecifications(
  specifications: any,
  required: boolean = false
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!required) return errors;
  
  const specFields = [
    'specifications.warranty.basic',
    'specifications.warranty.battery', 
    'specifications.warranty.drivetrain',
    'specifications.dimensions.width',
    'specifications.dimensions.height',
    'specifications.dimensions.length',
    'specifications.dimensions.curbWeight',
    'specifications.performance.topSpeed',
    'specifications.performance.motorType',
    'specifications.performance.horsepower',
    'specifications.performance.acceleration',
    'specifications.batteryAndCharging.range',
    'specifications.batteryAndCharging.chargeTime',
    'specifications.batteryAndCharging.chargingSpeed',
    'specifications.batteryAndCharging.batteryCapacity'
  ];
  
  specFields.forEach(fieldPath => {
    const pathParts = fieldPath.split('.');
    let value = specifications;
    
    // Navigate to nested value
    for (let i = 1; i < pathParts.length; i++) {
      value = value?.[pathParts[i]];
    }
    
    const error = validateField(fieldPath, value, 'vehicle');
    if (error) {
      errors.push({ field: fieldPath, message: error });
    }
  });
  
  return errors;
}
  
  // Full form validation (unified)
  export function validateForm(
    formData: any, 
    listingType: 'vehicle' | 'battery',
    specsRequired: boolean = false
  ): ValidationResult {
    const errors: ValidationError[] = [];
    
    const requiredFields = listingType === 'vehicle'
      ? ['title', 'description', 'price', 'make', 'model', 'year', 'mileage']
      : ['title', 'description', 'price', 'year', 'batteryCapacity'];
  
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field], listingType);
      if (error) errors.push({ field, message: error });
    });
  
    // Optional fields
    if (formData.batteryHealth) {
      const error = validateField('batteryHealth', formData.batteryHealth, listingType);
      if (error) errors.push({ field: 'batteryHealth', message: error });
    }
    
    // Validate specifications if required (for vehicles)
    if (listingType === 'vehicle' && specsRequired) {
      const specErrors = validateSpecifications(formData.specifications, true);
      errors.push(...specErrors);
    }
  
    return { isValid: errors.length === 0, errors };
  }
  
  // Backward compatibility exports
  export const validateBatteryForm = (formData: any) => validateForm(formData, 'battery');
  export const validateVehicleForm = (formData: any) => validateForm(formData, 'vehicle');
  
  // Helper functions
  export const getFieldError = (errors: ValidationError[], field: string) =>
    errors.find(e => e.field === field)?.message || null;
  
  export const hasFieldError = (errors: ValidationError[], field: string) =>
    errors.some(e => e.field === field);
  
  export const parseApiValidationErrors = (apiResponse: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (Array.isArray(apiResponse.errors)) {
      apiResponse.errors.forEach((e: any) => {
        if (e.field && e.message) errors[e.field] = e.message;
      });
    } else if (apiResponse.errors || apiResponse.details) {
      Object.entries(apiResponse.errors || apiResponse.details).forEach(([k, v]) => {
        errors[k] = String(v);
      });
    }
    
    return errors;
  };
  
  export const useApiValidation = () => ({
    setApiErrors: (errors: Record<string, string>) => console.log('API Errors:', errors)
  });