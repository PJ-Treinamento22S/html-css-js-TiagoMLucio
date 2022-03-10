async function getData() {
    /* Get the messages information in a json type */
    const response = await fetch(
        'https://api.json-generator.com/templates/BQZ3wDrI6ts0/data?access_token=n7lhzp6uj5oi5goj0h2qify7mi2o8wrmebe3n5ad'
    );

    const data = await response.json();

    /* Get Main Elements */
    const wrapper = document.getElementById('wrapper');
    const extraLeft = document.getElementById('extraLeft');
    const left = document.getElementById('left');
    const middle = document.getElementById('middle');
    const right = document.createElement('div');

    /* Set Right (Users) Wrapper */
    right.id = 'right';
    right.innerHTML = `            
    <h2 class="sectionTitle">Usuários</h2>
    <ul id="userList">
    </ul>`;
    wrapper.append(right);

    /* Responsiveness */
    function setUserWrapper() {
        (window.innerWidth < 1260 ? extraLeft : wrapper).append(right);
        middle.classList[window.innerWidth < 1260 ? 'remove' : 'add'](
            'margin-right'
        );
    }

    function hideExtraDetails() {
        [
            ...document.querySelectorAll('.nameAndUser'),
            ...document.querySelectorAll('.filterType'),
        ].map(el =>
            el.classList[window.innerWidth > 900 ? 'remove' : 'add']('hidden')
        );
        left.classList[window.innerWidth < 900 ? 'remove' : 'add']('min-width');
        middle.classList[window.innerWidth > 900 ? 'remove' : 'add']('width');
    }

    function hideFiltersAndUsers() {
        const action = window.innerWidth > 700 ? 'remove' : 'add';
        left.classList[action]('hidden');
        right.classList[action]('hidden');
    }

    window.addEventListener('resize', setUserWrapper);

    window.addEventListener('resize', hideExtraDetails);

    window.addEventListener('resize', hideFiltersAndUsers);

    /* Set Users and Post messages */
    function orderTime() {
        msgs.sort(
            (a, b) =>
                new Date(a.created_at).getTime() >
                    new Date(b.created_at).getTime() || -1
        ).forEach(msg => {
            postMsg(msgList, msg);
        });
    }

    setUsers(data);

    const msgs = getMsgs(data);

    const msgList = document.getElementById('pius');

    setUserWrapper();
    hideExtraDetails();
    orderTime();

    /* Get Inputs/Buttons Elements */
    const textArea = document.getElementById('createPiuText');

    const search = document.getElementById('searchBar');

    const characterElement = document.getElementById('characterCount');

    const warningMsg = document.getElementById('warning');

    const favoritesButton = document.getElementById('favorites');

    const orderingButtons = document.querySelectorAll('.ordering');

    /* Pius and Buttons Functions */
    function clear() {
        msgList.innerHTML = '';
        orderTime();
    }

    function removeActivated(currentButton) {
        orderingButtons.forEach(
            button =>
                button !== currentButton && button.classList.remove('activated')
        );
    }

    function filterFavorites() {
        msgs.forEach(
            msg =>
                msg.element.querySelector('.addedBookmark') ||
                msg.element.classList.add('hidden')
        );
    }

    function orderUsernameAToZ() {
        removeActivated(orderingButtons[0]);
        msgList.innerHTML = '';
        msgs.sort(
            (a, b) => a.username.toLowerCase() < b.username.toLowerCase() || -1
        ).forEach(msg => postMsg(msgList, msg));
    }

    function orderUsernameZToA() {
        removeActivated(orderingButtons[1]);
        msgList.innerHTML = '';
        msgs.sort(
            (a, b) => a.username.toLowerCase() > b.username.toLowerCase() || -1
        ).forEach(msg => postMsg(msgList, msg));
    }

    function orderSize1To9() {
        button = orderingButtons[2];
        removeActivated(button);
        msgList.innerHTML = '';
        msgs.sort((a, b) => b.text.length > a.text.length || -1).forEach(msg =>
            postMsg(msgList, msg)
        );
    }

    function orderSize9To1() {
        button = orderingButtons[3];
        removeActivated(button);
        msgList.innerHTML = '';
        msgs.sort((a, b) => a.text.length - b.text.length).forEach(msg =>
            postMsg(msgList, msg)
        );
    }

    const buttonCallback = i => {
        switch (i) {
            case -1:
                return filterFavorites;
            case 0:
                return orderUsernameAToZ;
            case 1:
                return orderUsernameZToA;
            case 2:
                return orderSize1To9;
            case 3:
                return orderSize9To1;
            default:
                return orderTime;
        }
    };

    function filterSearch() {
        const searchContent = searchBar.value.toLowerCase();
        msgs.forEach(msg => {
            if (
                msg.username.toLowerCase().includes(searchContent) ||
                msg.first_name.toLowerCase().includes(searchContent) ||
                msg.last_name.toLowerCase().includes(searchContent)
            )
                msg.element.classList.remove('hidden');
            else msg.element.classList.add('hidden');
        });
    }

    function reorderAndFilter() {
        if (favoritesButton.classList.contains('activated')) {
            buttonCallback(-1)();
        }
        [...orderingButtons].findIndex((button, i) => {
            if (button.classList.contains('activated')) buttonCallback(i)();
        });
    }

    //Verify character count
    textArea.addEventListener('keyup', function () {
        const characterCount = this.value.length;
        characterElement.innerText = `${characterCount}/140`;

        characterElement.classList.remove('green', 'yellow', 'red');
        characterElement.classList.add(
            characterCount === 0
                ? 'var(--gray)'
                : characterCount < 120
                ? 'green'
                : characterCount <= 140
                ? 'yellow'
                : 'red'
        );
    });

    searchBar.addEventListener('keyup', function () {
        clear();
        filterSearch();
        reorderAndFilter();
    });

    document.getElementById('postPiu').addEventListener('click', function () {
        characterCount = parseInt(characterElement.innerText.split('/')[0]);
        if (characterCount === 0 || characterCount > 140) {
            warningMsg.innerText = `Não é possível enviar Pius ${
                characterCount === 0 ? 'vazios' : 'com mais de 140 caracteres'
            }`;
            warningMsg.classList.remove('hidden');
            return;
        }

        myNewPiu = createPiu(
            undefined,
            '../images/UserAvatar.png',
            'tiagolucio',
            textArea.value,
            'Tiago',
            'Lucio',
            new Date() - 1000,
            new Date() - 1000
        );
        msgs.push(myNewPiu);
        postMsg(msgList, myNewPiu);
        filterSearch();
        reorderAndFilter();

        //Reset text elements
        textArea.value = '';
        characterElement.innerText = `0/140`;
        characterElement.classList.remove('green', 'yellow', 'red');
        characterElement.classList.add('var(--gray)');
        warningMsg.classList.add('hidden');
    });

    favoritesButton.addEventListener('click', function () {
        this.classList.toggle('activated');
        if (this.classList.contains('activated')) filterFavorites();
        else {
            msgs.forEach(msg => msg.element.classList.remove('hidden'));
            filterSearch();
        }
    });

    orderingButtons.forEach((button, i) =>
        button.addEventListener('click', function () {
            this.classList.toggle('activated');
            if (this.classList.contains('activated')) buttonCallback(i)();
            else clear(this);
        })
    );
}

