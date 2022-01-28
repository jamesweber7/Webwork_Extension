
var className = getClassName();
if (onClassPage()) {
    LocalStorage.get(data => {
        let classes = data.webwork_data.classes;
        let isInClasslist = false;
        for (let i = 0; i < classes.length && !isInClasslist; i++) {
            isInClasslist = (classes[i].name === className);
        }
        isInClasslist ? updateClass() : appendAddToClasslistButton();
    });
}

function appendAddToClasslistButton() {
    let btn = document.createElement('button');
    btn.setAttribute('class', 'nav_button btn btn-primary');
    btn.innerText = 'Add ' + className + ' To Classlist';
    btn.addEventListener('click', () => {
        addClass();
        btn.remove();
    });
    document.getElementById('page-title').append(btn);
}

function updateClass() {
    LocalStorage.get( data => {
        let classes = data.webwork_data.classes;
        let index;
        for (let i = 0; i < classes.length && !index; i++) {
            if (classes[i].name === className) {
                index = i;
            }
        }
        classes.splice(index, 1);

        var coolClass = {};
        coolClass.name = className;
        coolClass.link = getClassLinkText(window.location.href);

        var setRows = getSetRows();
        var sets = getSets(setRows, coolClass.link);

        coolClass.sets = sets;
        classes.push(coolClass);

        data.webwork_data.classes = classes;
        LocalStorage.setData(data);
    });
}

function onClassPage() {
    let url = window.location.href;
    return className && url.includes(className);
}

function getClassName() {
    if (document.getElementById('page-title')) {
        return document.getElementById('page-title').innerText;
    }
}

function addClass() {
    var coolClass = {};
    coolClass.name = className;
    coolClass.link = getClassLinkText(window.location.href);

    var setRows = getSetRows();
    var sets = getSets(setRows, coolClass.link);

    coolClass.sets = sets;

    saveClass(coolClass);
}

function saveClass(coolClass) {
    LocalStorage.getData( data => {
        data.webwork_data.classes.push(coolClass);
        LocalStorage.setData(data);
    });
}

function printWebworkClasses() {
    LocalStorage.getData( data => {
        console.log(data);
    });
}

function getSetDue(setDateText) {
    if (setDateText.includes('/')) {
        const DATE_FORMAT = 'xx/xx/xxxx';
        const DATE_INDEX_OFFSET = DATE_FORMAT.indexOf('/');
        var dateIndex = setDateText.indexOf('/') - DATE_INDEX_OFFSET;
        if (dateIndex >= 0) {
            return setDateText.substring(dateIndex, dateIndex + DATE_FORMAT.length);
        }
    }
    return null;
}

function getSets(setRows, link) {
    var sets = [];
    for (let i = 0; i < setRows.length; i++) {
        var set = {};
        const SET_ELEMENT_TAG_NAME = 'td';
        var setElements = [...setRows[i].getElementsByTagName(SET_ELEMENT_TAG_NAME)];
        var setName = [...setElements[0].getElementsByTagName('a')][0].innerText;
        var setDueText = setElements[1].innerText;
        var setDue = getSetDue(setDueText);
        var setLink = getSetLinkText(link, setName);
        if (setDue) {
            set.name = setName;
            set.due = setDue;
            set.link = setLink;
            sets.push(set);
        }
    }
    return sets;
}

function getSetRows() {

    const SET_TABLE_CLASS_NAME = 'problem_set_table';
    var setTable = [...document.getElementsByClassName(SET_TABLE_CLASS_NAME)][0];

    const TABLE_BODY_TAG_NAME = 'tbody';
    var tableBody = [...setTable.getElementsByTagName(TABLE_BODY_TAG_NAME)][0];

    const SET_ROW_TAG_NAME = 'tr';
    var setRows = [...tableBody.getElementsByTagName(SET_ROW_TAG_NAME)];

    const TABLE_BODY_REMOVAL_INDEX = 0;
    setRows.splice(TABLE_BODY_REMOVAL_INDEX, 1);

    return setRows;
}

function getClassLinkText(rawLink) {
    var classNameIndex = rawLink.indexOf(className);
    var linkText = rawLink.substring(0, classNameIndex + className.length);
    return linkText;
}

function getSetLinkText(link, setName) {
    let setLink = link + '/' +  setName.replaceAll(' ', '_');
    return setLink;
}

function iconImage() {

    let img = document.createElement('img');
    img.setAttribute('src', 'data:image/png;base64,' + getIconData());
    
    return img;
}

function getIconData() {
    return 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAALpJREFUWIXtlzEOwjAMRZ9RxMBUNiQuwYzEXqYKzsK5iphg5yzMcIOwxFITBSgStBnsKYkd+fkngy2z1QGA6WLtGcCazVIATtcbAJMhkr4zp5U/LnsAvI+FmG+P0f4HcXogUIACBmAABmAABmAABmAABmAArm/g/bwLq/z4oP60O/5koysgVd1GJb3q51PTSr+N7+aGAhRwBBLC41Z1C4CIZC+oP933je/kAwpQQDKE/5qSo8r174yuwBOeCja8Y+V+8QAAAABJRU5ErkJggg==';
}