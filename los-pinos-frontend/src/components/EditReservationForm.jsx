import React, { useState, useEffect } from 'react';

function EditReservationForm({ reservation, onUpdate, onCancel }) {
  // Estado interno para manejar los cambios en el formulario
  const [formData, setFormData] = useState(reservation);

  // Sincronizamos el estado del formulario si la reserva seleccionada cambia
  useEffect(() => {
    // Formateamos la fecha para que el input datetime-local la acepte
    const formattedDate = reservation.reservation_datetime.replace(' ', 'T').substring(0, 16);
    setFormData({ ...reservation, reservation_datetime: formattedDate });
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // Llamamos a la función del componente padre para actualizar
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Editando Reserva #{formData.id}</h3>
      <div>
        <label>Nombre:</label>
        <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} required />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required />
      </div>
      <div>
        <label>Fecha y Hora:</label>
        <input type="datetime-local" name="reservation_datetime" value={formData.reservation_datetime} onChange={handleChange} required />
      </div>
      <div>
        <label>Personas:</label>
        <input type="number" name="party_size" value={formData.party_size} onChange={handleChange} min="1" required />
      </div>
      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

export default EditReservationForm;