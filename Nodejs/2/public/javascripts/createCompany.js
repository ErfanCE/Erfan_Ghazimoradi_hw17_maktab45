$('#createForm').on('submit', function (e) {
    e.preventDefault();

    const data = {
        companyName: $('#companyName').val(),
        state: $('#state').val(),
        city: $('#city').val(),
        telephoneNumber: $('#telephoneNumber').val(),
        registerationNumber: $('#registerationNumber').val()
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:8000/company/create",
        data,
        success: function (response) {
            validation(response);
        }
    });
});

function validation(response) {
    creationResult(response);
    
    if (response === 'created') setTimeout(() => location.href = 'http://localhost:8000/company/companies', 3000);
}

function creationResult(status) {
    switch (status) {
        case 'created':
            displayAlert('created successfully.', '00a331');
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
    }, 3000);
}