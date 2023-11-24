window.onload = () => {
    introJs().addHints();
    introJs()
        .setOption('dontShowAgain', false)
        .start();
}

openTab("account-info")
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
}