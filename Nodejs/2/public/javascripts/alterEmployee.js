const employeeID = $('#employeeID').val();

// update company ajax
$('#updateForm').on('submit', function (e) {
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
        type: "PATCH",
        url: `http://localhost:8000/employee/update/${employeeID}`,
        data,
        success: function (response) {
            validation(response);
        }
    });
});

// delete company ajax
$('#deleteForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
        type: "DELETE",
        url: `http://localhost:8000/employee/delete/${employeeID}`,
        success: function (response) {
            $('.deleteAlert').css({
                'opacity': '1'
            });

            setTimeout(function () {
                $('.deleteAlert').css({
                    'opacity': '0'
                });
            }, 2000);

            
            setTimeout(() => location.href = 'http://localhost:8000/employee/employees', 2000);
        }
    });
});

function validation(response) {
    creationResult(response);

    if (response === 'updated' || response === 'updated-changed') setTimeout(() => location.href = `http://localhost:8000/employee/read/${employeeID}`, 2000);
}


function creationResult(status) {
    switch (status) {
        case 'updated':
            displayAlert('updated successfully.', '00a331');
            break;
        case 'updated-changed':
            displayAlert('updated and manager changed!', '00a331');
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