import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
import { 
    Truck,
    driverSchema, 
    DriverCreate, 
    Driver, 
    Order,
    orderSchema
  } from './validations'



const BASE_URL = 'http://localhost:3001';

export const db = {


  trucks: {
    getAll: async () => {
      const response = await axios.get<Truck[]>(`${BASE_URL}/trucks`);
      return response.data;
    },

    getById: async (id: string) => {
      try {
        const response = await axios.get<Truck>(`${BASE_URL}/trucks/${id}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.warn(`Truck with ID ${id} not found.`);
            return null; // Return null when the truck is not found
          }
        }
        console.error('Error fetching truck:', error);
        throw error; // Re-throw other errors
      }
    },
    

    create: async (truck: Omit<Truck, 'id'>) => {
      const response = await axios.post<Truck>(`${BASE_URL}/trucks`, truck);
      return response.data;
    },

    update: async (id: string, truck: Partial<Truck>) => {
      const response = await axios.patch<Truck>(`${BASE_URL}/trucks/${id}`, truck);
      return response.data;
    },

    delete: async (id: string) => {
      await axios.delete(`${BASE_URL}/trucks/${id}`);
    }
  },

  drivers: {
    async getAll(): Promise<Driver[]> {
      try {
        const response = await axios.get(`${BASE_URL}/drivers`);
        // Validate each driver in the response
        return response.data.map((driver: Driver) => driverSchema.parse(driver));
      } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
      }
    },

    async getById(id: string): Promise<Driver> {
      try {
        const response = await axios.get(`${BASE_URL}/drivers/${id}`);
        return driverSchema.parse(response.data);
      } catch (error) {
        console.error(`Error fetching driver with id ${id}:`, error);
        throw error;
      }
    },

    async create(driverData: DriverCreate): Promise<Driver> {
      try {
        // Generate UUID if not provided
        const newDriver = {
          id: driverData.id,
          ...driverData
        };

        // Validate the new driver
        const validatedDriver = driverSchema.parse(newDriver);

        const response = await axios.post(`${BASE_URL}/drivers`, validatedDriver);
        return response.data;
      } catch (error) {
        console.error('Error creating driver:', error);
        throw error;
      }
    },

    async update(id: string, driverData: Partial<Driver>): Promise<Driver> {
      try {
        // Fetch existing driver to merge with updates
        const existingDriver = await this.getById(id);
        
        // Merge existing data with updates
        const updatedDriver = {
          ...existingDriver,
          ...driverData
        };

        // Validate the updated driver
        const validatedDriver = driverSchema.parse(updatedDriver);

        const response = await axios.put(`${BASE_URL}/drivers/${id}`, validatedDriver);
        return response.data;
      } catch (error) {
        console.error(`Error updating driver with id ${id}:`, error);
        throw error;
      }
    },

    async delete(id: string): Promise<void> {
      try {
        await axios.delete(`${BASE_URL}/drivers/${id}`);
      } catch (error) {
        console.error(`Error deleting driver with id ${id}:`, error);
        throw error;
      }
    },

    // Additional utility methods
    async search(query: string): Promise<Driver[]> {
      try {
        const response = await axios.get(`${BASE_URL}/drivers`, {
          params: { q: query }
        });
        return response.data.map((driver: Driver) => driverSchema.parse(driver));
      } catch (error) {
        console.error('Error searching drivers:', error);
        throw error;
      }
    }
  },

  orders: {
    async getAll(): Promise<Order[]> {
      try {
        const response = await axios.get(`${BASE_URL}/orders`);
        return response.data.map((order: Order) => orderSchema.parse(order));
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },

    async getById(id: string): Promise<Order> {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${id}`);
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        return orderSchema.parse(data);
      } catch (error) {
        console.error(`Error fetching order with id ${id}:`, error);
        throw error;
      }
    },

    async create(orderData: Omit<Order, 'id'>): Promise<Order> {
      try {
        const response = await axios.post(`${BASE_URL}/orders`, orderData);
        return orderSchema.parse(response.data);
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },

    async update(id: string, orderData: Partial<Order>): Promise<Order> {
      try {
        const existingOrder = await this.getById(id);
        const updatedOrder = {
          ...existingOrder,
          ...orderData
        };

        const validatedOrder = orderSchema.parse(updatedOrder);

        const response = await axios.put(`${BASE_URL}/orders/${id}`, validatedOrder);
        return response.data;
      } catch (error) {
        console.error(`Error updating order with id ${id}:`, error);
        throw error;
      }
    },

    async delete(id: string): Promise<void> {
      try {
        await axios.delete(`${BASE_URL}/orders/${id}`);
      } catch (error) {
        console.error(`Error deleting order with id ${id}:`, error);
        throw error;
      }
    }
  }

};
