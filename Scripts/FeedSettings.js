
var allFeedsSettings = {} // default values, should be replaced by a db call

function GetFeedSettings() {
    $.ajax({ // ajax call to get JSON response from my Web API
        cache: false,
        type: "GET",
        url: "http://spa.nowakptr.com/api/FeedSettings",
        data: {
        },
        success: function (data) { // if API response goes OK
            //console.log(data);
            for (var i = 1; i <= maxFeedID; i++) {
                allFeedsSettings['postsPerFeed' + i] = data[(i - 1)].postsPerFeed;
                allFeedsSettings['postsPerView' + i] = data[(i - 1)].postsPerView;
                allFeedsSettings['feedName' + i] = data[(i - 1)].feedName;
                allFeedsSettings['accountID' + i] = data[(i - 1)].accountID;
                allFeedsSettings['feedType' + i] = data[(i - 1)].feedType;

                $('#feedType_input' + i).val(data[(i - 1)].feedType);
                $('#feedName_input' + i).val(data[(i - 1)].feedName);
                $('#accountID_input' + i).val(data[(i - 1)].accountID);
                $('#postsPerFeed_input' + i).val(data[(i - 1)].postsPerFeed);
                $('#postsPerView_input' + i).val(data[(i - 1)].postsPerView);
                //$('#displayOrder_input' + value).val(data[index].displayOrder);
            }

            GetAllFeeds();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Failed getting FeedDisplaySettings');
            // Handle the error somehow
        }
    }); // end ajax call
}

function SaveFeedSettings() {
    var token = sessionStorage.getItem('tokenKey')

    if (!token) // check if token is saved in browser, if not, ask user to log in
    {
        console.log('User not logged in, auth token not found');
    }
    else {
        var allFeedsSettings = [];

        $('.admin_table_row').each(function (row) { // iterate over all rows in admin table
            var inputValues = [];

            $(this).find("input,select").each(function () { // for each row, iterate over all inputs and selects
                inputValues.push(this.value); // store input/select values in array
            });

            var feedSettings = { // create object for each row of inputs
                FeedType: inputValues[0],
                FeedName: inputValues[1],
                AccountID: inputValues[2],
                PostsPerView: inputValues[3],
                postsPerFeed: inputValues[4]
                //DisplayOrder: 0
            }

            allFeedsSettings.push(feedSettings); // add settings object to all settings
        });

        //console.log(allFeedsSettings);
        var jsonSettings = JSON.stringify(allFeedsSettings);
        //console.log(jsonSettings);

        $.ajax({ // perform a POST call to API to save all settings
            type: 'POST',
            url: 'http://spa.nowakptr.com/api/FeedSettings',
            data: jsonSettings, // send JS object as JSON
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", 'Bearer ' + token);
            }
        }).done(function (data) {
            //console.log(data);
            GetFeedSettings();
        }).fail(function (xhr, ajaxOptions, thrownError) {
            if (thrownError == 'Unauthorized') // if we got here, we obviously had the token, but server returned 401
            {
                console.log('Token is not valid, might be expired');
                LogOut();
                alert('Your token is no longer valid. Please log in again');
            }

            console.log('Failed saving FeedDisplaySettings');
        });
    }
}

function UpdateAllFeedsSettingsFromTable() {
    for (var i = minFeedID; i <= maxFeedID; i++) {
        // iterate over each input setting type (in a table row)
        $.each(['feedType', 'feedName', 'accountID', 'postsPerFeed', 'postsPerView'], function (key, value) {
            allFeedsSettings[value + i] = $('#' + value + '_input' + i).val(); // save value of current row to replaced row in allFeedsSettings object
        });
    }
}

