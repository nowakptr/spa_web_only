function ControlAdminButtons() {
    var token = sessionStorage.getItem('tokenKey')

    if (!token) // check if token is saved in browser, if not show log in button
    {
        $('#logIn_button').show();
        $('#logOut_button').hide();
        $('#showAdminPanel_button').hide();
    }
    else {
        $('#logIn_button').hide();
        $('#logOut_button').show();
        $('#showAdminPanel_button').show();
    }
}

function ControlAdminPanel(force) { // show/hide admin panel
    if (!force) // if force is null
    {
        $('#admin_panel').toggle();
        $('#page_nav_logo').toggle();
        $('#page_nav_overlay').toggle();
        $('#page_nav_list').toggle();

        if ($('#admin_panel').is(':visible'))
        {
            originalNavHeight = 220; // when showing admin panel, 'lock' top bar to not resize
            minimumNavHeight = 220;
            $('#body_container').css('margin', '240px 0 0 0');
            $('#page_nav').css('height', '220px');
            $('#page_nav_overlay').css('height', '220px');
            NavigationResizing();
            //window.scrollTo(0, 0);
        }
        else
        {
            originalNavHeight = 400 // when hiding admin panel, allow top bar resizing again
            minimumNavHeight = 65;            
            $('#body_container').css('margin', '420px 0 0 0');
            $('#page_nav').css('height', '400px');
            $('#page_nav_overlay').css('height', '400px');            
            NavigationResizing();
            window.scrollTo(0, 0);
        }
    }
    else if (force == 'hide') {
        $('#admin_panel').hide();
        $('#page_nav_logo').show();
        $('#page_nav_overlay').show();
        $('#page_nav_list').show();

        originalNavHeight = 400 // when hiding admin panel, allow top bar resizing again
        minimumNavHeight = 65;
        $('#body_container').css('margin', '420px 0 0 0');
        $('#page_nav').css('height', '400px');
        $('#page_nav_overlay').css('height', '400px');
        NavigationResizing();
        window.scrollTo(0, 0);
    }
    else if (force == 'show') {
        $('#admin_panel').show();
        $('#page_nav_logo').hide();
        $('#page_nav_overlay').hide();
        $('#page_nav_list').hide();

        originalNavHeight = 220; // when showing admin panel, 'lock' top bar to not resize
        minimumNavHeight = 220;
        $('#body_container').css('margin', '240px 0 0 0');
        $('#page_nav').css('height', '220px');
        $('#page_nav_overlay').css('height', '220px');
        NavigationResizing();
       // window.scrollTo(0, 0);
    }
}

function ControlLoginPanel(visibility) { // hide/show login window
    if (visibility == 'show') {
        $('#login_window').show();
        $('#login_userName_input').focus();
        UpdateLoginStatus();
    }
    else if (visibility == 'hide') {
        $('#login_window').hide();
        UpdateLoginStatus();
    }
}

function LogIn() { // send authorization request with credentials from login window
    var credentials = {
        grant_type: 'password',
        UserName: $('#login_userName_input').val(),
        Password: $('#login_password_input').val()
    };

    UpdateLoginStatus('Requesting Token...', 'default');
    GetToken(credentials);
}

function GetToken(credentials) { // get bearer token with credentials
    $.ajax({
        type: 'POST',
        url: 'http://spa.nowakptr.com/Token',
        data: credentials
    }).done(function (data) {
        //console.log(data);
        // Cache the access token in session storage.
        sessionStorage.setItem('tokenKey', data.access_token);
        UpdateLoginStatus('Logged In', 'green');
        ControlAdminButtons(); // update state of AdminButtons on top panel
        ControlLoginPanel('hide'); // on successful login - hide login window            
    }).fail(function (xhr, ajaxOptions, thrownError) {
        UpdateLoginStatus('Login Failed', 'red');
    });
}

function UpdateLoginStatus(status, color) { // update status of login window
    $('#login_query_result_td').empty();

    if (color == 'default') {
        $('#login_query_result_td').css('color', '#6B6B6B');
    }
    else if (color) { $('#login_query_result_td').css('color', color); }

    $('#login_query_result_td').append(status);
}

function LogOut() { // logout - remove authorization token from browser session store
    sessionStorage.removeItem('tokenKey');
    ControlAdminPanel('hide');
    ControlAdminButtons();
}

function MoveFeed(direction, feedID) { // move admin settings table row up or down, save to allFeedsSettings, re-render feeds
    if (!direction) {
        console.log('Direction parameter was not supplied');
        return;
    }

    switch (direction) {
        case 'up':
            if (feedID <= minFeedID || feedID > maxFeedID) { return; } // make sure feedID is not out of bounds (smaller than min, larger than max)
            else { replacedFeedID = feedID - 1; } // 'replacedFeedID' is the one the current row is moving to
            break;
        case 'down':
            if (feedID >= maxFeedID || feedID < minFeedID) { return; }
            else { replacedFeedID = feedID + 1; }
            break;
    }

    temp = {}; // store all settings in a temp object

    $.each(['feedType', 'feedName', 'accountID', 'postsPerFeed', 'postsPerView'], function (key, value) {
        temp[value] = $('#' + value + '_input' + replacedFeedID).val(); // save value of replaced row to temp

        $('#' + value + '_input' + replacedFeedID).val($('#' + value + '_input' + feedID).val()); // move value of current row to replaced row in table
        allFeedsSettings[value + replacedFeedID] = $('#' + value + '_input' + feedID).val(); // save value of current row to replaced row in allFeedsSettings object

        $('#' + value + '_input' + feedID).val(temp[value]); // save temp (replaced row) value back to current row
        allFeedsSettings[value + feedID] = temp[value]; // save temp (replaced row) value back to allFeedsSettings object
    });

    GetAllFeeds();
}
