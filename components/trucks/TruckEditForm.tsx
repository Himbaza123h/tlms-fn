import React from 'react';
import Button from '@/components/atoms/Button';


interface TruckEditFormProps {
  initialData: {
    plateNumber: string;
    capacity: number;
  };
  onSubmit: (data: { plateNumber: string; capacity: number }) => Promise<void>;
  onCancel: () => void;
}

const TruckEditForm: React.FC<TruckEditFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formGroup}>
        <label htmlFor="plateNumber" className={styles.label}>Plate Number:</label>
        <input
          type="text"
          id="plateNumber"
          name="plateNumber"
          value={formData.plateNumber}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="capacity" className={styles.label}>Capacity (tons):</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          className={styles.input}
          min="0"
          step="0.1"
          required
        />
      </div>

      <div className="mt-4 flex gap-4">
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TruckEditForm;