$('#createForm').on('submit', function (e) {
    e.preventDefault();

    const data = {
        companyID: $('#companyID').val(),
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(),
        gender: $('#gender').val(),
        nationalNumber: $('#nationalNumber').val(),
        dateOfBirth: $('#dateOfBirth').val(),
        managerStatus: $('#managerStatus').val()
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:8000/employee/create",
        data,
        success: function (response) {
            validation(response);
        }
    });
});

function validation(response) {
    creationResult(response);

    if (response === 'created' || response === 'created-changed') setTimeout(() => location.href = 'http://localhost:8000/employee/employees', 2000);
}

function creationResult(status) {
    switch (status) {
        case 'created':
            displayAlert('created successfully.', '00a331');
            break;
        case 'created-changed':
            displayAlert('created and manager changed!', '00a331');
            break;
        default:
            displayAlert(status, 'da2c2c');
            break;
    }
}

function displayAlert(statusMsg, color) {
    $('.result').css({
        'opacity': '1',
        'background-color': `#${color}`
    });

    $('.result').html(`<p>${statusMsg}</p>`);

    setTimeout(function () {
        $('.result').css({
            'opacity': '0'
        });
    }, 2000);
}