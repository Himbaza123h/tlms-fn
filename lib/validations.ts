import * as z from 'zod';


export const ORDER_STATUSES = [
  'Pending',
  'In Progress', 
  'Completed',
  'Cancelled'
] as const;

export const truckSchema = z.object({
  id: z.string().optional(),
  plateNumber: z.string()
    .min(6, { message: "Plate number must be at least 6 characters" })
    .max(10, { message: "Plate number cannot exceed 10 characters" })
    .regex(/^[A-Z0-9]+$/, { message: "Plate number must be alphanumeric" }),

  capacity: z.number()
    .min(1, { message: "Capacity must be at least 1 ton" })
    .max(50, { message: "Capacity cannot exceed 50 tons" }),

  model: z.string()
    .min(2, { message: "Model name must be at least 2 characters" })
    .max(50, { message: "Model name cannot exceed 50 characters" }),

  year: z.number()
    .min(1990, { message: "Year must be 1990 or later" })
    .max(new Date().getFullYear(), { message: `Year cannot be after ${new Date().getFullYear()}` }),

  status: z.enum(['Available', 'Delivering', 'Maintenance'], {
    errorMap: () => ({ message: "Please select a valid status" })
  })
});

export type Truck = z.infer<typeof truckSchema>;



export const driverCreateSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name cannot exceed 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  
  license_number: z.string()
    .min(5, { message: "License number must be at least 5 characters" })
    .max(20, { message: "License number cannot exceed 20 characters" }),
  
  contact_number: z.string()
    .min(10, { message: "Contact number must be at least 10 characters" })
    .max(15, { message: "Contact number cannot exceed 15 characters" }),
  
  assigned_truck: z.string().optional()
});

export const driverSchema = driverCreateSchema.extend({
  id: z.string()
    .min(1, { message: "ID must not be empty" })
    .max(255, { message: "ID is too long" })
    .optional()
});

export type Driver = z.infer<typeof driverSchema>;
export type DriverCreate = Omit<z.infer<typeof driverCreateSchema>, 'id'> & { id?: string };
export type DriverUpdate = Partial<Driver>;

export const validateDriverCreate = (data: DriverCreate) => {
  // Remove ID if present for creation
  const { id, ...createData } = data;
  return driverCreateSchema.parse(createData);
};

export const validateDriverUpdate = (data: DriverUpdate) => {
  return driverSchema.partial().parse(data);
};





export const orderSchema = z.object({
  id: z.string()
  .min(1, { message: "ID must not be empty" })
  .max(255, { message: "ID is too long" })
  .optional(),
  
  customer_name: z.string()
    .min(2, { message: "Customer name must be at least 2 characters long" })
    .max(100, { message: "Customer name cannot exceed 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Customer name can only contain letters and spaces" }),
  
  assigned_truck: z.string()
    .min(1, { message: "Assigned truck ID must be provided" })
    .refine(
      (value) => /^[a-zA-Z0-9_-]+$/.test(value),
      { message: "Assigned truck ID must be alphanumeric or contain hyphens/underscores" }
    ),

  assigned_driver: z.string()
    .min(1, { message: "Assigned driver ID must be provided" })
    .refine(
      (value) => /^[a-zA-Z0-9_-]+$/.test(value),
      { message: "Assigned driver ID must be alphanumeric or contain hyphens/underscores" }
    ),

  order_status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled'], {
    errorMap: () => ({ message: "Please select a valid order status" })
  }),
});


  
  export type Order = z.infer<typeof orderSchema>;
  
  // Type for creating a new order
  export type OrderCreate = Omit<z.infer<typeof orderSchema>, 'id'> & { id?: string };
  
  // Type for updating an existing order (all fields optional)
  export type OrderUpdate = Partial<OrderCreate>;
  
  // Validation function for creating a new order
  export const validateOrderCreate = (data: OrderCreate) => {
    const { id, ...createData } = data;
    return orderSchema.partial({ id: true }).parse(createData);
  };
  
  // Validation function for updating an existing order
  export const validateOrderUpdate = (data: OrderUpdate) => {
    return orderSchema.partial().parse(data);
  };