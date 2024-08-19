$(function () {

    $("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 300,
        labels: {
            next: "Next",
            previous: "Back",
            finish: "Submit"
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            $("section").hide();
            $("section").eq(newIndex).show();
            $('.steps ul').removeClass('step-2 step-3 step-4 step-5');
            $('.steps ul').addClass('step-' + (newIndex + 1));
            if (newIndex >= 2) {
                $('.actions ul').addClass('mt-7');
            } else {
                $('.actions ul').removeClass('mt-7');
            }
            return true;
        },
        onStepFinishing: function (event, currentIndex) {
            if (currentIndex === $(".steps ul li").length - 1) {
                $("#createButton").click(); // Trigger click on submit button
            }
            return true;
        },
        onFinished: function (event, currentIndex) {
            event.preventDefault(); // Prevent default form submission
            console.log($('#wizard').attr('action')); // Log the form action URL
            $('#wizard').submit();
        }
    });

    $("section").not(":first").hide();

    $('.grid .grid-item').click(function () {
        $('.grid .grid-item').removeClass('active');
        $(this).addClass('active');
    });

    $('.password i').click(function () {
        if ($('.password input').attr('type') === 'password') {
            $(this).next().attr('type', 'text');
        } else {
            $('.password input').attr('type', 'password');
        }
    });

    var dp1 = $('#dp1').datepicker().data('datepicker');
    dp1.selectDate(new Date());


    console.log('script ended');
});
