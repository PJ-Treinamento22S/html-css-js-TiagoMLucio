async function getData() {
    /* Get the products information in a json type */
    const response = await fetch(
        'https://api.json-generator.com/templates/BQZ3wDrI6ts0/data?access_token=n7lhzp6uj5oi5goj0h2qify7mi2o8wrmebe3n5ad'
    );

    const data = await response.json();

    const wrapper = document.getElementById('wrapper');
    const extraLeft = document.getElementById('extraLeft');
    const left = document.getElementById('left');
    const middle = document.getElementById('middle');
    const right = document.createElement('div');
    right.id = 'right';

    right.innerHTML = `            
    <h2 class="sectionTitle">Usuários</h2>
    <ul id="userList">
    </ul>`;

    wrapper.append(right);

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
        const action = window.innerWidth > 780 ? 'remove' : 'add';
        left.classList[action]('hidden');
        right.classList[action]('hidden');
    }

    function postTimeSorted() {
        msgs.sort(
            (a, b) =>
                new Date(a.created_at).getTime() >
                    new Date(b.created_at).getTime() || -1
        ).forEach(msg => {
            postMsg(msgList, msg);
        });
    }

    window.addEventListener('resize', setUserWrapper);

    window.addEventListener('resize', hideExtraDetails);

    window.addEventListener('resize', hideFiltersAndUsers);

    const users = setUsers(data);

    const msgs = getMsgs(data);

    const msgList = document.getElementById('pius');

    setUserWrapper();
    hideExtraDetails();
    postTimeSorted();

    const textArea = document.getElementById('createPiuText');

    const search = document.getElementById('searchBar');

    const characterElement = document.getElementById('wordCount');

    const warningMsg = document.getElementById('warning');

    const buttons = document.querySelectorAll('.ordering');

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
        removeActivated();
        favoritesButton.classList.remove('activated');
        msgs.forEach(msg => msg.msgElement.classList.remove('hidden'));

        msgs.filter(
            msg =>
                msg.username.toLowerCase().includes(this.value.toLowerCase()) ||
                msg.first_name
                    .toLowerCase()
                    .includes(this.value.toLowerCase()) ||
                msg.last_name.toLowerCase().includes(this.value.toLowerCase())
        ).forEach(msg => msg.msgElement.classList.remove('hidden'));
        msgs.filter(
            msg =>
                !msg.username
                    .toLowerCase()
                    .includes(this.value.toLowerCase()) &&
                !msg.first_name
                    .toLowerCase()
                    .includes(this.value.toLowerCase()) &&
                !msg.last_name.toLowerCase().includes(this.value.toLowerCase())
        ).forEach(msg => msg.msgElement.classList.add('hidden'));
    });

    document.getElementById('postPiu').addEventListener('click', function () {
        characterCount = parseInt(characterElement.innerText.split('/')[0]);
        if (characterCount === 0 || characterCount > 140) {
            warningMsg.innerText = `Não é possível enviar Pius ${
                characterCount === 0 ? 'vazios' : 'com mais de 140 caracteres'
            }`;
            warningMsg.classList.remove('hidden');
        } else {
            myNewPiu = createPiu(
                undefined,
                'images/UserAvatar.png',
                'tiagolucio',
                textArea.value,
                'Tiago',
                'Lucio',
                new Date() - 1000,
                new Date() - 1000
            );
            msgs.push(myNewPiu);
            postMsg(msgList, myNewPiu);

            clear();
            removeActivated();
            favoritesButton.classList.remove('activated');
            msgs.forEach(msg => msg.msgElement.classList.remove('hidden'));
            search.value = '';

            textArea.value = '';
            characterElement.innerText = `0/140`;
            characterElement.classList.remove('green', 'yellow', 'red');
            characterElement.classList.add('var(--gray)');
            warningMsg.classList.add('hidden');
        }
    });

    function clear(button) {
        msgList.innerHTML = '';
        postTimeSorted();
        button?.classList.remove('activated');
    }

    function removeActivated(currentButton) {
        buttons.forEach(
            button =>
                button !== currentButton && button.classList.remove('activated')
        );
    }

    const favoritesButton = document.getElementById('favorites');

    favoritesButton.addEventListener('click', function () {
        this.classList.toggle('activated');
        if (this.classList.contains('activated'))
            msgs.forEach(
                msg =>
                    msg.msgElement.querySelector('.addedBookmark') ||
                    msg.msgElement.classList.add('hidden')
            );
        else {
            this.classList.remove('activated');
            search.value = '';
            msgs.forEach(msg => msg.msgElement.classList.remove('hidden'));
        }
    });

    document
        .getElementById('UsernameAToZ')
        .addEventListener('click', function () {
            this.classList.toggle('activated');

            if (this.classList.contains('activated')) {
                removeActivated(this);
                msgList.innerHTML = '';
                msgs.sort(
                    (a, b) =>
                        a.username.toLowerCase() < b.username.toLowerCase() ||
                        -1
                ).forEach(msg => postMsg(msgList, msg));
            } else clear(this);
        });

    document
        .getElementById('UsernameZToA')
        .addEventListener('click', function () {
            removeActivated(this);
            this.classList.toggle('activated');

            if (this.classList.contains('activated')) {
                msgList.innerHTML = '';
                msgs.sort(
                    (a, b) =>
                        a.username.toLowerCase() > b.username.toLowerCase() ||
                        -1
                ).forEach(msg => postMsg(msgList, msg));
            } else clear(this);
        });

    document.getElementById('Size1To9').addEventListener('click', function () {
        removeActivated(this);
        this.classList.toggle('activated');

        if (this.classList.contains('activated')) {
            msgList.innerHTML = '';
            msgs.sort((a, b) => b.text.length > a.text.length || -1).forEach(
                msg => postMsg(msgList, msg)
            );
        } else clear(this);
    });

    document.getElementById('Size9To1').addEventListener('click', function () {
        removeActivated(this);
        this.classList.toggle('activated');

        if (this.classList.contains('activated')) {
            msgList.innerHTML = '';
            msgs.sort((a, b) => a.text.length - b.text.length).forEach(msg =>
                postMsg(msgList, msg)
            );
        } else clear(this);
    });

    //     document.getElementById('clear').addEventListener('click', clear);
}

