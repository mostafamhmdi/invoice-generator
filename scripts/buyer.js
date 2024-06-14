import initDatabase from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const customerForm = document.getElementById('custdetails');

  if (customerForm) {
    customerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Form submitted');
      try {
        const db = await initDatabase();
        const customerName = document.getElementById('customerName').value;
        const customerFamily = document.getElementById('customerfamily').value;
        const customerCode = document.getElementById('id-code').value;
        const customerNumber = document.getElementById('customerNumber').value;
        const customerEmail = document.getElementById('customeremail').value;
        const customerAddress = document.getElementById('customerAddress').value;

        await db.customers.insert({
          idcode: customerCode,
          name: customerName,
          family: customerFamily,
          mobileNum: customerNumber,
          email: customerEmail,
          address: customerAddress,
        });

        alert('Customer added!');
      } catch (err) {
        console.log(err);
        console.error('Error adding customer:', err);
        alert('Failed to add customer. Please check the console for more details.');
      }
    });
  } else {
    console.error('Customer form not found!');
  }
});