getData();

function setUsers(data) {
    const userList = document.getElementById('userList');

    return data
        .map(msgData => {
            const { id, username, first_name, last_name, photo } = msgData.user;

            //User Already Exists
            if (document.getElementById(id)) return;

            const userElement = document.createElement('li');

            //Set Users
            userElement.id = id;
            userElement.innerHTML = `
                <img
                src="${photo || '../images/ProfileDark.svg'}"
                alt=""
                class="avatar"
                />
                <div class="nameAndUser">
                    <p class="name">${first_name + ' ' + last_name}</p>
                    <p class="username">@${username}</p>
                </div>
                <button>Follow</button>`;
            userList.append(userElement);

            return msgData.user;
        })
        .filter(user => user);
}

function getMsgs(data) {
    return data.map(msgData => {
        const {
            id: msgId,
            user: { username, first_name, last_name, photo },
            text,
            created_at,
            updated_at,
        } = msgData;

        return createPiu(
            msgId,
            photo,
            username,
            text,
            first_name,
            last_name,
            created_at,
            updated_at
        );
    });
}

const getCreatedTime = created_at => {
    const diff = new Date() - new Date(created_at);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (days === 1) return 'Yesterday';
    return `${years || months || days || hours || minutes || seconds || '0'} ${
        years > 1
            ? 'years'
            : years === 1
            ? 'year'
            : months > 1
            ? 'months'
            : months === 1
            ? 'month'
            : days > 1
            ? 'days'
            : hours > 1
            ? 'hours'
            : hours === 1
            ? 'hour'
            : minutes > 1
            ? 'minutes'
            : minutes === 1
            ? 'minute'
            : seconds !== 1
            ? 'seconds'
            : 'second'
    } ago`;
};

function postMsg(msgList, { element, created_at }) {
    element.querySelector('.createdTime').innerText =
        getCreatedTime(created_at);
    msgList.prepend(element);
}

function createPiu(
    msgId,
    photo,
    username,
    text,
    first_name,
    last_name,
    created_at,
    updated_at
) {
    const element = document.createElement('div');
    if (msgId) element.id = msgId;

    element.classList.add('piu');

    element.innerHTML = `                    
        <div class="user">
            <img
                src="${photo || '../images/Profile.svg'}"
                alt=""
                class="avatar"
            />
            <p class="username">@${username}</p>
        </div>
        <div class="piuBox">
            <p class="piuText"></p>
            <p class="createdTime">${getCreatedTime(created_at)}</p>
            <div class="reactions">
                <div class="likeData">
                    <img
                        src="../images/Likes.svg"
                        alt="like"
                        class="reactionIcon, like"
                    />
                    <p class="amount">0</p>
                </div>
                <img
                    src="../images/BookmarkMsg.svg"
                    alt="comment"
                    class="reactionIcon, bookmark"
                />
                <img
                    src="../images/Share.svg"
                    alt="share"
                    class="reactionIcon"
                />
            </div>
        </div>`;

    element.querySelector('.piuText').innerText = text;

    element.querySelector('.like').addEventListener('click', function () {
        let likes = this.nextElementSibling;
        if (this.classList.contains('addedLike')) {
            likes.innerText--;
            this.src = '../images/Likes.svg';
        } else {
            likes.innerText++;
            this.src = '../images/RedLikes.svg';
        }
        this.classList.toggle('addedLike');
    });

    element.querySelector('.bookmark').addEventListener('click', function () {
        if (this.classList.contains('addedBookmark'))
            this.src = '../images/BookmarkMsg.svg';
        else this.src = '../images/RedBookmarkMsg.svg';

        this.classList.toggle('addedBookmark');
    });

    return {
        element,
        username,
        text,
        first_name,
        last_name,
        created_at,
        updated_at,
    };
}
