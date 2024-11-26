import React, { useMemo } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import Button from '../../../components/atoms/Button';
import Form from '../../../components/molecules/FormField';
import { HomeIcon } from 'lucide-react';
import styles from '../../../styles/Extra.module.scss';

import { orderSchema } from '../../../lib/validations';
import { useCreateOrder, useTrucks, useDrivers } from '../../../lib/api';
import { toast } from 'react-toastify';

const ORDER_STATUSES = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' }
] as const;

const CreateOrderPage: React.FC = () => {
  const router = useRouter();
  const createOrderMutation = useCreateOrder();
  const { data: trucks = [], isLoading: trucksLoading } = useTrucks();
  const { data: drivers = [], isLoading: driversLoading } = useDrivers();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: '',
      assigned_truck: '',
      assigned_driver: '',
      order_status: 'Pending'
    }
  });

  // Watch the assigned driver value to filter trucks
  const selectedDriverId = watch('assigned_driver');

  // Filter available trucks based on selected driver
  const availableTrucks = useMemo(() => {
    if (!selectedDriverId) return [];
    
    // Find the selected driver
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
    if (!selectedDriver) return [];

    // Filter trucks that are both available and assigned to the selected driver
    return trucks.filter(truck => 
      truck.status === 'Available' && 
      selectedDriver.assigned_truck === truck.id
    );
  }, [selectedDriverId, drivers, trucks]);

  // Filter only available drivers (those with assigned trucks)
  const availableDrivers = useMemo(() => 
    drivers.filter(driver => driver.assigned_truck),
    [drivers]
  );

  const onSubmit: SubmitHandler<z.infer<typeof orderSchema>> = async (data) => {
    try {
      await createOrderMutation.mutateAsync(data);
      toast.success('New order created successfully');
      reset();
      router.push('/dashboard/orders');
    } catch (error) {
      toast.error('Failed to create order');
      console.error(error);
    }
  };

  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Orders', link: '/dashboard/orders' },
    { name: 'Create Order', link: '/dashboard/orders/create' }
  ];

  return (
    <DashboardLayout title="Create Order">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.Headeractions}>
        <h1>Create New Order</h1>
        <Button 
          type="button" 
          variant="outline" 
          leftIcon={<XIcon />}
          onClick={() => reset()}
        >
          Reset Form
        </Button>
      </div>

      <div className="page-container">
        <Form onSubmit={handleSubmit(onSubmit)} className={styles.formGrid}>
          {/* Row 1 */}
          <div className="formGrid">
            <div>
              <Form.Field label="Customer Name">
                <Controller
                  name="customer_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Input
                        {...field}
                        placeholder="Enter Customer Name"
                        error={!!errors.customer_name}
                      />
                      {errors.customer_name && (
                        <div className={styles.errorMessage}>{errors.customer_name.message}</div>
                      )}
                    </div>
                  )}
                />
              </Form.Field>
            </div>

            <div>

            <Form.Field label="Truck Assigned">
                <Controller
                  name="assigned_truck"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      disabled={trucksLoading || !selectedDriverId}
                      error={errors.assigned_truck?.message}
                      options={
                        trucksLoading || !selectedDriverId
                          ? []
                          : availableTrucks.map((truck) => ({
                              value: truck.id,
                              label: `${truck.plateNumber}`,
                            }))
                      }
                    />
                  )}
                />
              </Form.Field>


            </div>
          </div>

          {/* Row 2 */}
          <div className="formGrid">
            <div>
            <Form.Field label="Driver Assigned">
                <Controller
                  name="assigned_driver"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      disabled={driversLoading}
                      error={errors.assigned_driver?.message}
                      options={
                        driversLoading
                          ? []
                          : availableDrivers.map((driver) => ({
                              value: driver.id,
                              label: driver.name,
                            }))
                      }
                    />
                  )}
                />
              </Form.Field>
            </div>

            <div>
              <Form.Field label="Order Status">
                <Controller
                  name="order_status"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      error={errors.order_status?.message}
                      options={ORDER_STATUSES}
                    />
                  )}
                />
              </Form.Field>
            </div>
          </div>

          <Form.Actions>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<SaveIcon />}
              loading={createOrderMutation.isLoading}
            >
              Create Order
            </Button>
          </Form.Actions>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default CreateOrderPage;