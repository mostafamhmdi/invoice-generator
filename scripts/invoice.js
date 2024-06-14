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
