/* =====================================================
   SMART CAMPUS PLACEMENT ASSISTANT
   MAIN JAVASCRIPT
===================================================== */


document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Smart Campus Placement Assistant is running successfully."
    );


    /*
        Future modules will be connected here:

        1. Firebase Authentication
        2. Quiz System
        3. Dashboard
        4. Performance Analysis
        5. AI Placement Assistant
        6. Admin Panel
    */


    // Smooth navigation for internal links

    const navigationLinks =
        document.querySelectorAll('a[href^="#"]');


    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");


            if (targetId === "#") {
                return;
            }


            const targetElement =
                document.querySelector(targetId);


            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

});