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
            
            $('.submit-all-forms').hide();
            $('.remove-commodity').hide();
            $('.add-commodity').hide();


            const { jsPDF } = window.jspdf;
    
            html2canvas(document.querySelector('.invoice')).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
                if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                    let yOffset = pdf.internal.pageSize.getHeight(); // Height of the first page
                    while (yOffset < pdfHeight) {
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfWidth, pdfHeight);
                        yOffset += pdf.internal.pageSize.getHeight();
                    }
                }
    
                pdf.save('invoice.pdf');
                
                // Show the button or any elements again
                $('.submit-all-forms').show();
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

        if (discount > 100) {
            discount = 100;
            $form.find('#discount').val(100);
        }

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

function updateRemoveButtons() {
    if ($('.commodity-form').length > 1) {
        $('.remove-commodity').show();
    } else {
        $('.remove-commodity').hide();
    }
}

function restrictNumericInput(event) {
    // Allow: backspace, delete, tab, escape, enter, and .
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    // Allow: home, end, left, right, down, up
    const allowedKeys = [
        46, 8, 9, 27, 13, 110, 190, // backspace, delete, tab, escape, enter and .
        65, 67, 86, 88, // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        35, 36, 37, 38, 39, 40 // home, end, left, right, down, up
    ];
    if (allowedKeys.includes(event.keyCode) ||
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 40)) {

        return;
    }

    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault();
    }
}

function validateDiscountInput() {

    var discount = parseFloat($(this).val()) || 0;
    if (discount > 100) {
        $(this).val(100);
    }
}

function addEventListeners() {

    $(document).on('keydown', '#customerNo, #unitprice, #totalprice', restrictNumericInput);
    $(document).on('input', '#discount', validateDiscountInput);
}


$(document).ready(function() {
    updateTotals();
    updateRemoveButtons();
    addEventListeners();
});

$(document).on('click', '.add-commodity', function() {
    var $form = $('.commodity-form').first().clone();
    $form.find('input').val('');
    $('#forms-container').append($form);
    updateTotals();
    updateRemoveButtons();
});

$(document).on('click', '.remove-commodity', function() {
    $(this).closest('.commodity-form').remove();
    updateTotals();
    updateRemoveButtons();
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



document.getElementById('photo1').addEventListener('change', function(event) {
    handleFileSelect(event, 'photo1', 'preview-photo1');
});

document.getElementById('photo3').addEventListener('change', function(event) {
    handleFileSelect(event, 'photo3', 'preview-photo3');
});

function handleFileSelect(event, inputId, imgId) {
    var input = document.getElementById(inputId);
    var preview = document.getElementById(imgId);
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            input.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}
