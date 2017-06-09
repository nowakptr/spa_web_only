var originalNavHeight = 400
var originalNavButtonHeight = 100; // button height = 50px + margin-top/bottom 25px = total 100
var originalLogoHeight = 200;
var minimumNavHeight = 65;
var minimumNavOpacity = 0.1;
var maximumNavOpacity = 0.65;
var minimumButtonOpacity = 0.0;
var maximumButtonOpacity = 0.4;

function NavigationResizing() {
    var scrollResizeLimit = originalNavHeight - minimumNavHeight; // amount of allowed scrolling before banner resize stops

    window.addEventListener('scroll', function (e) {
        var scrollDistanceY = window.pageYOffset || document.documentElement.scrollTop,
        header = document.querySelector("header");

        if (scrollDistanceY < scrollResizeLimit) {
            ///// nav size
            $("#page_nav").height(originalNavHeight - scrollDistanceY);
            $("#page_nav_overlay").height(originalNavHeight - scrollDistanceY);

            ///// nav opacity
            var opacity = (scrollDistanceY / originalNavHeight);
            if (opacity < minimumNavOpacity) { opacity = minimumNavOpacity; }
            else if (opacity > maximumNavOpacity) { opacity = maximumNavOpacity; }

            $("#page_nav").css("background-color", "rgba(0,0,0," + opacity + ")");

            ///// logo size
            var logoHeight = originalLogoHeight;
            if (scrollDistanceY > originalLogoHeight) { logoHeight = originalLogoHeight * 2 - scrollDistanceY; }

            $("#page_nav_logo").height(logoHeight);

            ///// resize button if banner is too small to fit it - actual button height is half of defined size to account for top-margin
            var navButtonHeight = originalNavButtonHeight / 2;
            if (scrollDistanceY > (originalNavHeight - originalNavButtonHeight)) { navButtonHeight = (originalNavHeight - scrollDistanceY) / 2; }

            $.each($(".resizable_menu_btn"), function () {
                $(this).height(navButtonHeight);
                $(this).css("line-height", navButtonHeight + "px");
            });

            ////// deal with button top margin - margin is a 4th of the total button size (top margin [1/4], button [2/4], bottom-margin [1/4] = 1);
            var navButtonTopMargin = originalNavButtonHeight / 4;

            var buttonOpacity = (1 - maximumButtonOpacity - (scrollDistanceY / originalNavHeight));
            if (buttonOpacity < minimumButtonOpacity) { buttonOpacity = minimumButtonOpacity; }
            else if (buttonOpacity > maximumButtonOpacity) { buttonOpacity = maximumButtonOpacity; }

            $.each($(".resizable_menu_li"), function () {
                $(this).css("margin-top", navButtonTopMargin + "px");
                $(this).css("background-color", "rgba(0, 0, 0, " + buttonOpacity + ")");
            });
        }
        else if (scrollDistanceY > scrollResizeLimit) {
            $("#page_nav").height(minimumNavHeight);
            $("#page_nav_overlay").height(minimumNavHeight);
            $("#page_nav_logo").height(minimumNavHeight);
            $("#page_nav").css("background-color", "rgba(0,0,0," + maximumNavOpacity + ")");

            $.each($(".resizable_menu_btn"), function () {
                $(this).height(minimumNavHeight / 2);
                $(this).css("line-height", (minimumNavHeight / 2) + "px");
            });

            $.each($(".resizable_menu_li"), function () {
                $(this).css("margin-top", (minimumNavHeight / 4) + "px");
                $(this).css("background-color", "rgba(0, 0, 0, " + minimumButtonOpacity + ")");
            });
        }
    });
}