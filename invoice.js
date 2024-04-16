$(document).ready(function() {
    // Function to check if a form is filled
    function isFormFilled(form) {
        var isValid = true;
        form.find('input, select, textarea').each(function() {
            if ($(this).prop('required') && !$(this).val()) {
                isValid = false;
                return false; // Break the loop if any required field is empty
            }
        });
        return isValid;
    }

    // Function to submit all forms
    function submitAllForms() {
        $('.invoice form').each(function() {
            if (!isFormFilled($(this))) {
                alert("Please fill in all required fields."); // Alert if any required field is empty
                return false; // Prevent form submission
            }
            $(this).submit(); // Submit the form if all required fields are filled
        });
    }

    // Event listener for the submit all forms button
    $('.submit-all-forms').click(function() {
        submitAllForms(); // Call the function to submit all forms
    });
});
