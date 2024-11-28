import { useMutation, useQuery, useQueryClient } from 'react-query';
import { db } from './db';
import { toast } from 'react-hot-toast'; 
import { z } from 'zod';

import {
  Truck, Driver, Order,
  truckSchema, orderSchema,
  DriverCreate, DriverUpdate,
  OrderCreate, OrderUpdate,
  validateDriverCreate, validateDriverUpdate,
  validateOrderCreate, validateOrderUpdate,
  driverCreateSchema
} from './validations';

import axios from 'axios';


// Generic error handler
const handleError = (error: unknown, entityName: string) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(`Failed to perform operation on ${entityName.toLowerCase()}`);
  }
  console.error(`${entityName} operation failed:`, error);
};

export const useTrucks = () => {
  return useQuery('trucks', db.trucks.getAll);
};

export const useTruck = (id: string) => {
  return useQuery(['truck', id], () => db.trucks.getById(id));
};

export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newTruck: Omit<Truck, 'id'>) => db.trucks.create(newTruck),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trucks');
        toast.success('Truck created successfully');
      },
      onError: (error) => {
        toast.error('Failed to create truck');
        console.error(error);
      }
    }
  );
};


export const useUpdateTruckStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, status }: { id: string; status: 'Available' | 'Delivering' | 'Maintenance' }) =>
      db.trucks.update(id, { status }),
    {
      onSuccess: (_, variables) => {
        // Invalidate queries to update UI
        queryClient.invalidateQueries('trucks');
        queryClient.invalidateQueries(['truck', variables.id]);
        toast.success(`Truck status updated to ${variables.status}`);
      },
      onError: (error) => {
        toast.error('Failed to update truck status');
        console.error(error);
      }
    }
  );
};


export const useUpdateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, truck }: { id: string; truck: Partial<Truck> }) => 
      db.trucks.update(id, truck),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries('trucks');
        queryClient.invalidateQueries(['truck', variables.id]);
        toast.success('Truck updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update truck');
        console.error(error);
      }
    }
  );
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => db.trucks.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trucks');
        toast.success('Truck deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete truck');
        console.error(error);
      }
    }
  );
};



// Driver Hooks
export const useDrivers = () => {
  return useQuery<Driver[], Error>('drivers', db.drivers.getAll, {
    onError: (error) => handleError(error, 'Drivers')
  });
};

export const useDriver = (id: string) => {
  return useQuery<Driver, Error>(
    ['driver', id],
    () => db.drivers.getById(id),
    {
      enabled: !!id,
      onError: (error) => handleError(error, 'Driver')
    }
  );
};



export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newDriver: Omit<Driver, 'id'>) => db.drivers.create(newDriver),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('drivers');
        toast.success('Driver created successfully');
      },
      onError: (error) => {
        toast.error('Failed in Driver creation');
        console.error(error);
      }
    }
  );
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Driver,
    Error,
    { id: string; driver: DriverUpdate }
  >(
    async ({ id, driver }) => {
      const validated = validateDriverUpdate(driver);
      return db.drivers.update(id, validated);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries('drivers');
        queryClient.invalidateQueries(['driver', variables.id]);
        toast.success('Driver updated successfully');
      },
      onError: (error) => handleError(error, 'Driver update')
    }
  );
};


export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => db.drivers.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('drivers');
        toast.success('Driver deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete driver');
        console.error(error);
      }
    }
  );
};

// Order Hooks

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const updateTruckStatus = useUpdateTruckStatus(); // Reuse existing truck status update hook

  return useMutation(
    async (newOrder: Omit<Order, 'id'>) => {
      // First, create the order
      const createdOrder = await db.orders.create(newOrder);
      
      // If a truck is assigned, update its status to 'Delivering'
      if (createdOrder.assigned_truck) {
        await updateTruckStatus.mutateAsync({ 
          id: createdOrder.assigned_truck, 
          status: 'Delivering' 
        });
      }
      
      return createdOrder;
    },
    {
      onSuccess: (createdOrder) => {
        queryClient.invalidateQueries('orders');
        queryClient.invalidateQueries('trucks');
        queryClient.setQueryData(['order', createdOrder.id], createdOrder);
        toast.success('Order created successfully');
      },
      onError: (error) => {
        toast.error('Failed to create order');
        console.error(error);
      }
    }
  );
};

// Hook for updating an order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; order: OrderUpdate }
  >(
    async ({ id, order }) => {
      // Validate the order update
      const validatedOrder = orderSchema.partial().parse(order);
      return db.orders.update(id, validatedOrder);
    },
    {
      onSuccess: (updatedOrder, variables) => {
        queryClient.invalidateQueries('orders');
        queryClient.setQueryData(['order', variables.id], updatedOrder);
        toast.success('Order updated successfully');
      },
      onError: (error) => handleError(error, 'order update')
    }
  );
};

// Hook for deleting an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const updateTruckStatus = useUpdateTruckStatus();

  return useMutation<void, Error, string>(
    async (orderId) => {
      // Fetch the order details
      const order = await db.orders.getById(orderId);

      // Check if a truck is assigned to the order
      if (order.assigned_truck) {
        try {
          const truck = await db.trucks.getById(order.assigned_truck);

          // Update the truck's status only if it is "Delivering"
          if (truck?.status === 'Delivering') {
            await updateTruckStatus.mutateAsync({
              id: order.assigned_truck,
              status: 'Available',
            });
          }
        } catch (error) {
          console.error('Error fetching truck:', error);
        }
      }

      // Proceed to delete the order
      await db.orders.delete(orderId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        queryClient.invalidateQueries('trucks');
        toast.success('Order deleted successfully');
      },
      onError: (error) => handleError(error, 'order deletion'),
    }
  );
};



export const useMarkOrderComplete = () => {
  const queryClient = useQueryClient();
  const updateOrder = useUpdateOrder(); 
  const updateTruckStatus = useUpdateTruckStatus(); 

  return useMutation<void, Error, string>(
    async (orderId) => {
      const order = await db.orders.getById(orderId);

      await updateOrder.mutateAsync({
        id: orderId,
        order: { order_status: 'Completed' },
      });

      if (order.assigned_truck) {
        await updateTruckStatus.mutateAsync({
          id: order.assigned_truck,
          status: 'Available',
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        queryClient.invalidateQueries('trucks');
        toast.success('Order marked as complete');
      },
      onError: (error) => {
        toast.error('Failed to mark order as complete');
        console.error(error);
      },
    }
  );
};


// Hook to fetch orders
export const useOrders = () => {
  return useQuery<Order[], Error>('orders', () => db.orders.getAll());
};



export const useOrder = (id: string) => {
  return useQuery(['order', id], () => db.orders.getById(id));
};