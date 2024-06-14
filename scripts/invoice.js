// import initDatabase from '../database.js';
$(document).ready(function() {
    function isFormFilled(form) {
        var isValid = true;
        form.find('input, select, textarea').each(function() {
            if ($(this).prop('required') && !$(this).val()) {
                isValid = false;
                return false; 
            }
        });
        return isValid;
    }


    function submitAllForms() {
        $('.invoice form').each(function() {
            if (!isFormFilled($(this))) {
                alert("لطفا فیلد های اجباری را پر کنید."); 
                return false; 
            }
            $(this).submit(); 
        });
    }

    $('.submit-all-forms').click(function() {
        submitAllForms(); 
    });
});

$(document).ready(function() {
    $('#invoiceDate').persianDatepicker({
        format: 'YYYY/MM/DD'
    });

    $('#menu-icon').click(function() {
        $('.menu-toggle').toggleClass('open');
    });
});

function updateTotals() {
    var totalQuantity = 0;
    var totalDiscount = 0;
    var totalFinalPrice = 0;

    $('.commodity-form').each(function() {
        var $form = $(this);
        var quantity = parseFloat($form.find('#customerNo').val()) || 0;
        var unitPrice = parseFloat($form.find('#unitprice').val()) || 0;
        var discount = parseFloat($form.find('#discount').val()) || 0;
        var finalPrice = parseFloat($form.find('#totalprice').val()) || 0;

        var totalPrice = quantity * unitPrice;
        var discountAmount = (discount / 100) * totalPrice;
        var priceAfterDiscount = totalPrice - discountAmount;

        totalQuantity += totalPrice; 
        totalDiscount += discountAmount; 
        totalFinalPrice += finalPrice; 
    });

    $('.Sum').text('مجموع : ' + totalQuantity.toFixed(2));
    $('.Discount').text('تخفیف : ' + totalDiscount.toFixed(2));
    $('.finalprice').text('قیمت نهایی : ' + totalFinalPrice.toFixed(2));
}


updateTotals();

$(document).on('click', '.add-commodity', function() {
    var $form = $('.commodity-form').first().clone();
    $form.find('input').val('');
    $('#forms-container').append($form);
    updateTotals(); 
});

$(document).on('click', '.remove-commodity', function() {
    $(this).closest('.commodity-form').remove();
    updateTotals(); 
});

$(document).on('input', '#customerNo, #unitprice, #discount', function() {
    var $form = $(this).closest('.commodity-form');
    var quantity = parseFloat($form.find('#customerNo').val()) || 0;
    var unitPrice = parseFloat($form.find('#unitprice').val()) || 0;
    var discount = parseFloat($form.find('#discount').val()) || 0;

    var totalPrice = quantity * unitPrice;
    var discountAmount = (discount / 100) * totalPrice;
    var finalPrice = totalPrice - discountAmount;

    $form.find('#totalprice').val(finalPrice.toFixed(2));

    updateTotals(); 
});

$(document).on('click', '.submit-all-forms', function() {
    var allForms = $('#forms-container').find('.commodity-form');
    allForms.each(function(index, form) {
        console.log($(form).serialize()); 
    });
});



// const invoiceForm = document.getElementById('invoiceForm');

// invoiceForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const db = await initDatabase();
//     const invoiceId = document.getElementById('invoiceId').value;
//     const customerId = document.getElementById('customerId').value;
//     const sellerId = document.getElementById('sellerId').value;
//     const items = JSON.parse(document.getElementById('items').value);
//     const totalAmount = parseFloat(document.getElementById('totalAmount').value);

//     await db.invoices.insert({
//         id: invoiceId,
//         customerId: customerId,
//         sellerId: sellerId,
//         items: items,
//         totalAmount: totalAmount,
//     });

//     alert('Invoice added!');
// });