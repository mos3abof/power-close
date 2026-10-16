(function () {
    'use strict';

    const input = document.getElementById('keyword');
    const matches = document.getElementById('matches-text');
    const closeButton = document.getElementById('close');
    const done = document.getElementById('done');
    const doneText = document.getElementById('done-text');

    // The tabs the keyword currently matches. Counted as the keyword is
    // typed, and closed when the action is taken, so the figure shown and
    // the tabs closed are the same list.
    let matching = [];

    function tabs(count) {
        return count === 1 ? '1 tab' : count + ' tabs';
    }

    // The same test the context menu closes by: the keyword anywhere in the
    // address.
    function tabMatches(tab, keyword) {
        return (tab.url || '').indexOf(keyword) !== -1;
    }

    function setAvailable(available) {
        closeButton.setAttribute('aria-disabled', available ? 'false' : 'true');
    }

    function recount() {
        const keyword = input.value.trim();

        chrome.tabs.query({}, function (allTabs) {
            const openCount = allTabs.length;
            matching = keyword ? allTabs.filter(function (tab) {
                return tabMatches(tab, keyword);
            }) : [];

            if (!keyword) {
                matches.textContent = 'Type to see how many tabs match.';
                closeButton.textContent = 'Close tabs';
                setAvailable(false);
                return;
            }

            if (matching.length === 0) {
                matches.textContent = 'No open tabs match. Nothing will close.';
                closeButton.textContent = 'Close tabs';
                setAvailable(false);
                return;
            }

            matches.textContent = 'Closes ' + matching.length + ' of ' +
                openCount + (openCount === 1 ? ' open tab.' : ' open tabs.');
            closeButton.textContent = 'Close ' + tabs(matching.length);
            setAvailable(true);
        });
    }

    function closeMatching() {
        if (closeButton.getAttribute('aria-disabled') === 'true') {
            return;
        }

        const closing = matching.length;

        chrome.tabs.remove(matching.map(function (tab) {
            return tab.id;
        }), function () {
            doneText.textContent = 'Closed ' + tabs(closing) + '.';
            done.hidden = false;
            input.value = '';
            input.focus();
            recount();
        });
    }

    input.addEventListener('input', function () {
        done.hidden = true;
        recount();
    });

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            closeMatching();
        }
    });

    closeButton.addEventListener('click', closeMatching);

    document.getElementById('dismiss').addEventListener('click', function () {
        window.close();
    });

    input.focus();
    recount();
})();
