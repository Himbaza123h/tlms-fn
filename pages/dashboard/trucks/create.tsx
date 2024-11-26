import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Breadcrumbs from '../../../components/atoms/Breadcrumbs';
import Button from '../../../components/atoms/Button';
import Form from '../../../components/molecules/FormField';
import { HomeIcon } from 'lucide-react';
import styles from '../../../styles/Extra.module.scss';

import { truckSchema, Truck } from '../../../lib/validations';
import { useCreateTruck } from '../../../lib/api';
import { toast } from 'react-toastify';

const CreateTruckPage: React.FC = () => {
const router = useRouter();
const createTruckMutation = useCreateTruck();

const {
control,
handleSubmit,
formState: { errors },
reset
} = useForm<Omit<Truck, 'id'>>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
    status: 'Available'
    }
    });

    const breadcrumbs = [
    { name: 'Home', link: '/dashboard', icon:
    <HomeIcon /> },
    { name: 'Trucks', link: '/dashboard/trucks' },
    { name: 'Create Truck', link: '/dashboard/trucks/create' }
    ];

    const onSubmit: SubmitHandler<Omit<Truck, 'id'>> = async (data) => {
        try {
        await createTruckMutation.mutateAsync(data);

        toast.success('new truck added successfully');
        router.push('/dashboard/trucks');

        } catch (error) {
            toast.error('Failed to create truck');
        }
        };

        return (
        <DashboardLayout title="Create Trucks">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className={styles.Headeractions}>
                <h1>Create New Truck</h1>
                <Button type="button" variant="outline" leftIcon={<XIcon />}
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
                            <Form.Field label="Plate Number">
                                <Controller name="plateNumber" control={control} render={({ field })=> (
                                    <div>
                                        <Form.Input {...field} placeholder="Enter Truck Plate Number"
                                            error={!!errors.plateNumber} />
                                        {errors.plateNumber && (
                                        <div className={styles.errorMessage}>{errors.plateNumber.message}</div>
                                        )}
                                    </div>
                                    )}
                                    />
                            </Form.Field>
                        </div>

                        <div>
                            <Form.Field label="Capacity (Tons)">
                                <Controller name="capacity" control={control} render={({ field: { onChange, ...field }
                                    })=> (
                                    <div>
                                        <Form.Input {...field} type="number" placeholder="Enter Truck Capacity"
                                            onChange={(e)=> onChange(Number(e.target.value))}
                                            error={!!errors.capacity}
                                            />
                                            {errors.capacity && (
                                            <div className={styles.errorMessage}>{errors.capacity.message}</div>
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
                            <Form.Field label="Truck Model">
                                <Controller name="model" control={control} render={({ field })=> (
                                    <div>
                                        <Form.Input {...field} placeholder="Enter Truck Model" error={!!errors.model} />
                                        {errors.model && <div className={styles.errorMessage}>{errors.model.message}
                                        </div>}
                                    </div>
                                    )}
                                    />
                            </Form.Field>
                        </div>

                        <div>
                            <Form.Field label="Manufacturing Year">
                                <Controller name="year" control={control} render={({ field: { onChange, ...field }
                                    })=> (
                                    <div>
                                        <Form.Input {...field} type="number" placeholder="Year of Manufacture"
                                            onChange={(e)=> onChange(Number(e.target.value))}
                                            error={!!errors.year}
                                            />
                                            {errors.year && <div className={styles.errorMessage}>{errors.year.message}
                                            </div>}
                                    </div>
                                    )}
                                    />
                            </Form.Field>
                        </div>
                    </div>

                    {/* Full width field */}
                    <div className="form-full-width">
                        <Form.Field label="Truck Status">
                            <Controller name="status" control={control} render={({ field })=> (
                                <div>
                                    <Form.RadioGroup options={[ { value: 'Available' , label: 'Available' }, {
                                        value: 'Delivering' , label: 'Delivering' }, { value: 'Maintenance' ,
                                        label: 'Maintenance' } ]} value={field.value} onChange={field.onChange}
                                        error={errors.status?.message} />
                                    {errors.status && <div className={styles.errorMessage}>{errors.status.message}</div>
                                    }
                                </div>
                                )}
                                />
                        </Form.Field>
                    </div>

                    <Form.Actions>
                        <Button type="submit" variant="primary" leftIcon={<SaveIcon />}
                        loading={createTruckMutation.isLoading}
                        >
                        Create Truck
                        </Button>
                    </Form.Actions>
                </Form>
            </div>
        </DashboardLayout>
        );
        };

        export default CreateTruckPage;
