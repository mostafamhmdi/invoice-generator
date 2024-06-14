import initDatabase from '../db.js'

document.addEventListener('DOMContentLoaded', () => {
  const sellerForm = document.getElementById('sellerdetails');

  sellerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const db = await initDatabase();
      const sellerName = document.getElementById('sellerName').value;
    const sellerFamily = document.getElementById('sellerfamily').value;
    const sellerCode = document.getElementById('id-code').value;
    const sellerNumber = document.getElementById('sellerNumber').value;
    const sellerEmail = document.getElementById('seleremail').value;
    const sellerAddress = document.getElementById('sellerAddress').value;

    await db.sellers.insert({
        // id: { type: 'string', primary: true },
          name: sellerName,
          family: sellerFamily,
          idcode: sellerCode,
          mobileNum: sellerNumber,
          email: sellerEmail,
          address: sellerAddress,
    });
    alert('seller added!');
    } catch (err) {
      console.error('Error adding customer:', err);
      alert('Failed to add customer. Please check the console for more details.');
    }
  });
});
