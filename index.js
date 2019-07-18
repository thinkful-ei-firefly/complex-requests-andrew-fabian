'use strict';

// replace this 👇 with your API key
const apiKey = 'WjWy0yBLjdo7P32FzOZoCKxLDMuw4HImKHnGe0ew';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

/**
 * Creates a query string from a params object
 * @param {object} params 
 * @returns {string} query string
 */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

/**
 * Performs the fetch call to get news
 * @param {string} query 
 * @param {number} maxResults 
 */
function getNews(inputStateCode, maxResults) {
  const params = {
    stateCode: inputStateCode,
    api_key: apiKey,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  console.log(`queryString is ${queryString}`)
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/**
 * Appends formatted HTML results to the page
 * @param {object} responseJson 
 * @param {number} maxResults 
 */ 
function displayResults(responseJson, maxResults) {
  console.log('responseJson: ',responseJson);
  // clear the error message
  $('#js-error-message').empty();
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  responseJson.data.forEach(park => {
    // For each object in the articles array:
    // Add a list item to the results list with 
    // the article title, source, author,
    // description, and image
    console.log(park.fullName);
    $('#results-list').append(
      `
        <li>
        <h3>${park.fullName}</h3>
        <p>${park.description}</p>
        <p><a href="${park.directionsUrl}">${park.directionsUrl}</a></p>
        </li>
      `
    );
  });
  // unhide the results section  
  $('#results').removeClass('hidden');
}

/**
 * Handles the form submission
 */
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateCode = $('#js-state-code').val();
    const maxResults = $('#js-max-results').val();
    console.log(`statecode is ${stateCode}`);
    getNews(stateCode, maxResults);
  });
}

$(watchForm);