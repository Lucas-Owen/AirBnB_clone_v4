$(function () {
  const amenityCheckboxes = $('.amenities li input');
  const amenities = {};
  amenityCheckboxes.change((event) => {
    const key = event.target.attributes['data-id'].value;
    const value = event.target.attributes['data-name'].value;
    console.log('value');
    if (event.target.checked) {
      amenities[key] = value;
    } else {
      delete amenities[key];
    }
    const amenitiesH4 = $('.amenities h4');
    const names = [];
    for (const k in amenities) {
      names.push(amenities[k]);
    }
    amenitiesH4.text(names.join(', '));
  });

  const apiStatus = $('div#api_status');
  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });
});
