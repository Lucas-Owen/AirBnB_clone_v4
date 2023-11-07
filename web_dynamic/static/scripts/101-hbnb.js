$(function () {
  const amenityCheckboxes = $('.amenities li input');
  const stateCheckboxes = $('.locations div > ul > li > input ');
  const cityCheckboxes = $('.locations div > ul > li > ul > li');
  const amenities = {};
  const states = {};
  const cities = {};
  fillPlaces();

  amenityCheckboxes.change((event) => {
    const element = $('.amenities h4');
    updateChecked(event, amenities);
    updateElement(element, amenities);
  });

  stateCheckboxes.change((event) => {
    const element = $('.locations h4');
    const items = {};
    updateChecked(event, states);
    Object.assign(items, states, cities);
    updateElement(element, items);
  });

  cityCheckboxes.change((event) => {
    const element = $('.locations h4');
    const items = {};
    updateChecked(event, cities);
    Object.assign(items, states, cities);
    updateElement(element, items);
  });

  $('button').click(function () {
    fillPlaces();
  });

  function updateChecked (event, items) {
    const key = event.target.attributes['data-id'].value;
    const value = event.target.attributes['data-name'].value;
    if (event.target.checked) {
      items[key] = value;
    } else {
      delete items[key];
    }
  }

  function updateElement (element, items) {
    const names = [];
    for (const k in items) {
      names.push(items[k]);
    }
    element.text(names.join(', '));
  }

  const apiStatus = $('div#api_status');
  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });
  function fillPlaces () {
    const amenityIds = [];
    const stateIds = [];
    const cityIds = [];
    for (const key in amenities) {
      amenityIds.push(key);
    }
    for (const key in states) {
      stateIds.push(key);
    }
    for (const key in cities) {
      cityIds.push(key);
    }
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({ amenities: amenityIds, states: stateIds, cities: cityIds }),
      headers: { 'Content-Type': 'application/json' },
      success: function (data, status) {
        if (status === 'success') {
          const places = $('.places');
          places.empty();
          data.forEach(function (place) {
            const article = $([
              '<article>',
              "   <div class='title_box'>",
              '      <h2>' + place.name + '</h2>',
              "      <div class='price_by_night'>$" + place.price_by_night + '</div>',
              '   </div>',
              "   <div class='information'>",
              "      <div class='max_guest'>" + 'Guest' + (place.max_guest === 1 ? ': ' : 's: ') + place.max_guest + '</div>',
              "      <div class='number_rooms'>" + 'Room' + (place.number_rooms === 1 ? ': ' : 's: ') + place.number_rooms + '</div>',
              "      <div class='number_bathrooms'>" + 'Bathroom' + (place.number_bathrooms === 1 ? ': ' : 's: ') + place.number_bathrooms + '</div>',
              '   </div>',
              "   <div class='user'>",
              // "   <b>Owner:</b>",
              '   </div>',
              "   <div class='description'>",
              place.description,
              '   </div>',
              "   <div class='reviews'>",
              '      <h2>Reviews</h2><span>show</span>',
              '      <ul>',
              '      </ul>',
              '   </div>',
              '</article>'
            ].join('\n'));
            $(article).find('.reviews > span').click((event) => {
              const reviewList = $(article).find('.reviews > ul');
              if (event.target.innerText === 'show') {
                event.target.innerText = 'hide';
                $.ajax({
                  url: 'http://localhost:5001/api/v1/places/' + place.id + '/reviews',
                  type: 'GET',
                  success: function (reviews, status) {
                    $(article).find('h2').text(reviews.length + ' Review' + (reviews.length === 1 ? '' : 's'));
                    reviews.forEach(review => {
                      $.ajax({
                        url: 'http://localhost:5001/api/v1/users/' + review.user_id,
                        method: 'GET',
                        success: function (user, status) {
                          const reviewElement = $([
                            '<li>',
                            '   <h3>' + user.first_name + ' ' + user.last_name /* + " " + review.created_at */ + '</h3>',
                            '   <p>' + review.text + '</p>',
                            '</li>'
                          ].join('\n'));
                          reviewList.append(reviewElement);
                        }
                      });
                    });
                  }
                });
              } else {
                event.target.innerText = 'show';
                reviewList.empty();
              }
            });
            places.append(article);
          });
        }
      }
    });
  }
});
