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

    $(document).click(function(event) {
        if (!$(event.target).closest('.menu-toggle').length) {
            $('.menu-toggle').removeClass('open');
        }
    });

    $(document).on('click', '.add-commodity', function() {
        var $form = $('.commodity-form').first().clone();
        $form.find('input').val('');
        $('#forms-container').append($form);
    });

    $(document).on('click', '.remove-commodity', function() {
        $(this).closest('.commodity-form').remove();
    });

    $(document).on('click', '.submit-all-forms', function() {
        var allForms = $('#forms-container').find('form');
        allForms.each(function(index, form) {
            console.log($(form).serialize()); 
        });
    });
});