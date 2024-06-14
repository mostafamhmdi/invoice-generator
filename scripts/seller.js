import initDatabase from '../db.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');
  const sellerForm = document.getElementById('sellerdetails');

  sellerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submit event triggered');
    try {
      const db = await initDatabase();
      console.log('Database initialized');

      const sellerName = document.getElementById('sellerName').value;
      const sellerFamily = document.getElementById('sellerfamily').value;
      const sellerCode = document.getElementById('id-code').value;
      const sellerNumber = document.getElementById('sellerNumber').value;
      const sellerEmail = document.getElementById('selleremail').value;
      const sellerAddress = document.getElementById('sellerAddress').value;

      console.log('Form values:', {
        sellerName,
        sellerFamily,
        sellerCode,
        sellerNumber,
        sellerEmail,
        sellerAddress
      });

      await db.sellers.add({
        name: sellerName,
        family: sellerFamily,
        idcode: sellerCode,
        mobileNum: sellerNumber,
        email: sellerEmail,
        address: sellerAddress,
      });

      alert('Seller added successfully!');
    } catch (err) {
      console.error('Error adding seller:', err);
      alert('Failed to add seller. Please check the console for more details.');
    }
  });
});