getData();

function setUsers(data) {
    return data
        .map(msgData => {
            const { id, username, first_name, last_name, photo } = msgData.user;
            if (document.getElementById(id)) return;

            const userList = document.getElementById('userList');
            const userElement = document.createElement('li');
            userElement.id = id;
            userElement.innerHTML = `
                <img
                src="${photo || 'images/ProfileDark.svg'}"
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

function postMsg(msgList, { msgElement: msg, created_at }) {
    msg.querySelector('.createdTime').innerText = getCreatedTime(created_at);
    msgList.prepend(msg);
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
    const msgElement = document.createElement('div');
    if (msgId) msgElement.id = msgId;

    msgElement.classList.add('piu');

    msgElement.innerHTML = `                    
        <div class="user">
            <img
                src="${photo || 'images/Profile.svg'}"
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
                        src="images/Likes.svg"
                        alt="like"
                        class="reactionIcon, like"
                    />
                    <p class="amount">0</p>
                </div>
                <img
                    src="images/BookmarkMsg.svg"
                    alt="comment"
                    class="reactionIcon, bookmark"
                />
                <img
                    src="images/Share.svg"
                    alt="share"
                    class="reactionIcon"
                />
            </div>
        </div>`;

    msgElement.querySelector('.piuText').innerText = text;

    msgElement.querySelector('.like').addEventListener('click', function () {
        let likes = this.nextElementSibling;
        if (this.classList.contains('addedLike')) {
            likes.innerText--;
            this.src = 'images/Likes.svg';
        } else {
            likes.innerText++;
            this.src = 'images/RedLikes.svg';
        }
        this.classList.toggle('addedLike');
    });

    msgElement
        .querySelector('.bookmark')
        .addEventListener('click', function () {
            if (this.classList.contains('addedBookmark'))
                this.src = 'images/BookmarkMsg.svg';
            else this.src = 'images/RedBookmarkMsg.svg';

            this.classList.toggle('addedBookmark');
        });

    return {
        msgElement,
        username,
        text,
        first_name,
        last_name,
        created_at,
        updated_at,
    };
}
