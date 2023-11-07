$(function () {
  const amenityCheckboxes = $('.amenities li input');
  const amenities = {};
  amenityCheckboxes.change((event) => {
    const key = event.target.attributes['data-id'].value;
    const value = event.target.attributes['data-name'].value;
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

  $('button').click(function () {
    fillPlaces();
  });

  const apiStatus = $('div#api_status');
  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });
  function fillPlaces () {
    const queryObjects = [];
    for (const key in amenities) {
      queryObjects.push(key);
    }
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({ amenities: queryObjects }),
      headers: { 'Content-Type': 'application/json' },
      success: function (data, status) {
        if (status === 'success') {
          const places = $('.places');
          places.empty();
          data.forEach(function (place) {
            const article = $([
              '<article>',
              "<div class='title_box'>",
              '   <h2>' + place.name + '</h2>',
              "   <div class='price_by_night'>$" + place.price_by_night + '</div>',
              '</div>',
              "<div class='information'>",
              "   <div class='max_guest'>" + 'Guest' + (place.max_guest === 1 ? ': ' : 's: ') + place.max_guest + '</div>',
              "   <div class='number_rooms'>" + 'Room' + (place.number_rooms === 1 ? ': ' : 's: ') + place.number_rooms + '</div>',
              "   <div class='number_bathrooms'>" + 'Bathroom' + (place.number_bathrooms === 1 ? ': ' : 's: ') + place.number_bathrooms + '</div>',
              '</div>',
              "<div class='user'>",
              // "   <b>Owner:</b>",
              '</div>',
              "<div class='description'>",
              place.description,
              '</div>',
              '</article>'
            ].join('\n'));
            places.append(article);
          });
        }
      }
    });
  }
  fillPlaces();
});
