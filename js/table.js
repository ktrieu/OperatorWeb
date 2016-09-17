function initDataTable(json) {
	$('#data-table').DataTable({
		'dataSrc': '',
		'destroy': true,
		'info': false,
		'order': [[5, 'asc'], [6, 'asc']],
		'ordering': true,
		'paging': false,
		'processing': false,
		'searching': false,
		'serverSide': false,
		'stateSave': true,

		'ajax': function(data, callback, settings) {
			var prevData = $('#data-table').data('data');

			clearTable();
			callback(json);

			if ($('body').hasClass('initialized')) { // same page
				if (JSON.stringify(prevData) == JSON.stringify(data)) { // same data
					console.log('same page, same data');
				}
				else { // new data
					console.log('same page, new data');

					$('#data-table').data('data', data);
				}
			}
			else { // new page
				if (jQuery.isEmptyObject(json)) { // no data
					console.log('new page, no data');
				}
				else { // yes data
					console.log('new page, yes data');
				}

                emergenciesEventHandler();
                $('#data-table').data('data', data);  
				$('body').addClass('initialized');              
			}
		},

		'columnDefs': [
            {
                'data': 'category',
                'targets': 0,
                'title': 'Category',
                'orderable': true
            },
            {
                'data': 'street',
                'targets': 1,
                'title': 'Street',
                'orderable': true
            },
            {
                'data': 'city',
                'targets': 2,
                'title': 'City',
                'orderable': true
            },
            {
                'data': 'province',
                'targets': 3,
                'title': 'Province',
                'orderable': true
            },
            {
                'data': 'postalCode',
                'targets': 4,
                'title': 'Postal Code',
                'orderable': true
            },
            {
                'data': 'initTime',
                'targets': 5,
                'title': 'Date',
                'orderable': true,
                'render': function(data, type, full, meta) {
                    return formatDate(data);
                }
            },
            {
                'data': 'initTime',
                'targets': 6,
                'title': 'Time',
                'orderable': true,
                'render': function(data, type, full, meta) {
                    return formatTime(data);
                }
            },
            {
                'data': 'level',
                'targets': 7,
                'title': 'Level',
                'orderable': true
            }
        ],

        'drawCallback': function(settings) {
            var api = this.api();

            api.rows().every(function() {
                var data = this.data();
                $(this.node()).attr('id', data.id);
            });
        }
	});
}

function clearTable() {
    var link = '';

    switch (globalEmergencies) {
        case 1:
            link = '/pending';
            break;
        case 2:
            link = '/in-progress';
            break;
        case 3:
            link = '/complete';
            break;
        case 4:
            link = '/archives';
            break;
        case 5:
            link = '/trash';
            break;
    }
    
    // synchronize side menu with url
    $('#sidebar-wrapper ul').css('display', '');
    $('#sidebar-wrapper li.active').removeClass('active').removeClass('open');
    $('#sidebar-wrapper li:has(a[href="' + link + '"])').addClass('active').addClass('open');

    // close side menu
    $('[data-uw-action="sidebar-open"]').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    
    var selection = document.querySelector('#dynamic-sidebar-style');
    if (selection) {
        selection.textContent = '';
    }
    
    $('.alert').hide(); // remove alerts
    $('#page-content-wrapper').removeClass('toggled');
    $('#sidebar-backdrop').remove();

    $('#data-table tbody').empty();
}

function emergenciesEventHandler() {
    $('#data-table tbody').on('click', 'tr', function() {
        globalEmergency = $(this).attr('id');
        loadEmergencyAjax();
    });
}