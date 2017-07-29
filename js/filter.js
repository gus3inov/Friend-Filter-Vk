var filter = document.querySelector('.filter-wrap');

showFilter.onclick = function() {
    filter.style.transform = 'scale(1)';
    showFilter.style.display = 'none';
}

closeFilter.onclick = function() {
    filter.style.transform = 'scale(0)';
    showFilter.style.display = 'block';
}

new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 6127544
        });

        VK.Auth.login(function(response) {

            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Could not log in !'));
            }
        }, 2)
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.api('users.get', { 'name_case': 'gen' }, function(response) {

            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                titleList.textContent = "Друзья " + response.response[0].first_name + ' ' + response.response[0].last_name;

                resolve();
            }
        });
    })
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.api('friends.get', { 'fields': 'nickname, photo_50, id' }, function(response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                var source = friendsList.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({ list: response.response });


                listFriends.innerHTML = template;

                resolve({serverAsk: response.response, temp: template});
            }
        })
    })
}).then(function({serverAsk, temp}) {

    return new Promise(function(resolve, reject) {

        var addUserButton = document.querySelectorAll("#listFriends #addUser");



        friendsListWindow.onclick = function(e) {

            if (e.target.getAttribute('data-role') === 'addUser') {

                var currentTarg = e.target.closest("li"),
                    targetChild = e.target;
                targetChild.className = "fa fa-times";

                secondListGroup.appendChild(currentTarg);

            }

        }

        secondListGroup.onclick = function(e) {

            if (e.target.getAttribute('data-role') === 'addUser') {

                var currentTarg = e.target.closest("li"),
                    targetChild = e.target;

                targetChild.className = "fa fa-plus";

                friendsListWindow.appendChild(currentTarg);

            }

        }
        resolve({serverAsk, temp});
       

    })
}).then(function({serverAsk, temp}) {


    inpFriends.oninput = function(e) {



        var currentVal = this.value.trim();

        if (currentVal) {

            friendsListWindow.innerHTML = "";
        
    

            for (var i = 0; i < serverAsk.length; i++) {
                var nameVal = `${serverAsk[i].first_name}  ${serverAsk[i].last_name}`;

                if (nameVal.trim().indexOf(currentVal) !== -1) {

                    friendsListWindow.appendChild(temp);

                }   

            }
    }else{
        e.preventDefault();
    }



    }

})