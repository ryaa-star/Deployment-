const tabContainer = document.getElementById('tabContainer');

tabContainer.addEventListener('click', function (e) {

    const clickedTab = e.target.closest('.tab');
    if (!clickedTab) return;


    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });


    clickedTab.classList.add('active');


    const contents = document.querySelectorAll('.content');
    contents.forEach(function (content) {
        content.classList.remove('active');
    });


    const id = clickedTab.dataset.tab;
    const selectedContent = document.getElementById(id);
    selectedContent.classList.add('active');

});
