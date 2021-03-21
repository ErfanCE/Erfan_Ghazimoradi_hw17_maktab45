const companyID = $('#companyID').val();

// update company ajax
$('#updateForm').on('submit', function (e) {
    e.preventDefault();

    const data = {
        companyName: $('#companyName').val(),
        state: $('#state').val(),
        city: $('#city').val(),
        telephoneNumber: $('#telephoneNumber').val(),
        registerationNumber: $('#registerationNumber').val(),
    };

    $.ajax({
        type: "PATCH",
        url: `http://localhost:8000/company/update/${companyID}`,
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
        url: `http://localhost:8000/company/delete/${companyID}`,
        success: function (response) {
            $('.deleteAlert').css({
                'opacity': '1'
            });

            setTimeout(function () {
                $('.deleteAlert').css({
                    'opacity': '0'
                });
            }, 2000);

            setTimeout(() => location.href = 'http://localhost:8000/company/companies', 2000);
        }
    });
});


function validation(response) {
    creationResult(response);

    if (response === 'updated') setTimeout(() => location.href = `http://localhost:8000/company/read/${companyID}`, 2000);
}

function creationResult(status) {
    switch (status) {
        case 'updated':
            displayAlert('updated successfully.', '00a331');
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