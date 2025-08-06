// utils/slots.js
const generateSlots = () => {
  const slots = [];
  for (let hour = 7; hour < 23; hour++) {
    const from = hour.toString().padStart(2, '0') + ':00';
    const to = (hour + 1).toString().padStart(2, '0') + ':00';
    slots.push(`${from}-${to}`);
  }
  return slots;
};

export default generateSlots;
