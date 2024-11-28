import React from 'react';
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

import { driverCreateSchema } from '../../../lib/validations';
import { useCreateDriver, useTrucks } from '../../../lib/api';
import { toast } from 'react-toastify';

const CreateDriverPage: React.FC = () => {
  const router = useRouter();
  const createDriverMutation = useCreateDriver();
  const { data: trucks = [], isLoading: trucksLoading } = useTrucks();

  // Filter only available trucks
  const availableTrucks = trucks.filter(truck => truck.status === 'Available');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof driverCreateSchema>>({
    resolver: zodResolver(driverCreateSchema),
    defaultValues: {
      name: '',
      license_number: '',
      contact_number: '',
      assigned_truck: ''
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof driverCreateSchema>> = async (data) => {
    try {
      await createDriverMutation.mutateAsync(data);
      toast.success('New driver added successfully');
      reset();
      router.push('/dashboard/drivers');
    } catch (error) {
      toast.error('Failed to create driver');
      console.error(error);
    }
  };

  const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon: <HomeIcon /> },
    { name: 'Drivers', link: '/dashboard/drivers' },
    { name: 'Create Driver', link: '/dashboard/drivers/create' }
  ];

  return (
    <DashboardLayout title="Create Driver">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.Headeractions}>
        <h1>Create New Driver</h1>
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
              <Form.Field label="Driver Name">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Input
                        {...field}
                        placeholder="Enter Driver Name"
                        error={!!errors.name}
                      />
                      {errors.name && (
                        <div className={styles.errorMessage}>{errors.name.message}</div>
                      )}
                    </div>
                  )}
                />
              </Form.Field>
            </div>

            <div>
              <Form.Field label="License Number">
                <Controller
                  name="license_number"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Input
                        {...field}
                        placeholder="Enter License Number"
                        error={!!errors.license_number}
                      />
                      {errors.license_number && (
                        <div className={styles.errorMessage}>
                          {errors.license_number.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </Form.Field>
            </div>
          </div>

          {/* Row 2 */}
          <div className="formGrid">
            <div>
              <Form.Field label="Contact Number">
                <Controller
                  name="contact_number"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Input
                        {...field}
                        placeholder="Enter Contact Number"
                        error={!!errors.contact_number}
                      />
                      {errors.contact_number && (
                        <div className={styles.errorMessage}>
                          {errors.contact_number.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </Form.Field>
            </div>

            <div>
              <Form.Field label="Assign Truck">
                <Controller
                  name="assigned_truck"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      disabled={trucksLoading}
                      error={errors.assigned_truck?.message}
                      options={
                        trucksLoading
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

          <Form.Actions>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<SaveIcon />}
              loading={createDriverMutation.isLoading}
            >
              Create Driver
            </Button>
          </Form.Actions>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default CreateDriverPage;