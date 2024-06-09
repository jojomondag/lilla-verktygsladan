// fetch_schedule.js
(function() {
    // Confirm script load
    alert("Content script loaded");

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "fetch_schedule") {
            alert(document.title); // Alert the title of the page
            let headerContent = getHeaderContent();
            alert(headerContent); // Alert the content of the header
            sendResponse({ success: true });
        }
    });

    function getHeaderContent() {
        let headerElement = document.querySelector("td.header");
        if (headerElement) {
            return headerElement.textContent.trim();
        } else {
            return "Header not found";
        }
    }
})();
