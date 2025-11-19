const postsContainer = document.getElementById('posts');
        const form = document.getElementById('postForm');
        const countrySelect = document.getElementById('country');
        const dateInput = document.getElementById('date');
        const messageInput = document.getElementById('message');

        const fallbackCountries = [
            { name: "Kazakhstan", flag: "🇰🇿" },
            { name: "Russia", flag: "🇷🇺" },
            { name: "USA", flag: "🇺🇸" },
            { name: "France", flag: "🇫🇷" },
            { name: "Germany", flag: "🇩🇪" }
        ];
        async function loadCountries() {
            try {
                const res = await fetch('https://restcountries.com/v3.1/all');
                if (!res.ok) throw new Error("Ошибка запроса: " + res.status);
                const data = await res.json();

                if (!Array.isArray(data)) throw new Error("Некорректный ответ API");

                data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                data.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.name.common;
                    option.textContent = `${c.flag || ''} ${c.name.common}`;
                    option.dataset.flag = c.flag || '';
                    countrySelect.appendChild(option);
                });
            } catch (err) {
                console.warn("API не доступен, используем резервный список:", err.message);
                fallbackCountries.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.name;
                    option.textContent = `${c.flag} ${c.name}`;
                    option.dataset.flag = c.flag;
                    countrySelect.appendChild(option);
                });
            }
        }

        function loadPosts() {
            postsContainer.innerHTML = '';
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.forEach((post, index) => renderPost(post, index));
        }
        function savePosts(posts) {
            localStorage.setItem('posts', JSON.stringify(posts));
        }
        function renderPost(post, index) {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `
        <div class="post-header">
          <strong>Post #${index + 1}</strong> at ${post.date} being in: 
          <b>${post.country}</b> ${post.flag || ''}
          <span class="remove" onclick="removePost(${index})">✖ Remove</span>
        </div>
        <div>${post.message}</div>
      `;
            postsContainer.appendChild(div);
        }

        function removePost(index) {
            if (!confirm("Вы действительно хотите удалить эту запись?")) return;
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.splice(index, 1);
            savePosts(posts);
            loadPosts();
        }
        form.addEventListener('submit', e => {
            e.preventDefault();
            const country = countrySelect.value;
            const flag = countrySelect.selectedOptions[0].dataset.flag || '';
            const date = dateInput.value;
            const message = messageInput.value;

            if (!country || !date || !message) {
                return alert("Заполните все поля!");
            }

            const newPost = { country, flag, date, message };
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.push(newPost);
            savePosts(posts);
            loadPosts();

            form.reset();
        });

        loadCountries();
        loadPosts();
