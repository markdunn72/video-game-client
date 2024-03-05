Vue.component('video-game-table', {
props: ['videoGames'],
template: `
 <div class="overflow-x-auto"> 
    <table class="border border-gray-700">
        <thead>
            <tr>
                <th class="border px-4 py-2">UPC</th> 
                <th class="border px-4 py-2">Title</th>
                <th class="border px-4 py-2">Genre</th>
                <th class="border px-4 py-2">Platform</th>
                <th class="border px-4 py-2">Release Year</th>
                <th class="border px-4 py-2">Developer</th>
                <th class="border px-4 py-2">Publisher</th>
                <th class="border px-4 py-2">Description</th>
                <th class="border px-4 py-2">Metacritic Rating</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="videoGames.length > 0" v-for="game in videoGames" :key="game.name">
                <td class="border px-4 py-2 text-light-gray bg-gray-800 rounded-tl">{{game.upc}}</td> 
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.title}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.genre}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.platform}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.release_year}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.developer}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.publisher}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800">{{game.description}}</td>
                <td class="border px-4 py-2 text-light-gray bg-gray-800 rounded-tr">{{game.metacritic_rating}}</td>
            </tr>
            </tbody>
    </table>
  </div>
`
});

Vue.component('new-game-form', {
    template: `
    <form @submit.prevent="submitForm" class="mt-4">
      <input type="text" v-model="upc" placeholder="UPC" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3"> 
      <input type="text" v-model="title" placeholder="Title" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3"> 
      <input type="text" v-model="genre" placeholder="Genre" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3">
      <input type="text" v-model="platform" placeholder="Platform" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3">
      <div class="mb-2"> 
        <label for="release_year" class="block my-2 text-sm font-medium">Release Year</label>
        <select id="release_year" v-model="release_year" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3">
        </select>
      </div>
      <input type="text" v-model="developer" placeholder="Developer" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3">
      <input type="text" v-model="publisher" placeholder="Publisher" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3">
      <div class="mb-2">
        <label for="description" class="block my-2 text-sm font-medium">Description</label>
        <textarea id="description" v-model="description" rows="4" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3"></textarea>
      </div>
      <input type="number" v-model="metacritic_rating" placeholder="Metacritic Rating" class="border border-gray-700 bg-gray-800 text-light-gray focus:bg-gray-700 focus:border-blue-500 rounded w-64 py-2 px-3"> 
    
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Game</button>
    </form>
    `,
    data() {
        return {
          upc: '',
          title: '',
          genre: '',
          platform: '',
          release_year: '',
          developer: '',
          publisher: '',
          description: '',
          metacritic_rating: ''
        }
    },
    methods: {
        submitForm() {
            const newGame = {
              upc: this.upc,
              title: this.title,
              genre: this.genre,
              platform: this.platform,
              release_year: this.release_year,
              developer: this.developer,
              publisher: this.publisher,
              description: this.description,
              metacritic_rating: this.metacritic_rating
            };
            axios.post('/video_games', newGame)
                .then(response => {
                    this.$emit('game-added', response.data);
                })
                .catch(error => {
                    console.error('Error adding game:', error);
                    // Handle error (e.g., display feedback)
                });
        }
    }
});

new Vue({
    el: '#app',
    data: {
        games: []
    },
    mounted() {
        const yearSelect = document.getElementById('release_year');
        const currentYear = new Date().getFullYear();
        const startYear = 1980;

        for (let year = currentYear; year >= startYear; year--) {
            let option = document.createElement('option');
            option.value = year;
            option.text = year;
            yearSelect.appendChild(option);
        }

        axios.get('/video_games')
            .then(response => {
                this.games = response.data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle error (e.g., display message)
            });
    },
    methods: {
        addGame(game) {
            Vue.set(this.games, this.games.length, game);
        }
    }
});