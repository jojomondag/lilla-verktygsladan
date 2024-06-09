// popup.js
(function() {
    chrome.storage.sync.get().then((options) => {
        if (!options["init"]) { options = {"tool_gruppslump": true}; }
        disableButtons(options);
        assignButtons(options);
    });

    document.getElementById('fetch-schedule').addEventListener('click', () => {
        console.log("Fetching schedule...");
        fetchSchedule();
    });

})();

function sendCommand(setup) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, setup);
    });
}

function openOptions() {
    chrome.runtime.openOptionsPage();
}

function disableButtons(options) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        let buttons = document.querySelectorAll("button");
        for (let button of buttons) {
            if (button.getAttribute("data-checkfor")) {
                if (!tab[0].url.includes(button.getAttribute("data-checkfor"))) {
                    button.classList.toggle("btn-magenta");
                    button.classList.toggle("btn-secondary");
                    button.classList.toggle("disabled");
                }
            }
        }
    });
}

function assignButtons(options) {
    let automatic_buttons = document.querySelectorAll("button[data-href]");
    for (let button of automatic_buttons) {
        if (button.classList.contains("disabled")) { continue; }
        let href = button.getAttribute("data-href");
        if (options.debug_mode && options.debug_href) { href = options.debug_href; }

        let setup = {
            action: "openlink",
            href: href
        };
        if (button.getAttribute("data-method")) { setup.method = button.getAttribute("data-method"); }
        if (button.getAttribute("data-filter")) { setup.filter = button.getAttribute("data-filter"); }

        button.onclick = () => sendCommand(setup);
    }
}

function fetchSchedule() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "fetch_schedule" }, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
                alert('Error: ' + chrome.runtime.lastError.message);
            } else {
                console.log("Message sent:", response);
            }
        });
    });
}
