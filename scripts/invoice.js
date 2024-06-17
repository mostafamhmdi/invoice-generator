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
        var allFormsValid = true;
        $('.invoice form').each(function() {
            if (!isFormFilled($(this))) {
                alert("لطفا فیلد های اجباری را پر کنید."); 
                allFormsValid = false;
                return false;
            }
        });

        if (allFormsValid) {
            $('.invoice form').each(function() {
                // Optional: Perform any additional form submission logic here
                console.log($(this).serialize());
            });
            return true;
        } else {
            return false;
        }
    }

    $('.submit-all-forms').click(function(event) {
        event.preventDefault(); // Prevent default form submission
        if (submitAllForms()) {
            const { jsPDF } = window.jspdf;

            html2canvas(document.querySelector('.invoice')).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            });
        }
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


$(document).ready(function() {
    $('#sellerCode').on('change', function() {
        const idcode = $(this).val();
        $.ajax({
            url: '/check-seller',
            method: 'GET',
            data: { idcode },
            success: function(data) {
                $('#sellerName').val(data.name);
                $('#sellerNumber').val(data.mobileNum);
                $('#sellerAddress').val(data.address);
                
            },
            error: function(xhr) {
                if (xhr.status === 404) {
                    alert('Seller not found. Please add the seller.');
                } else {
                    alert('An error occurred while checking the seller.');
                }
            }
        });
    });

    $('#customerCode').on('change', function() {
        const idcode = $(this).val();
        $.ajax({
            url: '/check-buyer',
            method: 'GET',
            data: { idcode },
            success: function(data) {
                $('#customerName').val(data.name);
                $('#customerNumber').val(data.mobileNum);
                $('#customerAddress').val(data.address);
                
            },
            error: function(xhr) {
                if (xhr.status === 404) {
                    alert('Buyer not found. Please add the buyer.');
                } else {
                    alert('An error occurred while checking the buyer.');
                }
            }
        });
    });
});



